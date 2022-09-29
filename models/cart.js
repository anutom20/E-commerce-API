const mongoose = require('mongoose')
const {Schema} = mongoose;

const cartSchema = new Schema({
    productId:{
        type:Schema.Types.ObjectId,
        ref: 'Product',
        required:[true,'Please provide the product']
    },
    UserId:{
        type:Schema.Types.ObjectId,
        ref : 'User',
        required:[true, 'Please provide the user']
    },
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
    }

})

module.exports = mongoose.model('Cart', cartSchema)