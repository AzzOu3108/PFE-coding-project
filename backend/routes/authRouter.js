const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter')
const { isAuthenticated }  = require('../middleware/authMiddleware');

router.route('/login')
    .post(authLimiter, authController.login);

router.route('/refresh')
    .post(authController.refreshToken);

router.route('/logout')
    .post(isAuthenticated, authController.logout)

module.exports = router;