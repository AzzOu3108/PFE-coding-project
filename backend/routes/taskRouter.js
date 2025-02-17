const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')
const { isAuthenticated, isAuthorized } = require('../middleware/authMiddleware')

router.route('/')
    .post(isAuthenticated, isAuthorized(['chef de projet', 'administrateur']),tasksController.createTask)

router.route('/:id')
    .put(isAuthenticated, isAuthorized(['chef de projet', 'administrateur']), tasksController.updateTask)
    .delete(isAuthenticated, isAuthorized(['chef de projet', 'administrateur']), tasksController.deleteTask)

module.exports = router