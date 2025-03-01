const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const { isAuthenticated, isAuthorized } = require('../middleware/authMiddleware')

router.get('/by-role', isAuthenticated, isAuthorized(['utilisateur', 'chef de projet', 'administrateur', 'directeur'])
, projectController.getProjectsByRole
)

router.route('/')
    .post(isAuthenticated, isAuthorized(['chef de projet', 'administrateur']), projectController.createProject)
    .get(isAuthenticated,  isAuthorized(['utilisateur', 'chef de projet', 'administrateur', 'directeur']), projectController.getAllProjects);
    
router.route('/search')
    .get(projectController.getProjectByName)

router.route('/:id')
    .put(isAuthenticated, isAuthorized(['chef de projet', 'administrateur']), projectController.updateProject)
    .delete(isAuthenticated, isAuthorized(['chef de projet', 'administrateur']), projectController.deleteProject)

module.exports = router