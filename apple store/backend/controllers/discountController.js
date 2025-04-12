const asyncHandler = require('express-async-handler');
const Discount = require('../models/Discount');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all discount codes (admin)
 * @route   GET /api/discounts
 * @access  Admin
 */
const getAllDiscounts = asyncHandler(async (req, res) => {
  const { isActive, type, page = 1, limit = 20 } = req.query;
  
  // Build filter object
  const filter = {};
  
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }
  
  if (type) {
    filter.type = type;
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Get discounts
  const discounts = await Discount.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  // Get total count
  const totalDiscounts = await Discount.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    data: {
      discounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalDiscounts / parseInt(limit)),
        totalDiscounts
      }
    }
  });
});

/**
 * @desc    Get a single discount
 * @route   GET /api/discounts/:id
 * @access  Admin
 */
const getDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.findById(req.params.id);
  
  if (!discount) {
    throw new ErrorResponse('Discount not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: discount
  });
});

/**
 * @desc    Create a discount code
 * @route   POST /api/discounts
 * @access  Admin
 */
const createDiscount = asyncHandler(async (req, res) => {
  // Extract discount data from request body
  const {
    code,
    type,
    value,
    description,
    startDate,
    endDate,
    minimumPurchase,
    maximumDiscount,
    usageLimit,
    userLimit,
    applyTo,
    applicableCategories,
    applicableProducts,
    applicableUsers,
    excludedProducts
  } = req.body;
  
  // Validate required fields
  if (!code || !type || (type !== 'bogo' && !value) || !description || !endDate) {
    throw new ErrorResponse('Please provide all required fields', 400);
  }
  
  // Check if code already exists
  const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
  
  if (existingDiscount) {
    throw new ErrorResponse('Discount code already exists', 400);
  }
  
  // Create discount
  const discount = await Discount.create({
    code: code.toUpperCase(),
    type,
    value,
    description,
    startDate,
    endDate,
    minimumPurchase,
    maximumDiscount,
    usageLimit,
    userLimit,
    applyTo,
    applicableCategories,
    applicableProducts,
    applicableUsers,
    excludedProducts
  });
  
  res.status(201).json({
    success: true,
    message: 'Discount code created',
    data: discount
  });
});

/**
 * @desc    Update a discount
 * @route   PUT /api/discounts/:id
 * @access  Admin
 */
const updateDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Find discount
  let discount = await Discount.findById(id);
  
  if (!discount) {
    throw new ErrorResponse('Discount not found', 404);
  }
  
  // Update discount
  discount = await Discount.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'Discount updated',
    data: discount
  });
});

/**
 * @desc    Delete a discount
 * @route   DELETE /api/discounts/:id
 * @access  Admin
 */
const deleteDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Find discount
  const discount = await Discount.findById(id);
  
  if (!discount) {
    throw new ErrorResponse('Discount not found', 404);
  }
  
  await discount.remove();
  
  res.status(200).json({
    success: true,
    message: 'Discount deleted',
    data: {}
  });
});

/**
 * @desc    Verify a discount code's validity
 * @route   POST /api/discounts/verify
 * @access  Private
 */
const verifyDiscountCode = asyncHandler(async (req, res) => {
  const { code, cartTotal = 0, cartItems = [] } = req.body;
  
  if (!code) {
    throw new ErrorResponse('Please provide a discount code', 400);
  }
  
  // Find discount
  const discount = await Discount.findOne({ 
    code: code.toUpperCase(),
    isActive: true 
  });
  
  if (!discount) {
    throw new ErrorResponse('Invalid discount code', 400);
  }
  
  // Check if code is valid
  if (!discount.isValid()) {
    throw new ErrorResponse('Discount code has expired or reached usage limit', 400);
  }
  
  // Check minimum purchase
  if (cartTotal < discount.minimumPurchase) {
    throw new ErrorResponse(`Minimum purchase of $${discount.minimumPurchase} required`, 400);
  }
  
  // Check if user has already used the code (if authenticated)
  if (req.user && discount.isUsedByUser(req.user.id)) {
    throw new ErrorResponse('You have already used this discount code', 400);
  }
  
  // Calculate discount amount
  const discountAmount = discount.calculateDiscount(cartTotal, cartItems);
  
  res.status(200).json({
    success: true,
    data: {
      valid: true,
      code: discount.code,
      type: discount.type,
      discountAmount,
      discountedTotal: cartTotal - discountAmount,
      description: discount.description
    }
  });
});

/**
 * @desc    Get active public discounts
 * @route   GET /api/discounts/public
 * @access  Public
 */
const getPublicDiscounts = asyncHandler(async (req, res) => {
  const now = new Date();
  
  // Find active public discounts
  const discounts = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gt: now },
    applyTo: 'all' // Only show generally applicable discounts
  })
    .select('code type value description minimumPurchase')
    .limit(5);
  
  res.status(200).json({
    success: true,
    data: discounts
  });
});

/**
 * @desc    Toggle discount active status
 * @route   PUT /api/discounts/:id/toggle
 * @access  Admin
 */
const toggleDiscountStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Find discount
  const discount = await Discount.findById(id);
  
  if (!discount) {
    throw new ErrorResponse('Discount not found', 404);
  }
  
  // Toggle status
  discount.isActive = !discount.isActive;
  await discount.save();
  
  res.status(200).json({
    success: true,
    message: `Discount ${discount.isActive ? 'activated' : 'deactivated'}`,
    data: {
      id: discount._id,
      isActive: discount.isActive
    }
  });
});

module.exports = {
  getAllDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  verifyDiscountCode,
  getPublicDiscounts,
  toggleDiscountStatus
}; 