const userService = require("../services/userService");
const asyncHandler = require("../utils/asynchandler");
const ApiError = require("../utils/errorhandler");

exports.testuser = (req, res) => {
  res.send("controller is working");
};

exports.getprofile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected profile accessed",
    user: req.user,
  });
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await userService.register(name, email, password);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await userService.login(email, password);

  res.status(200).cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user,
    token,
  });
});

exports.logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

exports.adminboard = (req, res) => {
  res.status(200).json({
    success: true,
  });
};

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const updatedUser = await userService.addToCart(
    req.user._id,
    productId,
    quantity
  );

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart: updatedUser.cart,
  });
});

exports.getMyCart = asyncHandler(async (req, res) => {
  const cart = await userService.getCart(req.user._id);

  res.status(200).json({
    success: true,
    cart,
  });
});

exports.updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const updatedUser = await userService.updateCartQuantity(
    req.user._id,
    productId,
    quantity
  );

  res.status(200).json({
    success: true,
    message: "Cart quantity updated",
    cart: updatedUser.cart,
  });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const updatedUser = await userService.removeFromCart(
    req.user._id,
    productId
  );

  res.status(200).json({
    success: true,
    message: "Product removed from cart",
    cart: updatedUser.cart,
  });
});