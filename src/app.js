const express = require('express');
const cors = require('cors');
const sharedRoutes = require('../routes/v1/sharedRoutes');
const userRoutes = require('../routes/v1/userRoutes');


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

module.exports = app;