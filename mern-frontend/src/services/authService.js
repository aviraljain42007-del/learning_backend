import api from "./api";

export async function loginUser(formData) {
  const response = await api.post("/login", formData);
  return response.data;
}

export async function registerUser(formData) {
  const response = await api.post("/register", formData);
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/logout");
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/user");
  return response.data;
}