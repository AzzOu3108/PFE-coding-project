const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');
const isAuthenticated  = require('../middleware/authMiddleware');

router.route('/login')
    .post(authController.login);

router.route('/refresh')
    .post(authController.refreshToken);

router.route('/logout')
    .post(isAuthenticated, authController.logout)

module.exports = router;