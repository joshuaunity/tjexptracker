const express = require('express');
const {
    createExpenseHandler,
    getExpensesHandler,
    getExpenseHandler,
    updateExpenseHandler,
    deleteExpenseHandler,
    getExpenseSummaryHandler,
    downloadExpenseStatementHandler,
} = require('../../controllers/v1/expenseController');
const validateToken = require('../../middleware/auth');

const router = express.Router();

router.get('/summary', validateToken, getExpenseSummaryHandler);
router.post('', validateToken, createExpenseHandler);
router.get('', validateToken, getExpensesHandler);
router.get('/:id', validateToken, getExpenseHandler);
router.put('/:id', validateToken, updateExpenseHandler);
router.delete('/:id', validateToken, deleteExpenseHandler);
router.get('/statement/download', validateToken, downloadExpenseStatementHandler);

module.exports = router;