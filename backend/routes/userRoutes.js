const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const { isAuthenticated, isAuthorized } = require('../middleware/authMiddleware')

router.route('/')
    .post(usersController.createNewUser)
    .get(isAuthenticated, isAuthorized(['administrateur', 'directeur']),usersController.getAllUser)
    
router.route('/search')
    .get(isAuthenticated, isAuthorized(['utilisateur','chef de projet','administrateur', 'directeur']),usersController.getUserByName)

router.route('/:id')
    .put(isAuthenticated, usersController.updateUser)
    .delete(isAuthenticated, isAuthorized(['administrateur']), usersController.deleteUser)

router.put('/:id/role', isAuthenticated, isAuthorized(['administrateur']), usersController.updateUserRole);

module.exports = router
