const mongoose = require("mongoose");
require("dotenv").config();

const Medicine = require("./models/Medicine");

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("MongoDB connected");

    await Medicine.deleteMany();

    await Medicine.insertMany([
        {
            name: "Crocin",
            category: "otc",
            price: 50,
            quantity: 100,
            description: "Fever and pain relief",
        },
        {
            name: "Dolo 650",
            category: "otc",
            price: 30,
            quantity: 200,
            description: "Paracetamol tablet",
        },
        {
            name: "Amoxicillin",
            category: "prescription",
            price: 120,
            quantity: 50,
            description: "Antibiotic",
        },
        {
            name: "Relent",
            category: "prescription",
            price: 140,
            quantity: 40,
            description: "Antibiotic"
        },
        {
            name: "Vitamin D",
            category: "wellness",
            price: 80,
            quantity: 40,
            description: "Bone health supplement"
        },
        {
            name: "Augmentin",
            category: "prescription",
            price: 120,
            quantity: 25,
            description: "Antibiotic"
        }
    ]);

    console.log("Medicines added");
    process.exit();
});
