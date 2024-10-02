const config = require('../../config/config');
const Expense = require('../../models/Expense');
const Category = require('../../models/Category');
const User = require('../../models/User');


// @desc Create Expense
// @route POST /v1/expenses
// @access Private
const createExpenseHandler = async (req, res) => {
    try {
        userId = req.user.id;
        let { amount, narration, CategoryId } = req.body;
        if (typeof amount !== 'number') {
            return res.status(400).json({
                message: 'Amount must be a number',
            });
        }

        if (typeof narration !== 'string') {
            return res.status(400).json({
                message: 'Narration must be a string',
            });
        }

        if (typeof CategoryId !== 'string') {
            return res.status(400).json({
                message: 'CategoryId must be a string',
            });
        }

        // confirm that the category exists
        const category = await Category.findByPk(CategoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        // confirm that the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const expense = await Expense.create({
            amount,
            narration,
        });

        expense.setCategory(category);
        expense.setUser(user);

        res.status(201).json(expense);
        return;
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createExpenseHandler,
}