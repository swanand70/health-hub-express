const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    description: { type: String },
    inStock: { type: Number, required: true, default: 0 },
    prescriptionRequired: { type: Boolean, default: false },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } 
}, { timestamps: true });

// Ensure text indexes for fast searching
medicineSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model("Medicine", medicineSchema);
