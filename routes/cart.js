const express = require('express')
const router = express.Router()
const authenticationMiddleware = require('../middleware/authenticationMiddleware')
const{
 showCart,
 addProductToCart,
 removeProductFromCart,
 emptyTheCart,
 updateProductQuantityInCart
} = require('../controllers/cart')

router.use('/',authenticationMiddleware)
router.route('/')
.get(showCart)
.delete(authenticationMiddleware , emptyTheCart)

router.route('/:id')
.delete(authenticationMiddleware , removeProductFromCart)
.post(authenticationMiddleware , addProductToCart)
.patch(authenticationMiddleware, updateProductQuantityInCart)

module.exports = router