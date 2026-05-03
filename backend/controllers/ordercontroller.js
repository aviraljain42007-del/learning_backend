const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

// helper: product stock reduce
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

exports.createOrder = async (req, res) => {
  try {
    const { shippingInfo } = req.body;

    const user = await User.findById(req.user._id).populate("cart.product");

    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const orderItems = user.cart.map((item) => {
      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      };
    });

    const itemsPrice = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const taxPrice = Math.round(itemsPrice * 0.18);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    for (const item of orderItems) {
  const product = await Product.findById(item.product);

  if (!product || product.stock < item.quantity) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock for ${item.name}`
    });
  }
}

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Stock reduce after order placed
    for (const item of orderItems) {
      await updateStock(item.product, item.quantity);
    }

    // Cart clear
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
