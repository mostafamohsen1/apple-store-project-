const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Product.find(JSON.parse(queryStr));
    
    // Add search functionality
    if (req.query.search) {
      query = Product.find({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { category: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    }
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const products = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    await product.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Upload product image
// @route   PUT /api/products/:id/image
// @access  Private
exports.productImageUpload = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    if (!req.files) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }
    
    const file = req.files.file;
    
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file'
      });
    }
    
    // Check filesize
    if (file.size > process.env.MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: `Please upload an image less than ${process.env.MAX_FILE_SIZE}`
      });
    }
    
    // Create custom filename
    file.name = `photo_${product._id}${path.parse(file.name).ext}`;
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          error: 'Problem with file upload'
        });
      }
      
      // Update product with new image
      await Product.findByIdAndUpdate(req.params.id, { 
        $push: { 
          images: {
            url: `/uploads/${file.name}`,
            alt: product.name
          } 
        } 
      });
      
      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 