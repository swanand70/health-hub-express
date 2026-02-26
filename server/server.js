const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const medicineRoutes = require("./routes/medicineRoutes");


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    family: 4
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.use("/api/medicines", medicineRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);