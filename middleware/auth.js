const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');



const validateToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: 'Authorization header is required',
            })
        }

        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Invalid Token',
            });
        }

        const payload = jwt.verify(token, config.jwtSecret);
        if (!payload) {
            return res.status(401).json({
                message: 'Invalid Token',
            });
        }

        const user = await User.findByPk(payload.id);
        if (!user) {
            return res.status(401).json({
                message: 'Error fetching user',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = validateToken;
