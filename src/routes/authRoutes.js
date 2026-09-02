const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidators');

router.post('/register', authValidator.registerValidator, authController.registerUser);
router.post('/login', authValidator.loginValidator, authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;