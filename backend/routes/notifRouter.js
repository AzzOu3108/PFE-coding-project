const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notifController');
const {isAuthenticated} = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, notifController.getNotifications);

module.exports = router;