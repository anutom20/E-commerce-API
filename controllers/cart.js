const productModel = require('../models/product')
const cartModel   = require('../models/cart')
const orderModel = require('../models/order')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')



const addToCartOrCreateSingleProductOrder = async(req,res)=>{
    
    /*HERE WE ARE ADDING A SINGLE ITEM TO THE CART */

    if(req.query.queryParam === 'addToCart'){
    const user_id = req.user.userId
    const productId = req.params.productId
    
   // check if the product exists in the database
    
    const product = await productModel.findById(productId)
    if(!product) throw new NotFoundError(`Product with id : ${productId} does not exist`)

    const cartProduct = await cartModel.findOne({UserId:user_id , productId: productId})
    
    if(!cartProduct){
        const {
            name,
            price,
            _id,
            image,     
           } = product
           
           const addedToCart = await cartModel.create({
               UserId: user_id,
               name:name,
               price:price,
               productId:_id,
               quantity: 1,
               total : price
               
       
           })
        
         res.status(StatusCodes.CREATED).json(addedToCart)  
    }
    else{
        res.status(StatusCodes.OK).json({message: 'Product already present in cart'})     
             
    }
   
    }

    /*HERE WE ARE CREATING A SINGLE PRODUCT ORDER*/


    else{
    const user_id = req.user.userId
    const productId = req.params.productId
    const product = await productModel.findOne({UserId:user_id,_id:productId})
    
    if(!product) throw new BadRequestError(`No product found with id : ${productId}`)

    let orderDetails = {}
  
    const {Address, quantity, phoneNumber} = req.body

    const tax = Math.floor(Math.random()*100)
    const shippingFee = 50
  
    const noOfItems = quantity || 1
    const grandTotal = product.price*noOfItems
    
    let productDetails = {}
    productDetails.name = product.name
    productDetails.quantity = noOfItems
    productDetails.total = product.price*noOfItems
    productDetails.price = product.price

    orderDetails = {
      UserId : user_id,  
      itemCount : noOfItems,
      tax : tax,
      shippingFee : shippingFee,
      Address : Address,
      grandTotal: grandTotal,
      itemList : productDetails,
      phoneNumber:phoneNumber
    }
  
    const order = await orderModel.create(orderDetails)
    res.status(StatusCodes.CREATED).json({orderDetails:order})

    }
}


const removeProductFromCart = async (req,res)=>{
   
    const user_id = req.user.userId
    const productId = req.params.productId

    const cartProduct = await cartModel.findOneAndRemove({UserId: user_id , productId: productId})

    if(!cartProduct) throw new NotFoundError(`Product with id ${productId} is not present in your cart`)

    res.status(StatusCodes.OK).json({message :`Product with id : ${productId} removed successfully from the cart`})
    
}


const emptyTheCart = async (req,res)=>{
    
    
    const user_id = req.user.userId
    const noOfDocumentsDeleted = await cartModel.deleteMany({UserId:user_id})
    res.status(StatusCodes.OK).json({message:'cart successfully emptied!', no_deleted:noOfDocumentsDeleted})
   


}

const showCart = async (req,res)=>{
    
     
    const user_id = req.user.userId
    const cartProducts = await cartModel.find({UserId: user_id})

    if(cartProducts.length == 0){
        return res.status(StatusCodes.OK).json({message:'Cart is empty!'})
    }

    let grandTotal  = 0
    cartProducts.forEach((product)=>{
        grandTotal += product.total
    })
    
     res.status(StatusCodes.OK).json({cart:cartProducts, grandTotal: grandTotal})
    


}

const updateProductQuantityInCart = async(req,res)=>{
    
    const user_id = req.user.userId
    const productId = req.params.productId
    let updateDetails = {}
   
    const product = await cartModel.findOne({UserId:user_id, productId:productId})
    if(!product){
        throw new NotFoundError(`Product with id : ${productId} not found in the cart`)
    }
    
    
    const newQuantity = req.body.quantity       
    updateDetails = {total:product.price*newQuantity, quantity:newQuantity}
    
    const productWithUpdatedQuantity = await cartModel.findOneAndUpdate({UserId:user_id, productId:productId},updateDetails,{new:true,runValidators:true})

    res.status(StatusCodes.OK).json(productWithUpdatedQuantity)
    
   

}

module.exports = {
    addToCartOrCreateSingleProductOrder,
    removeProductFromCart,
    emptyTheCart,
    showCart,
    updateProductQuantityInCart
}


