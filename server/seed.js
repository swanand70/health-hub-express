require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log("Connected to MongoDB for seeding...");

        try {
            await mongoose.connection.collection('users').dropIndex('username_1');
            console.log("Dropped outdated username index.");
        } catch (e) {
            // ignore if it doesn't exist
        }

        // Clear existing users to prevent duplicates during seeding
        await User.deleteMany({});
        console.log("Cleared existing users.");

        const hashedPassword = await bcrypt.hash("password123", 10);

        const users = [
            {
                name: "John Customer",
                email: "customer@test.com",
                password: hashedPassword,
                role: "customer"
            },
            {
                name: "Sarah Pharmacist",
                email: "pharmacist@test.com",
                password: hashedPassword,
                role: "pharmacist",
                pharmacyName: "Health Plus Care",
                address: "123 Healthy Avenue, Medical District"
            },
            {
                name: "David Pharmacist",
                email: "pharma2@test.com",
                password: hashedPassword,
                role: "pharmacist",
                pharmacyName: "City Core Meds",
                address: "45 Downtown Blvd"
            }
        ];

        await User.insertMany(users);
        console.log("Database successfully seeded with demo accounts:");
        users.forEach(u => console.log(`- ${u.role}: ${u.email} / password123`));

        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();
