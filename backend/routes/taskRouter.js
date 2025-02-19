const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')
const { isAuthenticated, isAuthorized } = require('../middleware/authMiddleware')
const validateProjectExiste = require('../middleware/validateProjectExiste')

router.route('/projects/:projectId/tasks')
    .post(isAuthenticated,
        isAuthorized(['chef de projet', 'administrateur']),
        validateProjectExiste,
        tasksController.createTask)

router.route('/:id')
    .put(isAuthenticated,
        isAuthorized(['chef de projet', 'administrateur']), 
        tasksController.updateTask)

    .delete(isAuthenticated, 
        isAuthorized(['chef de projet', 'administrateur']), 
        tasksController.deleteTask)

router.route('/:id/status')
    .put(isAuthenticated, 
        isAuthorized(['utilisateur','chef de projet', 'administrateur']), 
        tasksController.updateTasksStatus)

module.exports = router