const productService = require("../services/productService");
const asyncHandler = require("../utils/asynchandler");

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(
    req.body,
    req.user._id,
    req.file?.buffer
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

exports.getproducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(
    req.query,
    Number(req.query.page) || 1,
    8
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

exports.getsingleproduct = asyncHandler(async (req, res) => {
  const product = await productService.getSingleProduct(req.params.id);

  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateproduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.file?.buffer
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.createproductreview = asyncHandler(async (req, res) => {
  const { rating, coomment } = req.body;

  const product = await productService.createProductReview(
    req.params.id,
    req.user._id,
    req.user.name,
    rating,
    coomment
  );

  res.status(200).json({
    success: true,
    message: "Review submitted successfully",
    product,
  });
});

exports.getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await productService.getProductReviews(req.query.id);

  res.status(200).json({
    success: true,
    reviews,
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.query;

  const product = await productService.deleteReview(productId, reviewId);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    product,
  });
});
