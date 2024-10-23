const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const Expense = require('../../models/Expense');
const Category = require('../../models/Category');
const { checkMonthlyBudget } = require('../../utils/shared');
const { error } = require('console');

// @desc Create Expense
// @route POST /v1/expenses
// @access Private
const createExpenseHandler = async (req, res) => {
    try {
        const user = req.user;
        const { amount, narration, categoryId } = req.body;
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

        if (typeof categoryId !== 'string') {
            return res.status(400).json({
                message: 'Category Id must be a string',
            });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        const hasExceededBudget = await checkMonthlyBudget(user.id);
        if (hasExceededBudget.message) {
            return res.status(500).json({
                message: hasExceededBudget.message,
            });
        }
        else if (hasExceededBudget) {
            return res.status(400).json({
                message: 'You have exceeded your monthly budget',
            });
        } else {
            const expense = await Expense.create({
                amount,
                narration,
            });

            expense.setUser(user);
            expense.setCategory(category);

            res.status(201).json(expense);
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Retrieve Expenses
// @route GET /v1/expenses
// @access Private
const getExpensesHandler = async (req, res) => {
    try {
        const user = req.user;
        let { search, filter, startDate, endDate } = req.query;

        if (filter) {
            if (typeof filter !== 'string') {
                return res.status(400).json({
                    message: 'Filter must be a string',
                });
            }

            const category = await Category.findOne({
                where: {
                    name: filter,
                },
            });
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found',
                });
            }
            // fetch all user expenses with the specified category
            const expenses = await Expense.findAll({
                where: {
                    UserId: user.id,
                    CategoryId: category.id,
                },
                order: [['createdAt', 'DESC']],
            });
            return res.status(200).json(expenses);
        }

        if (search) {
            if (typeof search !== 'string') {
                return res.status(400).json({
                    message: 'Search must be a string',
                });
            }

            // fetch all user expenses with the specified search term
            const expenses = await Expense.findAll({
                where: {
                    UserId: user.id,
                    narration: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                order: [['createdAt', 'DESC']],
            });
            return res.status(200).json(expenses);
        }


        // fetch all user expenses
        const expenses = await Expense.findAll({
            where: {
                UserId: user.id,
            },
            order: [['createdAt', 'DESC']],
        });

        if (startDate && endDate) {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            // add an extra day to the end date
            endDate.setDate(endDate.getDate() + 1);

            const expenses = await Expense.findAll({
                where: {
                    UserId: user.id,
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    }
                },
            });

            return res.status(200).json(expenses);
        }
        // const expenses = user.getExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Retrieve Expense
// @route GET /v1/expenses/:id
// @access Private
const getExpenseHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            });
        }

        res.status(200).json(expense);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Update Expense
// @route PUT /v1/expenses/:id
// @access Private
const updateExpenseHandler = async (req, res) => {
    try {
        const { amount, narration, categoryId } = req.body;
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        if (typeof narration !== 'string') {
            return res.status(400).json({
                message: 'Narration must be a string',
            });
        }

        if (typeof categoryId !== 'string') {
            return res.status(400).json({
                message: 'Category Id must be a string',
            });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            });
        }

        //update expense
        expense.amount = amount;
        expense.narration = narration;
        await expense.save();

        expense.setCategory(category);

        res.status(200).json(expense);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Delete Expense
// @route DELETE /v1/expenses/:id
// @access Private
const deleteExpenseHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            });
        }

        expense.destroy();
        res.status(204).json();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Get Expense Summary
// @route GET /v1/expenses/summary
// @access Private
const getExpenseSummaryHandler = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        const user = req.user;
        let expenses = [];

        if (startDate && endDate) {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            // add an extra day to the end date
            endDate.setDate(endDate.getDate() + 1);

            expenses = await Expense.findAll({
                where: {
                    UserId: user.id,
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    }
                },
            });
        } else {
            expenses = await Expense.findAll({
                where: {
                    UserId: user.id,
                },
            });
        }

        let total = 0;
        let average = 0;
        expenses.forEach(expense => {
            total += Number(expense.amount);
        });

        if (expenses.length > 0) {
            average = total / expenses.length;
        }

        return res.status(200).json({
            total,
            average,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Download Expense Statement
// @route GET /v1/expenses/statement/download
// @access Private
const downloadExpenseStatementHandler = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: {
                UserId: req.user.id,
            },
        });
        console.log("__dirname", __dirname);
        const filePath = path.join(__dirname, 'expenses.csv');

        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'amount', title: 'Amount' },
                { id: 'narration', title: 'Narration' },
                { id: 'createdAt', title: 'Created At' },
            ]
        });

        const expensesData = expenses.map(expense => ({
            id: expense.id,
            amount: expense.amount,
            narration: expense.narration,
            createdAt: expense.createdAt.toISOString().split('T')[0],
        }));

        await csvWriter.writeRecords(expensesData);

        res.download(filePath, 'expenses.csv', (error) => {
            if (error) {
                return res.status(500).json({
                    message: error.message,
                });
            }

            fs.unlinkSync(filePath); // deletes the file
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createExpenseHandler,
    getExpensesHandler,
    getExpenseHandler,
    updateExpenseHandler,
    deleteExpenseHandler,
    getExpenseSummaryHandler,
    downloadExpenseStatementHandler,
};


// create expense
// get all user expenses (filter by category)
// get single expense by id
// update expense
// delete expense