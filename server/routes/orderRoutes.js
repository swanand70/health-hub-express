const router = require("express").Router();
const Order = require("../models/Order");
const Medicine = require("../models/Medicine");
const auth = require("../middleware/authMiddleware");

// 🔒 CUSTOMER: Place a new order
router.post("/", auth, async (req, res) => {
    try {
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: "Only customers can place orders." });
        }

        const { pharmacyId, items, deliveryAddress } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain items." });
        }

        // Calculate total amount and verify stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const medicine = await Medicine.findById(item.medicineId);
            if (!medicine) {
                return res.status(404).json({ message: `Medicine not found ${item.medicineId}` });
            }
            if (medicine.inStock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
            }
            
            totalAmount += medicine.price * item.quantity;
            orderItems.push({
                medicine: medicine._id,
                quantity: item.quantity,
                priceAtPurchase: medicine.price
            });

            // Decrease the stock temporarily (or do it when accepted, depends on logic, doing it now prevents double booking)
            medicine.inStock -= item.quantity;
            await medicine.save();
        }

        const order = new Order({
            customer: req.user.id,
            pharmacy: pharmacyId,
            items: orderItems,
            totalAmount,
            deliveryAddress
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 GET ALL MY ORDERS (Customer = their placed orders, Pharmacist = their received orders)
router.get("/me", auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'customer') {
            query = { customer: req.user.id };
        } else if (req.user.role === 'pharmacist') {
            query = { pharmacy: req.user.id };
        }

        const orders = await Order.find(query)
            .populate('customer', 'name email')
            .populate('pharmacy', 'pharmacyName')
            .populate('items.medicine', 'name category')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 PHARMACIST: Update order status (Accept/Reject/Ship)
router.patch("/:id/status", auth, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ message: "Only pharmacists can update order statuses." });
        }

        const { status } = req.body;
        const validStatuses = ["Pending", "Accepted", "Rejected", "Shipped", "Delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const order = await Order.findOne({ _id: req.params.id, pharmacy: req.user.id });
        if (!order) {
            return res.status(404).json({ message: "Order not found or access denied." });
        }

        // If rejected, restore stock
        if (status === "Rejected" && order.status !== "Rejected") {
            for (const item of order.items) {
                await Medicine.findByIdAndUpdate(item.medicine, { $inc: { inStock: item.quantity } });
            }
        }

        order.status = status;
        await order.save();
        
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
