const express = require('express');
const { healthCheckHandler } = require('../../controllers/v1/sharedController');

const router = express.Router();

router.get('/health', healthCheckHandler);

module.exports = router;