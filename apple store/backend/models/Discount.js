const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    trim: true,
    uppercase: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'shipping', 'bogo'],
    required: [true, 'Please specify discount type']
  },
  value: {
    type: Number,
    required: function() {
      return this.type !== 'bogo';
    },
    min: [0, 'Discount value cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please add a discount description'],
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  minimumPurchase: {
    type: Number,
    default: 0
  },
  maximumDiscount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  userLimit: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applyTo: {
    type: String,
    enum: ['all', 'category', 'product', 'user'],
    default: 'all'
  },
  applicableCategories: [
    {
      type: String,
      enum: ['iphone', 'ipad', 'mac', 'watch', 'airpods', 'accessories']
    }
  ],
  applicableProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  applicableUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  usedBy: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      usedAt: {
        type: Date,
        default: Date.now
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },
      discountAmount: {
        type: Number
      }
    }
  ],
  excludedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate if code is already used by a specific user
DiscountSchema.methods.isUsedByUser = function(userId) {
  return this.usedBy.some(usage => usage.user.toString() === userId.toString());
};

// Validate if discount is active and within date range
DiscountSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Calculate the discount amount
DiscountSchema.methods.calculateDiscount = function(cartTotal, itemsInCart) {
  if (!this.isValid()) {
    return 0;
  }
  
  if (cartTotal < this.minimumPurchase) {
    return 0;
  }
  
  let discountAmount = 0;
  
  if (this.type === 'percentage') {
    discountAmount = (cartTotal * this.value) / 100;
    
    // Apply maximum discount if set
    if (this.maximumDiscount && discountAmount > this.maximumDiscount) {
      discountAmount = this.maximumDiscount;
    }
  } else if (this.type === 'fixed') {
    discountAmount = this.value;
  } else if (this.type === 'shipping') {
    // Shipping discount is applied separately
    discountAmount = 0;
  } else if (this.type === 'bogo') {
    // Buy one get one logic would be implemented in the order controller
    discountAmount = 0;
  }
  
  return discountAmount;
};

module.exports = mongoose.model('Discount', DiscountSchema); 