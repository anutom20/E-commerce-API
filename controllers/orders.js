const productModel = require('../models/product')
const cartModel = require('../models/cart')
const orderModel = require('../models/order')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')

const createOrder = async (req,res)=>{
  
    
        const user_id = req.user.userId
        const cart = await cartModel.find({UserId:user_id}).select('name price quantity total')
      
        let orderDetails = {}
      
        const {tax, shippingFee ,  Address} = req.body
      
        let noOfItems = 0 , grandTotal = 0
      
        cart.forEach((item)=>{
          noOfItems += item.quantity
          grandTotal += item.total
        })
        orderDetails = {
          UserId : user_id,  
          itemCount : noOfItems,
          tax : tax,
          shippingFee : shippingFee,
          Address : Address,
          grandTotal: grandTotal,
          itemList : cart
        }
      
        const order = await orderModel.create(orderDetails)
        res.status(StatusCodes.CREATED).json({orderDetails:order})
    
   
  

}





const getAllOrders = async(req,res)=>{
    
    try{
        const user_id = req.user.userId
        const orders = await orderModel.find({UserId:user_id})
        if(orders.length == 0){
            return res.status(StatusCodes.OK).json({msg:'No orders now, create an order!'})
        }
        res.status(StatusCodes.OK).json({ordersList:orders, count:orders.length})
    }
    catch(error){
        console.log(error)
        next(error)
    }

}

const getSingleOrder = async(req,res)=>{
    
    
    const user_id = req.user.userId
    const orderId = req.params.orderId
    const order = await orderModel.findOne({UserId:user_id,_id:orderId})
    if(!order){
        throw new BadRequestError(`No order found with id ${orderId}`)
    }

    res.status(StatusCodes.OK).json(order)
    
   

}

const cancelOrder = async(req,res)=>{
    const user_id = req.user.userId
    const orderId = req.params.orderId
    const order = await orderModel.findOneAndRemove({UserId:user_id,_id:orderId})
    if(!order){
        throw new BadRequestError(`No order found with id ${orderId}`)
    }
    res.status(StatusCodes.OK).json({msg:`order with order id : ${orderId} cancelled successfully!`})

}

module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    cancelOrder,
    
}

