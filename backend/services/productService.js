const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");
const ApiError = require("../utils/errorhandler");
const redisClient = require("../config/redis");


class ProductService {
  // Create new product
    // Upload image to cloudinary
  async uploadImage(buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
        }
      );
      stream.end(buffer);
    });
  }

  async createProduct(productData, userId, imageBuffer) {
    let imageData = {};

    if (imageBuffer) {
      try {
        imageData = await this.uploadImage(imageBuffer);
      } catch (error) {
        throw new ApiError(500, "Image upload failed");
      }
    }

    const product = await Product.create({
      ...productData,
      createdBy: userId,
      image: imageData,
    });

    await this.invalidateProductCache();

    return product;
  }


  // Get products with filters and pagination
  async getProducts(query, page = 1, limit = 8) {
    const cacheKey = `products:${JSON.stringify(query)}:page${page}:limit${limit}`;
    try {
      const cachedResult = await redisClient.get(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }
    } catch (err) {
      console.error("Redis get error:", err);
    }

    const keyword = query.keyword ? { $text: { $search: query.keyword } } : {};
    const category = query.category ? { category: query.category } : {};

    const copyQuery = { ...query };
    const removeFields = ["keyword", "page", "limit", "category"];
    removeFields.forEach((key) => delete copyQuery[key]);

    let queryStr = JSON.stringify(copyQuery);
    queryStr = queryStr.replace(/\b(gte|lte)\b/g, (key) => `$${key}`);
    const priceFilter = JSON.parse(queryStr);

    const finalQuery = { ...keyword, ...category, ...priceFilter };

    const totalProducts = await Product.countDocuments();
    const filteredProductsCount = await Product.countDocuments(finalQuery);

    const skip = (page - 1) * limit;

    let productQuery = Product.find(finalQuery).limit(limit).skip(skip);

    if (query.keyword) {
      productQuery = productQuery.sort({ score: { $meta: "textScore" } });
    } else {
      productQuery = productQuery.sort({ createdAt: -1 });
    }

    const products = await productQuery.lean();

    const result = {
      totalProducts,
      filteredProductsCount,
      page,
      count: products.length,
      products,
    };

    try {
      // Cache for 1 hour (3600 seconds)
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
    } catch (err) {
      console.error("Redis set error:", err);
    }

    return result;
  }

  // Get single product by ID
  async getSingleProduct(productId) {
    const cacheKey = `product:${productId}`;
    try {
      const cachedProduct = await redisClient.get(cacheKey);
      if (cachedProduct) {
        return JSON.parse(cachedProduct);
      }
    } catch (err) {
      console.error("Redis get error:", err);
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    try {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(product));
    } catch (err) {
      console.error("Redis set error:", err);
    }

    return product;
  }

  // Update product
  async updateProduct(productId, updateData, imageBuffer) {
    let product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (imageBuffer) {
      if (product.image && product.image.public_id) {
        await cloudinary.v2.uploader.destroy(product.image.public_id);
      }
      const imageData = await this.uploadImage(imageBuffer);
      updateData.image = imageData;
    }

    product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    await this.invalidateProductCache();
    await this.invalidateSingleProductCache(productId);

    return product;
  }

  // Delete product
  async deleteProduct(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.image && product.image.public_id) {
      await cloudinary.v2.uploader.destroy(product.image.public_id);
    }

    await Product.findByIdAndDelete(productId);

    await this.invalidateProductCache();
    await this.invalidateSingleProductCache(productId);
  }

  // Create or update product review
  async createProductReview(productId, userId, userName, rating, comment) {
    const product = await Product.findById(productId).lean();
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const existingReviewIndex = product.reviews.findIndex(
      (rev) => rev.user.toString() === userId.toString()
    );

    let updatedProduct;

    if (existingReviewIndex !== -1) {
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $set: {
            "reviews.$[elem].rating": Number(rating),
            "reviews.$[elem].comment": comment,
          },
        },
        {
          arrayFilters: [{ "elem.user": userId }],
          new: true,
          runValidators: false,
        }
      );
    } else {
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            reviews: {
              user: userId,
              name: userName,
              rating: Number(rating),
              comment: comment,
            },
          },
          $inc: { numOfReviews: 1 },
        },
        { new: true, runValidators: false }
      );
    }

    // Recalculate average rating
    const avgRating = this.calculateAverageRating(updatedProduct.reviews);
    updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { ratings: avgRating } },
      { new: true }
    );

    await this.invalidateProductCache();
    await this.invalidateSingleProductCache(productId);

    return updatedProduct;
  }

  // Delete review
  async deleteReview(productId, reviewId) {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: { reviews: { _id: reviewId } },
        $inc: { numOfReviews: -1 },
      },
      { new: true, runValidators: false }
    );

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    // Recalculate average rating
    const avgRating = this.calculateAverageRating(updatedProduct.reviews);
    const finalProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { ratings: avgRating } },
      { new: true }
    );

    await this.invalidateProductCache();
    await this.invalidateSingleProductCache(productId);

    return finalProduct;
  }

  // Get product reviews
  async getProductReviews(productId) {
    const product = await Product.findById(productId).lean();
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return product.reviews;
  }

  // Helper: Calculate average rating
  calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return totalRating / reviews.length;
  }

  async invalidateProductCache() {
    try {
      const keys = await redisClient.keys("products:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err) {
      console.error("Cache invalidation error:", err);
    }
  }

  async invalidateSingleProductCache(productId) {
    try {
      await redisClient.del(`product:${productId}`);
    } catch (err) {
      console.error("Cache invalidation error:", err);
    }
  }
}

module.exports = new ProductService();
