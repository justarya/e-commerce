const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  productId:{
    type: mongoose.Schema.ObjectId,
    required: [true,'Product Id cannot be empty'],
    ref: 'Products'
  },
  quantity: {
    type: Number,
    required: [true,'Quantity cannot be empty']
  },
  status: {
    type:String,
    default: 'hold'
  },
  userId: mongoose.Schema.ObjectId,
},{
  versionKey: false,
  timestamps: true,
})

const Cart = mongoose.model('Carts',cartSchema);

module.exports = Cart;