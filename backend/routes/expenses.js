const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// CREATE
router.post("/", async (req, res) => {
    try {
        const expense = new Expense(req.body);
        const saved = await expense.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json(error);
    }
});

// READ ALL
router.get("/", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updated = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;