const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.route('/')
    .post(usersController.createNewUser)
    .get(usersController.getAllUser)
    
router.route('/search')
    .get(usersController.getUserByName)

router.route('/:id')
    .put(usersController.updateUser)
    .delete(usersController.deleteUser)

router.put('/:id/role', usersController.updateUserRole);

module.exports = router
