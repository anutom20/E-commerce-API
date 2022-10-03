const express = require('express')
const router = express.Router()
const authenticationMiddleware = require('../middleware/authenticationMiddleware')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../UserRoles/roles_list')
const {
    getAllUsers,
    getSingleUser,
    makeUserAdmin
} = require('../controllers/users')

const{
    removeProductFromCart,
    emptyTheCart,
    showCart,
    updateProductQuantityInCart
} = require('../controllers/cart')

const{
    getAllOrders,
    getSingleOrder,
    cancelOrder,
    createOrder
} = require('../controllers/orders')


router.use('/',authenticationMiddleware)

router.route('/').get(verifyRoles(ROLES_LIST.Admin),getAllUsers)
router.route('/:userId').get(getSingleUser).patch(verifyRoles(ROLES_LIST.Admin),makeUserAdmin)


router.route('/:userId/cart')
.get(showCart)
.delete(emptyTheCart)


router.route('/:userId/cart/:productId')
.patch(updateProductQuantityInCart)
.delete(removeProductFromCart)



router.route('/:userId/orders')
.get(getAllOrders)
.post(createOrder)


router.route('/:userId/orders/:orderId')
.delete(cancelOrder)
.get(getSingleOrder)



module.exports = router