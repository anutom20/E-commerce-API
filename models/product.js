const mongoose = require('mongoose')
const {Schema} = mongoose;

const productSchema = new Schema({
    name:{
        type:String,
        required:[true , 'Please provide product name']
    },
    price:{
        type:Number,
        required:[true, 'Please provide product price']
    },
    brand:{
        type:String,
        required:[true, 'Please provide product brand']
    },
    color:{
        type:String,
        required:[true,'Please provide product color']
    }
})


module.exports = mongoose.model('Product', productSchema)
