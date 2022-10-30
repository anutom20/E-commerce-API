const mongoose = require('mongoose')
const {Schema} = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
    validate: {
      validator: function (p) {
        return p >= 0;
      },
      message: (props) => `${props.value} is not a valid price!`,
    },
  },
  brand: {
    type: String,
    required: [true, "Please provide product brand"],
  },
  color: {
    type: String,
    required: [true, "Please provide product color"],
  },
  rating: {
    type: Number,
    required: [true, "Please provide rating"],
    validate: {
      validator: function (p) {
        return p >= 0;
      },
      message: (props) => `${props.value} is not a valid price!`,
    }
  },
  image:{
    type: String,
    required: [true, 'Please provide image']  
  },
  description:{
    type:String,
    required: [true, 'Please provide product description']
  }
});


module.exports = mongoose.model('Product', productSchema)
