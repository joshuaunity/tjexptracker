const express = require('express');
const {
    getUserNotificationsHandler,
} = require('../../controllers/v1/notificationController');
const validateToken = require('../../middleware/auth');


const router = express.Router();

router.get('/user', validateToken, getUserNotificationsHandler);

module.exports = router;