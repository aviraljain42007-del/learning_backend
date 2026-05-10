import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    setCartLoading(true);
    try {
      const { data } = await api.get("/user/cart");
      if (data.success) {
        setCart(data.cart || []);
      }
    } catch {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.put("/user/add-cart", { productId, quantity });
    if (data.success) {
      await fetchCart();
    }
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.put("/user/cart-update", { productId, quantity });
    if (data.success) {
      await fetchCart();
    }
    return data;
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete("/user/remove-from-cart", {
      data: { productId },
    });
    if (data.success) {
      await fetchCart();
    }
    return data;
  };

  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{ cart, cartLoading, cartItemCount, fetchCart, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
