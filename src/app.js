const express = require('express');
const cors = require('cors');
const sharedRoutes = require('../routes/v1/sharedRoutes');
const userRoutes = require('../routes/v1/userRoutes');
const categoryRoutes = require('../routes/v1/categoryRoutes');
const expenseRoutes = require('../routes/v1/expenseRoutes');
const notificationRoutes = require('../routes/v1/notificationRoutes');


const app = express();

// Middleware
const corsOptions = {
    origin: 'https://greenmark.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/v1/shared', sharedRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/categories', categoryRoutes);
app.use('/v1/expenses', expenseRoutes);
app.use('/v1/notifications', notificationRoutes);

module.exports = app;