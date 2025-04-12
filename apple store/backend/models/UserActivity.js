const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activities: [
    {
      activityType: {
        type: String,
        enum: [
          'view_product',
          'add_to_cart',
          'add_to_wishlist',
          'remove_from_cart',
          'remove_from_wishlist',
          'purchase',
          'search',
          'filter',
          'review',
          'page_view',
          'click',
          'offer_click'
        ],
        required: true
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      category: {
        type: String,
        enum: ['iphone', 'ipad', 'mac', 'watch', 'airpods', 'accessories']
      },
      searchQuery: {
        type: String
      },
      filterOptions: {
        type: Object
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      sessionId: {
        type: String
      },
      metadata: {
        type: Object
      },
      durationMs: {
        type: Number
      }
    }
  ],
  preferences: {
    favoriteCategories: [String],
    priceRange: {
      min: Number,
      max: Number
    },
    featurePreferences: [String],
    colorPreferences: [String]
  },
  dateLastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add activity efficiently
UserActivitySchema.methods.addActivity = async function(activityData) {
  this.activities.push(activityData);
  this.dateLastActive = Date.now();
  
  // Limit the activity array size to prevent document growth issues
  const MAX_ACTIVITIES = 500;
  if (this.activities.length > MAX_ACTIVITIES) {
    this.activities = this.activities.slice(-MAX_ACTIVITIES);
  }
  
  // Update preferences based on activity patterns
  this.updatePreferences();
  
  return this.save();
};

// Update user preferences based on activity patterns
UserActivitySchema.methods.updatePreferences = function() {
  // Get last 100 activities for analysis
  const recentActivities = this.activities.slice(-100);
  
  // Calculate favorite categories
  const categoryCount = {};
  
  recentActivities.forEach(activity => {
    if (activity.category) {
      categoryCount[activity.category] = (categoryCount[activity.category] || 0) + 1;
    }
  });
  
  // Sort categories by frequency
  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Take top 3 categories
  this.preferences.favoriteCategories = sortedCategories.slice(0, 3);
  
  // Other preference calculations would be added here
};

// Get most viewed products
UserActivitySchema.statics.getMostViewedProducts = async function(userId, limit = 5) {
  const userActivity = await this.findOne({ user: userId });
  
  if (!userActivity) {
    return [];
  }
  
  // Get product views
  const productViews = {};
  
  userActivity.activities.forEach(activity => {
    if (activity.activityType === 'view_product' && activity.product) {
      const productId = activity.product.toString();
      productViews[productId] = (productViews[productId] || 0) + 1;
    }
  });
  
  // Sort by view count
  const sortedProducts = Object.entries(productViews)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedProducts.slice(0, limit);
};

module.exports = mongoose.model('UserActivity', UserActivitySchema); 