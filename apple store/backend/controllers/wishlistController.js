const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const emailService = require('../utils/emailService');

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlists
 * @access  Private
 */
const getUserWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id })
    .populate({
      path: 'products.product',
      select: 'name images price description category colors countInStock'
    });
  
  if (!wishlist) {
    // Create new wishlist if one doesn't exist
    const newWishlist = await Wishlist.create({
      user: req.user.id,
      products: []
    });
    
    return res.status(200).json({
      success: true,
      data: newWishlist
    });
  }
  
  res.status(200).json({
    success: true,
    data: wishlist
  });
});

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlists
 * @access  Private
 */
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId, notifyOnPriceChange = false } = req.body;
  
  if (!productId) {
    throw new ErrorResponse('Product ID is required', 400);
  }
  
  // Check if product exists
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ErrorResponse('Product not found', 404);
  }
  
  // Get or create wishlist
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: []
    });
  }
  
  // Check if product is already in wishlist
  if (wishlist.hasProduct(productId)) {
    throw new ErrorResponse('Product already in wishlist', 400);
  }
  
  // Add product to wishlist
  wishlist.products.push({
    product: productId,
    notifyOnPriceChange,
    priceWhenAdded: product.price
  });
  
  await wishlist.save();
  
  // Populate product details
  const populatedWishlist = await Wishlist.findById(wishlist._id)
    .populate({
      path: 'products.product',
      select: 'name images price description category colors countInStock'
    });
  
  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    data: populatedWishlist
  });
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlists/:productId
 * @access  Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  // Get wishlist
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  
  if (!wishlist) {
    throw new ErrorResponse('Wishlist not found', 404);
  }
  
  // Check if product is in wishlist
  if (!wishlist.hasProduct(productId)) {
    throw new ErrorResponse('Product not in wishlist', 404);
  }
  
  // Remove product from wishlist
  wishlist.products = wishlist.products.filter(
    item => item.product.toString() !== productId
  );
  
  await wishlist.save();
  
  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: wishlist
  });
});

/**
 * @desc    Clear wishlist
 * @route   DELETE /api/wishlists
 * @access  Private
 */
const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  
  if (!wishlist) {
    throw new ErrorResponse('Wishlist not found', 404);
  }
  
  wishlist.products = [];
  await wishlist.save();
  
  res.status(200).json({
    success: true,
    message: 'Wishlist cleared',
    data: wishlist
  });
});

/**
 * @desc    Update wishlist item
 * @route   PUT /api/wishlists/:productId
 * @access  Private
 */
const updateWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { notifyOnPriceChange } = req.body;
  
  // Get wishlist
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  
  if (!wishlist) {
    throw new ErrorResponse('Wishlist not found', 404);
  }
  
  // Find product in wishlist
  const productIndex = wishlist.products.findIndex(
    item => item.product.toString() === productId
  );
  
  if (productIndex === -1) {
    throw new ErrorResponse('Product not in wishlist', 404);
  }
  
  // Update product
  wishlist.products[productIndex].notifyOnPriceChange = notifyOnPriceChange;
  
  await wishlist.save();
  
  res.status(200).json({
    success: true,
    message: 'Wishlist item updated',
    data: wishlist
  });
});

/**
 * @desc    Toggle wishlist privacy
 * @route   PUT /api/wishlists/privacy
 * @access  Private
 */
const toggleWishlistPrivacy = asyncHandler(async (req, res) => {
  const { isPublic } = req.body;
  
  // Get wishlist
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: []
    });
  }
  
  wishlist.isPublic = isPublic;
  await wishlist.save();
  
  res.status(200).json({
    success: true,
    message: `Wishlist is now ${isPublic ? 'public' : 'private'}`,
    data: {
      isPublic: wishlist.isPublic,
      shareCode: wishlist.shareCode
    }
  });
});

/**
 * @desc    Get wishlist by share code
 * @route   GET /api/wishlists/shared/:shareCode
 * @access  Public
 */
const getSharedWishlist = asyncHandler(async (req, res) => {
  const { shareCode } = req.params;
  
  const wishlist = await Wishlist.findOne({ shareCode, isPublic: true })
    .populate({
      path: 'products.product',
      select: 'name images price description category colors countInStock'
    })
    .populate('user', 'firstName lastName');
  
  if (!wishlist) {
    throw new ErrorResponse('Shared wishlist not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: {
      owner: {
        firstName: wishlist.user.firstName,
        lastName: wishlist.user.lastName
      },
      products: wishlist.products,
      createdAt: wishlist.createdAt
    }
  });
});

/**
 * @desc    Check if products in wishlist have price drops
 * @route   GET /api/wishlists/price-drops
 * @access  Private
 */
const checkPriceDrops = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id })
    .populate({
      path: 'products.product',
      select: 'name images price description'
    });
  
  if (!wishlist || wishlist.products.length === 0) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }
  
  // Check for price drops
  const priceDrops = wishlist.products
    .filter(item => 
      item.notifyOnPriceChange && 
      item.product.price < item.priceWhenAdded
    )
    .map(item => ({
      product: {
        id: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        currentPrice: item.product.price
      },
      originalPrice: item.priceWhenAdded,
      difference: item.priceWhenAdded - item.product.price,
      percentageOff: Math.round(((item.priceWhenAdded - item.product.price) / item.priceWhenAdded) * 100)
    }));
  
  res.status(200).json({
    success: true,
    data: priceDrops
  });
});

/**
 * @desc    Move all items from wishlist to cart
 * @route   POST /api/wishlists/move-to-cart
 * @access  Private
 */
const moveAllToCart = asyncHandler(async (req, res) => {
  // This would typically interact with the cart controller
  // For now, we'll just get the wishlist items and respond
  
  const wishlist = await Wishlist.findOne({ user: req.user.id })
    .populate({
      path: 'products.product',
      select: 'name images price countInStock'
    });
  
  if (!wishlist || wishlist.products.length === 0) {
    throw new ErrorResponse('Wishlist is empty', 400);
  }
  
  // Filter only in-stock products
  const availableProducts = wishlist.products
    .filter(item => item.product.countInStock > 0)
    .map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0].url,
      price: item.product.price,
      quantity: 1
    }));
  
  if (availableProducts.length === 0) {
    throw new ErrorResponse('No available products in wishlist', 400);
  }
  
  // In a complete implementation, this would call the cart controller
  // to add these items to the cart
  
  res.status(200).json({
    success: true,
    message: 'Items ready to be added to cart',
    data: availableProducts
  });
});

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  updateWishlistItem,
  toggleWishlistPrivacy,
  getSharedWishlist,
  checkPriceDrops,
  moveAllToCart
}; 