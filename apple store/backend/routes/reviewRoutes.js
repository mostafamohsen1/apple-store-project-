const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllReviews,
  updateReview,
  deleteReview,
  updateReviewStatus,
  voteOnReview,
  getUserReviews
} = require('../controllers/reviewController');

// Public routes
// Review routes related to specific products are in productRoutes.js

// Protected routes
router.route('/user')
  .get(protect, getUserReviews);          // Get user's own reviews

router.route('/:id')
  .put(protect, updateReview)            // Update own review
  .delete(protect, deleteReview);        // Delete own review

router.route('/:id/vote')
  .post(protect, voteOnReview);          // Vote on a review

// Admin routes
router.route('/')
  .get(protect, authorize('admin'), getAllReviews);  // Get all reviews for admin

router.route('/:id/status')
  .put(protect, authorize('admin'), updateReviewStatus);  // Approve/reject review

module.exports = router; 