const mongoose = require('mongoose')
const {Schema} = mongoose;

const orderSchema = new Schema({
    UserId:{
        type: Schema.Types.ObjectId,
        ref : 'User',
        required:[true,'Please provide user']
    },
    itemCount:{
      type : Number,
      required:[true,'Please provide item count'],
      validate: {
        validator: function(p) {
          return p>=1
        },
        message: props => `${props.value} is not a valid count!`
      }
    },
    itemList:[{
        price:{
            type:Number,
            required:[true,'Please provide the price of item'],
            validate: {
                validator: function(p) {
                  return p>=0
                },
                message: props => `${props.value} is not a valid price!`
              }
        },
        quantity:{
            type:Number,
            required:[true,'Please provide the quantity of the item'],
            validate: {
                validator: function(p) {
                  return p>=1
                },
                message: props => `${props.value} is not a valid quantity value!`
              }
        },
        name:{
            type:String,
            required:[true,'Please provide name of the item']
        },
        total:{
            type:Number,
            required:[true,'Please provide total price'],
            validate: {
                validator: function(p) {
                  return p>=0
                },
                message: props => `${props.value} is not a valid total!`
              }
        },
        
    }],
    tax:{
        type:Number,
        required:[true, 'Please provide tax amount'],
        validate: {
            validator: function(p) {
              return p>=0
            },
            message: props => `${props.value} is not a valid tax!`
          }
    },
    shippingFee:{
        type:Number,
        required:[true,'Please provide shipping fee'],
        validate: {
            validator: function(p) {
              return p>=0
            },
            message: props => `${props.value} is not a valid fee!`
          }
    },
    grandTotal:{
        type:Number,
        required:[true,'Please provide grand total'],
        validate: {
            validator: function(p) {
              return p>=0
            },
            message: props => `${props.value} is not a valid total!`
          }
    },
    Address:{
        type:String,
        required:[true,'Please provide address']
    },
    phoneNumber:{
      type:String,
      required:[true,'Please provide phone number'],
      match : /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
    }
})

module.exports = mongoose.model('Order',orderSchema)