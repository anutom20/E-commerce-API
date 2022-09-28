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

router.route('/')
.get(authenticationMiddleware , getAllProducts)
.post(authenticationMiddleware,verifyRoles(ROLES_LIST.Admin),AddProduct)

router.route('/:id')
.get(authenticationMiddleware,  getSingleProduct)
.patch(authenticationMiddleware,  verifyRoles(ROLES_LIST.Admin), UpdateProduct)
.delete(authenticationMiddleware, verifyRoles(ROLES_LIST.Admin), DeleteSingleProduct)

module.exports = router