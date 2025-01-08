const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')

router.route('/')
    .post(projectController.createProject)
    .get(projectController.getAllProjects)
    
router.route('/search')
    .get(projectController.getProjectByName)

router.route('/:id')
    .put(projectController.updateProject)
    .delete(projectController.deleteProject)

module.exports = router