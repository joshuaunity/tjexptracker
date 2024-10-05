const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    message: {
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
}, {
    timestamps: true,
});

Notification.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

module.exports = Notification;