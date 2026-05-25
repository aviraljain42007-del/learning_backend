import api from "./api";

export async function getCart() {
  const response = await api.get("/cart");
  return response.data;
}

export async function addToCart(productId, quantity = 1) {
  const response = await api.post("/cart", {
    productId,
    quantity,
  });

  return response.data;
}
export async function updateCartItem(productId, quantity) {
  console.log(productId)
  const response = await api.put(`/cart/${productId}`, {
    quantity,
  });

  return response.data;
}

export async function removeCartItem(productId) {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
}