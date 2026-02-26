const router = require("express").Router();
const Medicine = require("../models/Medicine");
const auth = require("../middleware/authMiddleware");


// 🟢 PUBLIC → get medicines (NO auth here)
router.get("/", async (req, res) => {
    try {
        const meds = await Medicine.find();
        res.json(meds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 🔒 ADD medicine (ONLY owner/admin should use this)
router.post("/", auth, async (req, res) => {
    try {
        const med = new Medicine(req.body);
        await med.save();
        res.json(med);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;