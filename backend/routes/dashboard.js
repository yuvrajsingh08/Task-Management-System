const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

router.use(authMiddleware);

// Get dashboard statistics
router.get('/dashboard', getDashboardStats);

module.exports = router;