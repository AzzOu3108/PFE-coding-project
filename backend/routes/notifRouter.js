const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notifController');

router.get('/', notifController.getNotifications);

module.exports = router;