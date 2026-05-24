const orderService = require("../services/orderService");
const asyncHandler = require("../utils/asynchandler");

exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  const order = await orderService.createOrder(req.user._id, shippingAddress);

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user._id);

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

exports.getSingleOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getSingleOrder(req.params.id);

  res.status(200).json({
    success: true,
    order,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await orderService.updateOrderStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    message: "Order status updated",
    order,
  });
});

exports.updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await orderService.updatePaymentStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    message: "Payment status updated",
    order,
  });
});

// Admin: Get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// Admin: Get order statistics
exports.getOrderStats = asyncHandler(async (req, res) => {
  const stats = await orderService.getOrderStats();

  res.status(200).json({
    success: true,
    stats,
  });
});

//delete order(admin)

exports.deleteOrder = asyncHandler(async (req, res) =>{
  const orderId = req.params.id

  await orderService.deleteOrder(orderId)

  res.status(200).json({
    success : true,
    message : "Order deleted Successfully"
  })
})