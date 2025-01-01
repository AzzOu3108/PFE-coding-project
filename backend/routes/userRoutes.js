const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.route('/')
    .post(usersController.createNewUser)
    .get(usersController.getAllUser)
router.route('/utilisateurs/:id')
    .get(usersController.getUser)
    .put(usersController.updateUserRole)
    .put(usersController.updateUser)
    .delete(usersController.deleteUser);

module.exports = router    
