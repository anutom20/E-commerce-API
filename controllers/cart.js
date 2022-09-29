const productModel = require('../models/product')
const cartModel   = require('../models/cart')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')

const addProductToCart = async (req,res)=>{
    const user_id = req.user.userId
    const productId = req.params.id
    
   // check if the product exists in the database
    
    const product = await productModel.findById(productId)
    if(!product) throw new NotFoundError(`Product with id : ${productId} does not exist`)



   try{
    const cartProduct = await cartModel.findOne({UserId:user_id , productId: productId})
    
    if(!cartProduct){
        const {
            name,
            price,
            _id,     
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
   catch(error){
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
   }

}


const removeProductFromCart = async (req,res)=>{
   
    const user_id = req.user.userId
    const productId = req.params.id

    const cartProduct = await cartModel.findOneAndRemove({UserId: user_id , productId: productId})

    if(!cartProduct) throw new NotFoundError(`Product with id ${productId} is not present in your cart`)

    res.status(StatusCodes.OK).json({message :`Product with id : ${productId} removed successfully from the cart`})
    
}


const emptyTheCart = async (req,res)=>{
    
    try{
    const user_id = req.user.userId
    const noOfDocumentsDeleted = await cartModel.deleteMany({UserId:user_id})
    res.status(StatusCodes.OK).json({message:'cart successfully emptied!', no_deleted:noOfDocumentsDeleted})
    }
    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
    }


}

const showCart = async (req,res)=>{
    

    try{
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
    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
    }


}

const updateProductQuantityInCart = async(req,res)=>{
    
    const user_id = req.user.userId
    const productId = req.params.id
    

    const product = await cartModel.findOne({UserId:user_id, productId:productId})
    if(!product){
        throw new NotFoundError(`Product with id : ${productId} not found in the cart`)
    }
    
    try{
    const newQuantity = req.body
    
    const productWithUpdatedQuantity = await cartModel.findOneAndUpdate({UserId:user_id, productId:productId},newQuantity,{new:true,runValidators:true})

    res.status(StatusCodes.OK).json(productWithUpdatedQuantity)
    }
    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
    }
   

}

module.exports = {
    addProductToCart,
    removeProductFromCart,
    emptyTheCart,
    showCart,
    updateProductQuantityInCart
}


