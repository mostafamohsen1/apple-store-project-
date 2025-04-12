const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      addedAt: {
        type: Date,
        default: Date.now
      },
      notifyOnPriceChange: {
        type: Boolean,
        default: false
      },
      priceWhenAdded: {
        type: Number
      }
    }
  ],
  isPublic: {
    type: Boolean,
    default: false
  },
  shareCode: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check if a product is already in wishlist
WishlistSchema.methods.hasProduct = function(productId) {
  return this.products.some(item => item.product.toString() === productId);
};

// Generate a unique share code when wishlist is made public
WishlistSchema.pre('save', async function(next) {
  if (this.isPublic && !this.shareCode) {
    // Generate a random 8-character code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shareCode = '';
    
    for (let i = 0; i < 8; i++) {
      shareCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    this.shareCode = shareCode;
  }
  
  next();
});

module.exports = mongoose.model('Wishlist', WishlistSchema); 