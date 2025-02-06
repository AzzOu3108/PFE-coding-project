const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')

router.route('/')
    .post(tasksController.createTask)

router.route('/:id')
    .put(tasksController.updateTask)
    .delete(tasksController.deleteTask)

module.exports = router