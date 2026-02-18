const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    quantity: Number,
    prescriptionRequired: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Medicine", medicineSchema);

