const express = require('express')
const router = express.Router()
const authenticationMiddleware = require('../middleware/authenticationMiddleware')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../UserRoles/roles_list')
const {
    getAllUsers,
    getSingleUser
} = require('../controllers/users')

router.route('/').get(authenticationMiddleware,verifyRoles(ROLES_LIST.Admin),getAllUsers)
router.route('/:id').get(authenticationMiddleware,getSingleUser)

module.exports = router