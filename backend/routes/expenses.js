const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.get('/', auth, expenseController.getExpenses);
router.post('/', auth, expenseController.createExpense);
router.get('/summary/:year/:month', auth, expenseController.getMonthlySummary);
router.delete('/:id', auth, expenseController.deleteExpense);

module.exports = router;