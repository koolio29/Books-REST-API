const express = require('express');
const UserController = require('../controllers/userController');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/login', UserController.loginUser);
router.post('/register', UserController.registerUser);


module.exports = router;
