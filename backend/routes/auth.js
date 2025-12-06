const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { register, login, getCurrentUser } = require('../controllers/authController');

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user (protected route)
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
