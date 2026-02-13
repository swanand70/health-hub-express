const router = require("express").Router();
const Medicine = require("../models/Medicine");

router.get("/", async (req, res) => {
    const meds = await Medicine.find();
    res.json(meds);
});

router.post("/", async (req, res) => {
    const med = new Medicine(req.body);
    await med.save();
    res.json(med);
});

module.exports = router;
