/**
 * Advanced search service for products
 * 
 * This service provides methods for searching products with various filters,
 * facets, autocomplete, and relevance scoring.
 * 
 * Note: In a production environment, this would integrate with Elasticsearch 
 * or another dedicated search engine. This implementation uses MongoDB aggregation
 * as a placeholder.
 */
class SearchService {
  constructor(models) {
    this.Product = models?.Product;
  }

  /**
   * Initialize the search service with model references
   * @param {Object} models - MongoDB models
   */
  initialize(models) {
    this.Product = models.Product;
  }

  /**
   * Search for products with filters, sorting, and pagination
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} Search results with products and facets
   */
  async searchProducts(params = {}) {
    const {
      query = '',
      category,
      minPrice,
      maxPrice,
      colors = [],
      features = [],
      sort = 'relevance',
      page = 1,
      limit = 20,
      includeOutOfStock = false
    } = params;

    // Build match stage
    const matchStage = {};
    
    // Text search
    if (query) {
      matchStage.$text = { $search: query };
    }
    
    // Category filter
    if (category) {
      matchStage.category = category;
    }
    
    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      matchStage.price = {};
      if (minPrice !== undefined) {
        matchStage.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        matchStage.price.$lte = Number(maxPrice);
      }
    }
    
    // Color filter
    if (colors.length > 0) {
      matchStage['colors.name'] = { $in: colors };
    }
    
    // Feature filter
    if (features.length > 0) {
      matchStage.features = { $all: features };
    }
    
    // Stock filter
    if (!includeOutOfStock) {
      matchStage.countInStock = { $gt: 0 };
    }

    // Create pipeline
    const pipeline = [
      { $match: matchStage }
    ];

    // Add text score if using text search
    if (query) {
      pipeline.push({
        $addFields: {
          relevanceScore: { $meta: 'textScore' }
        }
      });
    }

    // Sort stage
    let sortStage = {};
    switch (sort) {
      case 'relevance':
        if (query) {
          sortStage = { relevanceScore: -1, rating: -1 };
        } else {
          sortStage = { rating: -1, numReviews: -1 };
        }
        break;
      case 'price_asc':
        sortStage = { price: 1 };
        break;
      case 'price_desc':
        sortStage = { price: -1 };
        break;
      case 'newest':
        sortStage = { createdAt: -1 };
        break;
      case 'rating':
        sortStage = { rating: -1, numReviews: -1 };
        break;
      case 'popularity':
        sortStage = { numReviews: -1, rating: -1 };
        break;
      default:
        sortStage = { _id: 1 };
    }
    
    pipeline.push({ $sort: sortStage });

    // Facet stage for pagination and facets
    pipeline.push({
      $facet: {
        products: [
          { $skip: (page - 1) * limit },
          { $limit: limit }
        ],
        totalCount: [
          { $count: 'count' }
        ],
        categoryFacets: [
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        colorFacets: [
          { $unwind: '$colors' },
          { $group: { _id: '$colors.name', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        priceFacets: [
          {
            $bucket: {
              groupBy: '$price',
              boundaries: [0, 100, 500, 1000, 2000, 5000],
              default: 'Other',
              output: {
                count: { $sum: 1 }
              }
            }
          }
        ],
        featureFacets: [
          { $unwind: '$features' },
          { $group: { _id: '$features', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]
      }
    });

    try {
      // Execute the pipeline
      const results = await this.Product.aggregate(pipeline);
      
      if (!results || results.length === 0) {
        return {
          products: [],
          totalCount: 0,
          facets: {},
          pages: 0,
          page
        };
      }

      const [result] = results;
      
      // Format response
      return {
        products: result.products,
        totalCount: result.totalCount[0]?.count || 0,
        facets: {
          categories: result.categoryFacets,
          colors: result.colorFacets,
          price: result.priceFacets,
          features: result.featureFacets
        },
        pages: Math.ceil((result.totalCount[0]?.count || 0) / limit),
        page
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Get autocomplete suggestions for search query
   * @param {string} query - Partial search query
   * @param {number} limit - Maximum number of suggestions
   * @returns {Promise<Array>} Autocomplete suggestions
   */
  async getAutocompleteSuggestions(query, limit = 5) {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      // In a real implementation with Elasticsearch, this would use a completion suggester
      // Using MongoDB's text search as a placeholder
      const results = await this.Product.aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { category: { $regex: query, $options: 'i' } }
            ]
          }
        },
        {
          $project: {
            name: 1,
            category: 1,
            image: { $arrayElemAt: ['$images.url', 0] },
            _score: { $meta: 'textScore' }
          }
        },
        { $limit: limit }
      ]);

      return results.map(item => ({
        type: 'product',
        id: item._id,
        name: item.name,
        category: item.category,
        image: item.image
      }));
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }

  /**
   * Find similar products based on product features and category
   * @param {string} productId - Product ID to find similar products for
   * @param {number} limit - Maximum number of similar products
   * @returns {Promise<Array>} Similar products
   */
  async findSimilarProducts(productId, limit = 4) {
    try {
      const product = await this.Product.findById(productId);
      
      if (!product) {
        return [];
      }

      // Find products with similar features in the same category
      const similarProducts = await this.Product.aggregate([
        {
          $match: {
            _id: { $ne: product._id },
            category: product.category
          }
        },
        {
          $addFields: {
            // Calculate similarity score based on shared features
            similarityScore: {
              $size: {
                $setIntersection: ['$features', product.features]
              }
            }
          }
        },
        { $sort: { similarityScore: -1, rating: -1 } },
        { $limit: limit }
      ]);

      return similarProducts;
    } catch (error) {
      console.error('Similar products error:', error);
      return [];
    }
  }

  /**
   * Get trending products based on recent activity
   * @param {number} limit - Maximum number of trending products
   * @returns {Promise<Array>} Trending products
   */
  async getTrendingProducts(limit = 8) {
    // In a real implementation, this would use real-time analytics data
    // Using a simple proxy of highest-rated products as a placeholder
    try {
      const trendingProducts = await this.Product.find({
        numReviews: { $gte: 5 }
      })
        .sort({ rating: -1, numReviews: -1 })
        .limit(limit);

      return trendingProducts;
    } catch (error) {
      console.error('Trending products error:', error);
      return [];
    }
  }

  /**
   * Get personalized product recommendations for a user
   * @param {string} userId - User ID
   * @param {number} limit - Maximum number of recommendations
   * @returns {Promise<Array>} Recommended products
   */
  async getPersonalizedRecommendations(userId, limit = 6) {
    // In a real implementation, this would use a recommendation engine
    // This is a simple implementation based on user activity
    try {
      // Get user activity model
      const UserActivity = this.Product.db.model('UserActivity');
      const mostViewedProductIds = await UserActivity.getMostViewedProducts(userId, limit);
      
      if (!mostViewedProductIds || mostViewedProductIds.length === 0) {
        // Fallback to trending products if no user activity
        return this.getTrendingProducts(limit);
      }

      // Get products from IDs
      const products = await this.Product.find({
        _id: { $in: mostViewedProductIds }
      });

      return products;
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return this.getTrendingProducts(limit);
    }
  }
}

module.exports = new SearchService(); 