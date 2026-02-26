const router = require("express").Router();
const Medicine = require("../models/Medicine");
const auth = require("../middleware/authMiddleware");

// GET all medicines (protected)
router.get("/", auth, async (req, res) => {
    const meds = await Medicine.find();
    res.json(meds);
});

// ADD medicine
router.post("/", async (req, res) => {
    const med = new Medicine(req.body);
    await med.save();
    res.json(med);
});

module.exports = router;