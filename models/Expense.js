const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Category = require('./Category');

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    narration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    UserId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id',
        },
    },
    CategoryId: {
        type: DataTypes.UUID,
        references: {
            model: Category,
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

module.exports = Expense;