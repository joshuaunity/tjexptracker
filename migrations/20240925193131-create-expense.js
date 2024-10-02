'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      narration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CategoryId: {
        type: Sequelize.UUID,
        references: {
          model: 'Categories',
          key: 'id',
        },
      },
      UserId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  }
};
