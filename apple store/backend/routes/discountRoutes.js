const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  verifyDiscountCode,
  getPublicDiscounts,
  toggleDiscountStatus
} = require('../controllers/discountController');

// Public routes
router.route('/public')
  .get(getPublicDiscounts);                   // Get active public discounts

// Protected routes
router.route('/verify')
  .post(protect, verifyDiscountCode);         // Verify a discount code

// Admin routes
router.route('/')
  .get(protect, authorize('admin'), getAllDiscounts)    // Get all discounts
  .post(protect, authorize('admin'), createDiscount);   // Create a discount

router.route('/:id')
  .get(protect, authorize('admin'), getDiscount)       // Get a single discount
  .put(protect, authorize('admin'), updateDiscount)     // Update a discount
  .delete(protect, authorize('admin'), deleteDiscount); // Delete a discount

router.route('/:id/toggle')
  .put(protect, authorize('admin'), toggleDiscountStatus); // Toggle discount status

module.exports = router; 