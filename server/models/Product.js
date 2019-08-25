const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name cannot be empty'],
  },
  description: {
    type: String,
    required: [true, 'Product Description cannot be empty'],
  },
  thumbnail: {
    type: String,
  },
  price: {
    type: Number,
    min: [0, 'Product Price cannot be less than 0'],
    required: [true, 'Product price cannot be empty'],
  },
  stock: {
    type: Number,
    min: [0, 'Product Stock cannot be less than 0'],
    required: [true, 'Product stock cannot be empty'],
  },
  category: {
    type: Array,
    validate: {
      validator: function(v){
        return Array.isArray(v);
      },
      message: 'Product Category must be an array'
    }
  },
  sellerId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Product sellerId cannot be empty'],
  }
},{
  versionKey: false,
  timestamps: true,
})

const Product = mongoose.model('Products',productSchema);

module.exports = Product;