const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get reviews for a product
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { sort = 'newest', page = 1, limit = 10 } = req.query;
  
  // Validate product exists
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ErrorResponse('Product not found', 404);
  }
  
  // Build sort options
  let sortOptions = {};
  switch (sort) {
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'highest':
      sortOptions = { rating: -1 };
      break;
    case 'lowest':
      sortOptions = { rating: 1 };
      break;
    case 'most_helpful':
      sortOptions = { helpfulVotes: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }
  
  // Calculate pagination values
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Get approved reviews only for public viewing
  const reviews = await Review.find({ 
    product: productId,
    status: 'approved'
  })
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'firstName lastName avatar');
  
  // Get total count for pagination
  const totalReviews = await Review.countDocuments({ 
    product: productId,
    status: 'approved'
  });
  
  // Get rating statistics
  const ratingStats = await Review.aggregate([
    { $match: { product: product._id, status: 'approved' } },
    { $group: {
      _id: '$rating',
      count: { $sum: 1 }
    }},
    { $sort: { _id: -1 } }
  ]);
  
  // Format rating stats
  const ratings = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  };
  
  ratingStats.forEach(stat => {
    ratings[stat._id] = stat.count;
  });
  
  res.status(200).json({
    success: true,
    data: {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews
      },
      ratings
    }
  });
});

/**
 * @desc    Create a review
 * @route   POST /api/products/:productId/reviews
 * @access  Private
 */
const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, text, pros, cons, images } = req.body;
  
  // Validate product exists
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ErrorResponse('Product not found', 404);
  }
  
  // Check if user has already reviewed this product
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user.id
  });
  
  if (alreadyReviewed) {
    throw new ErrorResponse('You have already reviewed this product', 400);
  }
  
  // Check if the user has purchased this product
  const hasOrdered = await Order.findOne({
    user: req.user.id,
    'items.product': productId,
    status: { $in: ['delivered', 'completed'] }
  });
  
  // Create review
  const review = await Review.create({
    product: productId,
    user: req.user.id,
    rating,
    title,
    text,
    pros,
    cons,
    images,
    isVerifiedPurchase: hasOrdered ? true : false,
    status: 'pending' // Reviews need approval
  });
  
  res.status(201).json({
    success: true,
    message: 'Review submitted and pending approval',
    data: review
  });
});

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, title, text, pros, cons, images } = req.body;
  
  // Check if review exists and belongs to user
  let review = await Review.findOne({
    _id: id,
    user: req.user.id
  });
  
  if (!review) {
    throw new ErrorResponse('Review not found or not authorized', 404);
  }
  
  // Update review
  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.text = text || review.text;
  
  if (pros) review.pros = pros;
  if (cons) review.cons = cons;
  if (images) review.images = images;
  
  // Set review status back to pending for approval
  review.status = 'pending';
  
  await review.save();
  
  res.status(200).json({
    success: true,
    message: 'Review updated and pending approval',
    data: review
  });
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if review exists and belongs to user
  const review = await Review.findOne({
    _id: id,
    user: req.user.id
  });
  
  if (!review) {
    throw new ErrorResponse('Review not found or not authorized', 404);
  }
  
  await review.remove();
  
  res.status(200).json({
    success: true,
    message: 'Review deleted',
    data: {}
  });
});

/**
 * @desc    Get all reviews for admin
 * @route   GET /api/reviews
 * @access  Admin
 */
const getAllReviews = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  // Build filter object
  const filter = {};
  if (status) {
    filter.status = status;
  }
  
  // Calculate pagination values
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Get reviews
  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'firstName lastName email')
    .populate('product', 'name images');
  
  // Get total count for pagination
  const totalReviews = await Review.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    data: {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews
      }
    }
  });
});

/**
 * @desc    Approve or reject a review
 * @route   PUT /api/reviews/:id/status
 * @access  Admin
 */
const updateReviewStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Validate status
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    throw new ErrorResponse('Invalid status', 400);
  }
  
  // Check if review exists
  const review = await Review.findById(id);
  
  if (!review) {
    throw new ErrorResponse('Review not found', 404);
  }
  
  // Update status
  review.status = status;
  await review.save();
  
  res.status(200).json({
    success: true,
    message: `Review ${status}`,
    data: review
  });
});

/**
 * @desc    Vote on a review (helpful/unhelpful)
 * @route   POST /api/reviews/:id/vote
 * @access  Private
 */
const voteOnReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vote } = req.body;
  
  // Validate vote
  if (vote !== 'helpful' && vote !== 'unhelpful') {
    throw new ErrorResponse('Invalid vote value', 400);
  }
  
  // Check if review exists
  const review = await Review.findById(id);
  
  if (!review) {
    throw new ErrorResponse('Review not found', 404);
  }
  
  // Check if user has already voted
  const userVoteIndex = review.usersWhoVoted.findIndex(
    item => item.user.toString() === req.user.id
  );
  
  if (userVoteIndex !== -1) {
    const previousVote = review.usersWhoVoted[userVoteIndex].foundHelpful;
    
    // Remove previous vote count
    if (previousVote) {
      review.helpfulVotes -= 1;
    } else {
      review.unhelpfulVotes -= 1;
    }
    
    // Update with new vote
    review.usersWhoVoted[userVoteIndex].foundHelpful = vote === 'helpful';
  } else {
    // Add new vote
    review.usersWhoVoted.push({
      user: req.user.id,
      foundHelpful: vote === 'helpful'
    });
  }
  
  // Update vote counts
  if (vote === 'helpful') {
    review.helpfulVotes += 1;
  } else {
    review.unhelpfulVotes += 1;
  }
  
  await review.save();
  
  res.status(200).json({
    success: true,
    message: `Review marked as ${vote}`,
    data: {
      helpfulVotes: review.helpfulVotes,
      unhelpfulVotes: review.unhelpfulVotes
    }
  });
});

/**
 * @desc    Get user's reviews
 * @route   GET /api/reviews/user
 * @access  Private
 */
const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('product', 'name images');
  
  res.status(200).json({
    success: true,
    data: reviews
  });
});

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
  voteOnReview,
  getUserReviews
}; 