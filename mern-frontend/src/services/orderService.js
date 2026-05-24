import api from "./api";

export async function createOrder(orderData) {
  const response = await api.post("/order", orderData);
  return response.data;
}

export async function getMyOrders() {
  const response = await api.get("/order");
  return response.data;
}

export async function getOrderById(orderId) {
  const response = await api.get(`/order/${orderId}`);
  return response.data;
}

// Admin: get all orders
export async function getAllOrders() {
  const response = await api.get("/admin/orders");
  return response.data;
}

// Admin: update order status
export async function updateOrderStatus(orderId, status) {
  const response = await api.put(`/admin/order/${orderId}`, {status:status});

  return response.data;
}

// Admin: delete order
export async function deleteOrder(orderId) {
  const response = await api.delete(`/admin/order/${orderId}`);
  return response.data;
}