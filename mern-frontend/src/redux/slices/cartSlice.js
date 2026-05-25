import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../services/cartService";

/*
  Backend response shape different ho sakta hai:
  1. { cart: { items: [...] } }
  2. { cartItems: [...] }
  3. { items: [...] }
  4. { cart: [...] }
  5. { user: { cart: [...] } }

  Ye helper sab handle karega.
*/
function extractCartItems(data) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data.cart)) return data.cart;

  if (Array.isArray(data.cart?.items)) return data.cart.items;

  if (Array.isArray(data.cartItems)) return data.cartItems;

  if (Array.isArray(data.items)) return data.items;

  if (Array.isArray(data.user?.cart)) return data.user.cart;

  return [];
}

function getProductFromItem(item) {
  return item.product || item.productId;
}

/*
  Load cart from backend
*/
export const fetchCartThunk = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCart();

      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load cart"
      );
    }
  }
);

/*
  Add to cart

  Important:
  POST /cart ke baad hum fresh GET /cart kar rahe hain
  so Redux state backend ke latest cart se sync ho jaaye.
*/
export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      await addToCart(productId, quantity);

      const cartData = await getCart();

      return cartData.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to add to cart"
      );
    }
  }
);

/*
  Update cart item quantity

  Update ke baad bhi fresh cart fetch kar rahe hain.
*/
export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      
      await updateCartItem(productId, quantity);

      const cartData = await getCart();

      return cartData.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update cart"
      );
    }
  }
);

/*
  Remove item

  Remove ke baad fresh cart fetch.
*/
export const removeCartItemThunk = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      await removeCartItem(productId);

      const cartData = await getCart();

      return extractCartItems(cartData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove item"
      );
    }
  }
);

const initialState = {
  cartItems: [],
  loading: false,
  error: "",
  message: "",
  updatingItemId: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartMessage(state) {
      state.message = "";
    },

    clearCartError(state) {
      state.error = "";
    },

    resetCartState(state) {
      state.cartItems = [];
      state.loading = false;
      state.error = "";
      state.message = "";
      state.updatingItemId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      /*
        Fetch cart
      */
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load cart";
      })

      /*
        Add to cart
      */
      .addCase(addToCartThunk.pending, (state, action) => {
        state.error = "";
        state.message = "";
        state.updatingItemId = action.meta.arg.productId;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.message = "Product added to cart";
        state.updatingItemId = "";
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to add to cart";
        state.updatingItemId = "";
      })

      /*
        Update cart item quantity
      */
      .addCase(updateCartItemThunk.pending, (state, action) => {
        state.error = "";
        state.message = "";
        state.updatingItemId = action.meta.arg.productId;
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.updatingItemId = "";
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to update cart";
        state.updatingItemId = "";
      })

      /*
        Remove cart item
      */
      .addCase(removeCartItemThunk.pending, (state, action) => {
        state.error = "";
        state.message = "";
        state.updatingItemId = action.meta.arg;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.message = "Item removed from cart";
        state.updatingItemId = "";
      })
      .addCase(removeCartItemThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove item";
        state.updatingItemId = "";
      });
  },
});

export const { clearCartMessage, clearCartError, resetCartState } =
  cartSlice.actions;

/*
  Selectors
*/
export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartLoading = (state) => state.cart.loading;

export const selectCartError = (state) => state.cart.error;

export const selectCartMessage = (state) => state.cart.message;

export const selectUpdatingItemId = (state) => state.cart.updatingItemId;

export const selectCartTotal = (state) =>
  state.cart.cartItems.reduce((total, item) => {
    const product = getProductFromItem(item);

    return total + (product?.price || 0) * item.quantity;
  }, 0);

export const selectCartTotalQuantity = (state) =>
  state.cart.cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

export const selectCartCount = (state) => state.cart.cartItems.length;

export default cartSlice.reducer;
