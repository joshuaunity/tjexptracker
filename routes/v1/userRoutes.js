const express = require('express');
const { createUserHandler, getUserHandler, loginUserHandler } = require('../../controllers/v1/userController');
const validateToken = require('../../middleware/auth');

const router = express.Router();

router.post('', createUserHandler);
router.get('/:id', validateToken, getUserHandler);
router.post('/login', loginUserHandler);

module.exports = router;