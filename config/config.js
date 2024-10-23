const dotenv = require('dotenv');

// loads the enviromental variables from the .env file
dotenv.config();

config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  jwtSecret: process.env.JWT_SECRET_KEY,
  expenseBudget: process.env.EXPENSE_BUDGET,
}

module.exports = config;
