const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const { isAuthenticated, isAuthorized } = require('../middleware/authMiddleware')

router.route('/')
    .post(isAuthenticated, isAuthorized(['chef de projet, administrateur']), projectController.createProject)
    .get(projectController.getAllProjects)
    
router.route('/search')
    .get(projectController.getProjectByName)

router.route('/:id')
    .put(isAuthenticated, isAuthorized(['chef de projet, administrateur']), projectController.updateProject)
    .delete(isAuthenticated, isAuthorized(['chef de projet, administrateur']), projectController.deleteProject)

module.exports = router