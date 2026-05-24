const userService = require("../services/userService");
const asyncHandler = require("../utils/asynchandler");
const ApiError = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


exports.register = asyncHandler(async (req, res) => {
  const { name, email, password , role } = req.body;

  const user = await userService.register(name, email, password ,role);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

exports.login = asyncHandler(async (req, res) => {
  console.log("welcome")
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await userService.login(email, password);

  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    await User.findOneAndUpdate({ refreshToken }, { $unset: { refreshToken: 1 } });
  }

  res
    .status(200)
    .cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});


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
  const  productId = req.params.id;
  const {quantity}= req.body;
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
  const productId  = req.params.id;

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

exports.getuser = asyncHandler(async (req, res) => {
  const user = req.user

  if(!user){
    throw new ApiError(404, "user not found")
  }

  res.status(200).json({
    success: true,
    user
  })
})