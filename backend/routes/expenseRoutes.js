const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   POST /expense
// @desc    Add new expense
// @access  Private
router.post('/expense', auth, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category) {
            return res.status(400).json({ message: 'Please provide required fields' });
        }

        const newExpense = new Expense({
            userId: req.user,
            title,
            amount,
            category,
            date: date || Date.now()
        });

        const expense = await newExpense.save();
        res.status(201).json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /expenses
// @desc    Get all expenses of logged-in user
// @access  Private
router.get('/expenses', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
