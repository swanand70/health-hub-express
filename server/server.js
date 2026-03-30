const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const medicineRoutes = require("./routes/medicineRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */

// root
app.get("/", (req, res) => {
    res.send("Backend running");
});

// health route for uptime robot (prevents sleep)
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// API routes
app.use("/api/medicines", medicineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI, {
    family: 4   // fixes Render IPv6 issue
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});