const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      color: {
        name: String,
        value: String
      },
      storage: String,
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      }
    }
  ],
  totalQuantity: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate totals
CartSchema.pre('save', function(next) {
  let totalPrice = 0;
  let totalQuantity = 0;
  
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      totalPrice += item.price * item.quantity;
      totalQuantity += item.quantity;
    });
  }
  
  this.totalPrice = parseFloat(totalPrice.toFixed(2));
  this.totalQuantity = totalQuantity;
  this.updatedAt = Date.now();
  
  next();
});

module.exports = mongoose.model('Cart', CartSchema); 