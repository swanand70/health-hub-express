const router = require("express").Router();
const Medicine = require("../models/Medicine");
const auth = require("../middleware/authMiddleware");

// 🟢 PUBLIC → get all medicines (with optional search)
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        
        if (search) {
            query = { $text: { $search: search } };
        }
        
        // Populate the pharmacy field to get the pharmacyName and address
        const meds = await Medicine.find(query).populate('pharmacy', 'pharmacyName address name config');
        res.json(meds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🟢 PUBLIC → get a single medicine by ID
router.get("/:id", async (req, res) => {
    try {
        const med = await Medicine.findById(req.params.id).populate('pharmacy', 'pharmacyName address name');
        if (!med) return res.status(404).json({ message: "Medicine not found" });
        res.json(med);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 ADD medicine (ONLY pharmacist should use this)
router.post("/", auth, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ message: "Access denied. Only pharmacists can add medicines." });
        }

        const newMedicineData = {
            ...req.body,
            pharmacy: req.user.id // Link the medicine to the logged-in pharmacist
        };

        const med = new Medicine(newMedicineData);
        await med.save();
        res.status(201).json(med);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 UPDATE medicine (ONLY pharmacist who owns it)
router.put("/:id", auth, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const med = await Medicine.findOne({ _id: req.params.id, pharmacy: req.user.id });
        if (!med) return res.status(404).json({ message: "Medicine not found or access denied" });
        
        Object.assign(med, req.body);
        await med.save();
        res.json(med);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 DELETE medicine (ONLY pharmacist who owns it)
router.delete("/:id", auth, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const med = await Medicine.findOneAndDelete({ _id: req.params.id, pharmacy: req.user.id });
        if (!med) return res.status(404).json({ message: "Medicine not found or access denied" });
        
        res.json({ message: "Medicine deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 GET pharmacist's own inventory
router.get("/inventory/me", auth, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const meds = await Medicine.find({ pharmacy: req.user.id });
        res.json(meds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;