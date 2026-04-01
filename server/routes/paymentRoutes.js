const router = require("express").Router();
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const auth = require("../middleware/authMiddleware");

// Initialize Razorpay with credentials from environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// 🔒 Create Razorpay Order
router.post("/create-order", auth, async (req, res) => {
    try {
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: "Only customers can create orders." });
        }

        const { amount, orderId } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Convert to paise (Razorpay uses smallest currency unit)
        const razorpayAmount = Math.round(amount * 100);

        const options = {
            amount: razorpayAmount,
            currency: "INR",
            receipt: `order_${orderId || Date.now()}`,
            notes: {
                userId: req.user.id,
                orderId: orderId || ''
            }
        };

        const order = await razorpay.orders.create(options);
        res.json({
            orderId: order.id,
            amount: order.amount / 100, // Convert back to rupees
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key'
        });
    } catch (err) {
        console.error("Razorpay order creation error:", err);
        res.status(500).json({ message: "Failed to create payment order", error: err.message });
    }
});

// 🔒 Verify Payment Signature
router.post("/verify-payment", auth, async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderId 
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment details" });
        }

        // Generate expected signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(sign.toString())
            .digest("hex");

        // Verify signature
        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        // Update order payment status in database
        if (orderId) {
            await Order.findOneAndUpdate(
                { _id: orderId, customer: req.user.id },
                { paymentStatus: "Paid", paymentId: razorpay_payment_id }
            );
        }

        res.json({ 
            verified: true, 
            message: "Payment verified successfully",
            paymentId: razorpay_payment_id
        });
    } catch (err) {
        console.error("Payment verification error:", err);
        res.status(500).json({ message: "Payment verification failed", error: err.message });
    }
});

// 🔒 Get payment status for an order
router.get("/status/:orderId", auth, async (req, res) => {
    try {
        const order = await Order.findOne({ 
            _id: req.params.orderId,
            $or: [
                { customer: req.user.id },
                { pharmacy: req.user.id }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            orderId: order._id,
            paymentStatus: order.paymentStatus,
            paymentId: order.paymentId || null,
            totalAmount: order.totalAmount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
