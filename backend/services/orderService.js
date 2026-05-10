const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const mongoose = require("mongoose");
const ApiError = require("../utils/errorhandler");

class OrderService {
  // Create order with transaction
  async createOrder(userId, shippingInfo) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId)
        .populate("cart.product")
        .session(session);

      if (!user) {
        await session.abortTransaction();
        throw new ApiError(404, "User not found");
      }

      if (user.cart.length === 0) {
        await session.abortTransaction();
        throw new ApiError(400, "Cart is empty");
      }

      const orderItems = user.cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const itemsPrice = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const taxPrice = Math.round(itemsPrice * 0.18);
      const shippingPrice = itemsPrice > 500 ? 0 : 50;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      // Validate stock for all items
      for (const item of orderItems) {
        const product = await Product.findById(item.product).session(session);
        if (!product || product.stock < item.quantity) {
          await session.abortTransaction();
          throw new ApiError(
            400,
            `Insufficient stock for ${item.name}`,
            []
          );
        }
      }

      // Create order
      const order = await Order.create(
        [
          {
            user: userId,
            orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          },
        ],
        { session }
      );

      // Update stock for all items
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { new: true, session, runValidators: false }
        );
      }

      // Clear user cart
      await User.findByIdAndUpdate(
        userId,
        { $set: { cart: [] } },
        { session }
      );

      await session.commitTransaction();
      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get all orders of a user
  async getUserOrders(userId) {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return orders;
  }

  // Get single order by ID
  async getSingleOrder(orderId) {
    const order = await Order.findById(orderId).populate("user", "name email").lean();
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return order;
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    const updateData = {
      orderStatus: status,
    };

    if (status === "Delivered") {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return order;
  }

  // Update payment status
  async updatePaymentStatus(orderId, status) {
    const updateData = {
      "paymentInfo.status": status,
    };

    if (status === "Paid") {
      updateData["paymentInfo.paidAt"] = new Date();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return order;
  }

  // Get all orders (admin)
  async getAllOrders() {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return orders;
  }

  // Get order statistics
  async getOrderStats() {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
    };
  }
}

module.exports = new OrderService();
