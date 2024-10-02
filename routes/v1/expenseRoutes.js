const express = require('express');
const { createExpenseHandler } = require('../../controllers/v1/expenseController');
const validateToken = require('../../middleware/auth');

const router = express.Router();

router.post('', validateToken, createExpenseHandler);

module.exports = router;