import api from "./api";

export async function getProducts(params = {}) {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
}

export async function getProductById(productId) {
  const response = await api.get(`/products/${productId}`);
  return response.data;
}

export async function createProduct(formData) {
  const response = await api.post("/products", formData)

  return response.data;
}

export async function updateProduct(productId, formData) {
  const response = await api.put(`/products/${productId}`, formData)
  return response.data;
}

export async function deleteProduct(productId) {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
}
export
 async function createProductReview(productId, reviewData) {
  const response = await api.post(`/products/${productId}/reviews`, reviewData);
  return response.data;
}