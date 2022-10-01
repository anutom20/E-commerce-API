const express = require('express')
const router = express.Router()
const authenticationMiddleware = require('../middleware/authenticationMiddleware')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../UserRoles/roles_list')
const {
    getAllUsers,
    getSingleUser
} = require('../controllers/users')

const{
    addProductToCart,
    removeProductFromCart,
    emptyTheCart,
    showCart,
    updateProductQuantityInCart
} = require('../controllers/cart')

router.use('/',authenticationMiddleware)
router.route('/').get(verifyRoles(ROLES_LIST.Admin),getAllUsers)
router.route('/:userId').get(getSingleUser)

router.route('/:userId/cart')
.get(showCart)
.delete(emptyTheCart)


router.route('/:userId/cart/:productId')
.patch(updateProductQuantityInCart)
.post(addProductToCart)
.delete(removeProductFromCart)




module.exports = router