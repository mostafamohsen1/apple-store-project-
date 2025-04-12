const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  trackActivity,
  getUserActivityReport,
  getRecommendations,
  getSimilarProducts,
  getTrendingProducts,
  getUserPreferences,
  updateUserPreferences
} = require('../controllers/userActivityController');

// Public routes
router.route('/trending')
  .get(getTrendingProducts);                // Get trending products

router.route('/similar/:productId')
  .get(getSimilarProducts);                 // Get similar products

// Protected routes
router.route('/')
  .post(protect, trackActivity);            // Track user activity

router.route('/recommendations')
  .get(protect, getRecommendations);        // Get personalized recommendations

router.route('/preferences')
  .get(protect, getUserPreferences)         // Get user preferences
  .put(protect, updateUserPreferences);     // Update user preferences

// Admin routes
router.route('/report/:userId')
  .get(protect, authorize('admin'), getUserActivityReport);  // Get user activity report

module.exports = router; 