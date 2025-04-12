const asyncHandler = require('express-async-handler');
const UserActivity = require('../models/UserActivity');
const Product = require('../models/Product');
const searchService = require('../utils/searchService');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Track user activity
 * @route   POST /api/activity
 * @access  Private
 */
const trackActivity = asyncHandler(async (req, res) => {
  const { activityType, productId, category, searchQuery, filterOptions, sessionId, metadata, durationMs } = req.body;
  
  if (!activityType) {
    throw new ErrorResponse('Activity type is required', 400);
  }
  
  // Get or create user activity document
  let userActivity = await UserActivity.findOne({ user: req.user.id });
  
  if (!userActivity) {
    userActivity = await UserActivity.create({
      user: req.user.id,
      activities: []
    });
  }
  
  // Create activity data
  const activityData = {
    activityType,
    timestamp: new Date(),
    sessionId
  };
  
  // Add optional fields if present
  if (productId) {
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }
    activityData.product = productId;
    activityData.category = product.category;
  } else if (category) {
    activityData.category = category;
  }
  
  if (searchQuery) activityData.searchQuery = searchQuery;
  if (filterOptions) activityData.filterOptions = filterOptions;
  if (metadata) activityData.metadata = metadata;
  if (durationMs) activityData.durationMs = durationMs;
  
  // Add activity to user's activities
  await userActivity.addActivity(activityData);
  
  res.status(200).json({
    success: true,
    message: 'Activity tracked successfully'
  });
});

/**
 * @desc    Get activity report for a user (admin only)
 * @route   GET /api/activity/report/:userId
 * @access  Admin
 */
const getUserActivityReport = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;
  
  // Build date range filter
  const dateFilter = {};
  if (startDate) {
    dateFilter['activities.timestamp'] = { $gte: new Date(startDate) };
  }
  if (endDate) {
    if (!dateFilter['activities.timestamp']) {
      dateFilter['activities.timestamp'] = {};
    }
    dateFilter['activities.timestamp'].$lte = new Date(endDate);
  }
  
  // Get user activity
  const userActivity = await UserActivity.findOne({ 
    user: userId,
    ...dateFilter
  });
  
  if (!userActivity) {
    throw new ErrorResponse('User activity not found', 404);
  }
  
  // Get recent activities
  const recentActivities = userActivity.activities
    .slice(-50)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  // Generate activity report
  const viewedProducts = new Set();
  const viewedCategories = {};
  const searches = [];
  
  userActivity.activities.forEach(activity => {
    if (activity.activityType === 'view_product' && activity.product) {
      viewedProducts.add(activity.product.toString());
    }
    
    if (activity.category) {
      viewedCategories[activity.category] = (viewedCategories[activity.category] || 0) + 1;
    }
    
    if (activity.activityType === 'search' && activity.searchQuery) {
      searches.push({
        query: activity.searchQuery,
        timestamp: activity.timestamp
      });
    }
  });
  
  // Sort categories by view count
  const sortedCategories = Object.entries(viewedCategories)
    .sort((a, b) => b[1] - a[1])
    .map(entry => ({ name: entry[0], count: entry[1] }));
  
  // Recent searches (last 10)
  const recentSearches = searches
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);
  
  res.status(200).json({
    success: true,
    data: {
      preferences: userActivity.preferences,
      activitySummary: {
        viewedProductsCount: viewedProducts.size,
        favoriteCategories: sortedCategories,
        recentSearches,
        lastActive: userActivity.dateLastActive
      },
      recentActivities
    }
  });
});

/**
 * @desc    Get personalized recommendations for user
 * @route   GET /api/activity/recommendations
 * @access  Private
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;
  
  try {
    // Use search service to get personalized recommendations
    const recommendations = await searchService.getPersonalizedRecommendations(
      req.user.id,
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    throw new ErrorResponse('Error generating recommendations', 500);
  }
});

/**
 * @desc    Get similar products to a product
 * @route   GET /api/activity/similar/:productId
 * @access  Public
 */
const getSimilarProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { limit = 4 } = req.query;
  
  try {
    // Use search service to find similar products
    const similarProducts = await searchService.findSimilarProducts(
      productId,
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: similarProducts
    });
  } catch (error) {
    console.error('Similar products error:', error);
    throw new ErrorResponse('Error finding similar products', 500);
  }
});

/**
 * @desc    Get trending products
 * @route   GET /api/activity/trending
 * @access  Public
 */
const getTrendingProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;
  
  try {
    // Use search service to get trending products
    const trendingProducts = await searchService.getTrendingProducts(
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: trendingProducts
    });
  } catch (error) {
    console.error('Trending products error:', error);
    throw new ErrorResponse('Error retrieving trending products', 500);
  }
});

/**
 * @desc    Get user preferences
 * @route   GET /api/activity/preferences
 * @access  Private
 */
const getUserPreferences = asyncHandler(async (req, res) => {
  // Get user activity
  let userActivity = await UserActivity.findOne({ user: req.user.id });
  
  if (!userActivity) {
    userActivity = await UserActivity.create({
      user: req.user.id,
      activities: []
    });
  }
  
  res.status(200).json({
    success: true,
    data: userActivity.preferences
  });
});

/**
 * @desc    Update user preferences
 * @route   PUT /api/activity/preferences
 * @access  Private
 */
const updateUserPreferences = asyncHandler(async (req, res) => {
  const { favoriteCategories, priceRange, featurePreferences, colorPreferences } = req.body;
  
  // Get user activity
  let userActivity = await UserActivity.findOne({ user: req.user.id });
  
  if (!userActivity) {
    userActivity = await UserActivity.create({
      user: req.user.id,
      activities: []
    });
  }
  
  // Update preferences
  if (favoriteCategories) userActivity.preferences.favoriteCategories = favoriteCategories;
  if (priceRange) userActivity.preferences.priceRange = priceRange;
  if (featurePreferences) userActivity.preferences.featurePreferences = featurePreferences;
  if (colorPreferences) userActivity.preferences.colorPreferences = colorPreferences;
  
  await userActivity.save();
  
  res.status(200).json({
    success: true,
    message: 'Preferences updated',
    data: userActivity.preferences
  });
});

module.exports = {
  trackActivity,
  getUserActivityReport,
  getRecommendations,
  getSimilarProducts,
  getTrendingProducts,
  getUserPreferences,
  updateUserPreferences
}; 