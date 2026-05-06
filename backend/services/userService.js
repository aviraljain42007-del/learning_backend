const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/errorhandler");

class UserService {
  // Register new user
  async register(name, email, password) {
    if (!name || !email || !password) {
      throw new ApiError(400, "Please fill all the fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  // Login user and generate token
  async login(email, password) {
    if (!email || !password) {
      throw new ApiError(400, "Fill all details");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Wrong email or password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(401, "Wrong email or password");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return { user, token };
  }

  // Get user profile
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  // Add product to cart atomically
  async addToCart(userId, productId, quantity) {
    if (!quantity || quantity <= 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    let updatedUser;
    if (existingItem) {
      // Update existing cart item quantity
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { "cart.$[elem].quantity": Number(quantity) } },
        {
          arrayFilters: [{ "elem.product": productId }],
          new: true,
          runValidators: true,
        }
      );
    } else {
      // Add new item to cart
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            cart: {
              product: productId,
              quantity: Number(quantity),
            },
          },
        },
        { new: true, runValidators: true }
      );
    }

    return updatedUser;
  }

  // Update cart item quantity
  async updateCartQuantity(userId, productId, quantity) {
    if (!quantity || quantity <= 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { "cart.$[elem].quantity": Number(quantity) } },
      {
        arrayFilters: [{ "elem.product": productId }],
        new: true,
        runValidators: true,
      }
    );

    if (
      updatedUser.cart.every((item) => item.product.toString() !== productId)
    ) {
      throw new ApiError(404, "Product not found in cart");
    }

    return updatedUser;
  }

  // Remove product from cart
  async removeFromCart(userId, productId) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          cart: { product: productId },
        },
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  }

  // Get user cart
  async getCart(userId) {
    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user.cart;
  }
}

module.exports = new UserService();
