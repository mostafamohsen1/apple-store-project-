const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  updateWishlistItem,
  toggleWishlistPrivacy,
  getSharedWishlist,
  checkPriceDrops,
  moveAllToCart
} = require('../controllers/wishlistController');

// Protected routes
router.route('/')
  .get(protect, getUserWishlist)    // Get user's wishlist
  .post(protect, addToWishlist)     // Add product to wishlist
  .delete(protect, clearWishlist);  // Clear wishlist

// Remove specific product from wishlist
router.route('/:productId')
  .delete(protect, removeFromWishlist)
  .put(protect, updateWishlistItem);

// Toggle wishlist privacy
router.route('/privacy')
  .put(protect, toggleWishlistPrivacy);

// Check for price drops
router.route('/price-drops')
  .get(protect, checkPriceDrops);

// Move all items to cart
router.route('/move-to-cart')
  .post(protect, moveAllToCart);

// Public route for shared wishlists
router.route('/shared/:shareCode')
  .get(getSharedWishlist);

module.exports = router; 