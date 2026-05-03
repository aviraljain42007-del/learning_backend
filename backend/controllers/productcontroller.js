const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");

exports.createProduct = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    let imageData = {};

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload_stream(
        { folder: "products" },
        async (error, result) => {
          if (error) {
            throw new Error("Image upload failed");
          }

          imageData = {
            public_id: result.public_id,
            url: result.secure_url,
          };

          req.body.image = imageData;

          const product = await Product.create(req.body);

          return res.status(201).json({
            success: true,
            product,
          });
        },
      );

      result.end(req.file.buffer);

      return;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getproducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i"
          },
        }
      : {};

    const category = req.query.category
      ? {
          category: req.query.category,
        }
      : {};

    const copyquery = { ...req.query };
    const removefields = ["keyword", "page", "limit", "category"];

    removefields.forEach((key) => delete copyquery[key]);

    let querystr = JSON.stringify(copyquery);

    querystr = querystr.replace(/\b(gte|lte)\b/g, (key) => `$${key}`);

    const pricefilter = JSON.parse(querystr);

    const query = {
      ...keyword,
      ...category,
      ...pricefilter,
    };
    const totalProducts = await Product.countDocuments();

    const filteredProductsCount = await Product.countDocuments(query);

    const page = Number(req.query.page);
    const limit = 8;
    const skip = (page - 1) * 8;

    const products = await Product.find(query).limit(limit).skip(skip);
    res.status(200).json({
      success: true,
      totalProducts,
      filteredProductsCount,
      page,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getsingleproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateproduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (req.file) {
      if (product.image && product.image.public_id) {
        await cloudinary.v2.uploader.destroy(product.image.public_id);
      }

      const result = await uploadToCloudinary(req.file.buffer);

      req.body.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Product exists?
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createproductreview = async (req, res) => {
  try {
    const { rating, coomment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    const review = {
      user: req.params.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const isreviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toSring(),
    );

    if (isreviewd) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toSring()) {
          ((rev.rating = rating), (rev.comment = comment));
        }
      });
    } else {
      // New review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let totalrating = 0;
    product.reviews.forEach((rev) => {
      totalrating += rev.rating;
    });

    product.ratings = totalrating / product.reviews.length;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Remove selected review
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.reviewId.toString(),
    );

    // Recalculate avg
    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    const ratings = reviews.length === 0 ? 0 : avg / reviews.length;

    const numOfReviews = reviews.length;

    // Save updated product
    product.reviews = reviews;
    product.ratings = ratings;
    product.numOfReviews = numOfReviews;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
