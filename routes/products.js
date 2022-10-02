const express = require('express')
const router = express.Router()
const authenticationMiddleware = require('../middleware/authenticationMiddleware')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../UserRoles/roles_list')

const {
    getAllProducts,
    getSingleProduct,
    AddProduct,
    UpdateProduct,
    DeleteSingleProduct
} = require('../controllers/products')

const{
    addToCartOrCreateSingleProductOrder
} = require('../controllers/cart')


router.route('/')
.get(getAllProducts)
.post(authenticationMiddleware,verifyRoles(ROLES_LIST.Admin),AddProduct)


router.route('/:productId')
.get(getSingleProduct)
.patch(authenticationMiddleware,verifyRoles(ROLES_LIST.Admin), UpdateProduct)
.delete(authenticationMiddleware,verifyRoles(ROLES_LIST.Admin), DeleteSingleProduct)
.post(authenticationMiddleware,addToCartOrCreateSingleProductOrder)

module.exports = router