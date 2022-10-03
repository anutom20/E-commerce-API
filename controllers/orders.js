const cartModel = require('../models/cart')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError} = require('../errors')

const createOrder = async (req,res)=>{
  
    
        const user_id = req.user.userId
        const cart = await cartModel.find({UserId:user_id}).select('name price quantity total')
      
        let orderDetails = {}
      
        const {Address, phoneNumber} = req.body

        const tax = Math.floor(Math.random() * 100);
        const shippingFee = 50
      
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
          itemList : cart,
          phoneNumber:phoneNumber
        }
      
        const order = await orderModel.create(orderDetails)
        res.status(StatusCodes.CREATED).json({orderDetails:order})
    
   
  

}





const getAllOrders = async(req,res)=>{
    
        const user_id = req.user.userId
        if(req.params.userId === 'userId'){
         const orders = await orderModel.find({UserId:user_id})
         if(orders.length == 0){
             res.status(StatusCodes.OK).json({msg:'No orders now, create an order!'})
        }
        else{
            res.status(StatusCodes.OK).json({ordersList:orders, count:orders.length})
        } 
         
        }
        else{
            const user = await userModel.findOne({_id:req.params.userId})
            if(!user){
                throw new BadRequestError(`No user with the id :${user_id}`)
            }
            const orders = await orderModel.find({UserId:req.params.userId})
            if(orders.length == 0){
                res.status(StatusCodes.OK).json({msg:`No orders found with user with id : ${req.params.userId}`})
           }
           else{
               res.status(StatusCodes.OK).json({ordersList:orders, count:orders.length})
           } 
            
        }
        
       
    
  

}

const getSingleOrder = async(req,res)=>{
    
    
    const user_id = req.user.userId
    const orderId = req.params.orderId

    if(req.params.userId === 'userId'){
        const order = await orderModel.findOne({UserId:user_id,_id:orderId})
        if(!order){
            throw new BadRequestError(`No order found with id ${orderId}`)
        }
        res.status(StatusCodes.OK).json(order)
    }
    else{
        const user = await userModel.findOne({_id:user_id})
        if(!user){
            throw new BadRequestError(`No user with the id :${user_id}`)
        }
        const order = await orderModel.findOne({UserId:req.params.userId,orderId:orderId})
        if(!order){
            res.status(StatusCodes.OK).json({msg:`No order found with id : ${orderId}`})
       }
       else{
           res.status(StatusCodes.OK).json(order)
       } 
    }
   

   
    
   

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

