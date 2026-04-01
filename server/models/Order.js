const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Rejected", "Shipped", "Delivered"], 
        default: "Pending" 
    },
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    paymentId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
