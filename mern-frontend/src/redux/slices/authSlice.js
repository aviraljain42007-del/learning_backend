import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  googleLogin,
} from "../../services/authService";

export const loadCurrentUserThunk = createAsyncThunk(
  "auth/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser();
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load current user",
      );
    }
  },
);

export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await loginUser(formData);

      if (data.user) {
        return data.user;
      }

      const currentUserData = await getCurrentUser();
      return currentUserData.user || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed",
      );
    }
  },
);

export const googleLoginThunk = createAsyncThunk(
  "auth/googleLogin",
  async ({ credential }, { rejectWithValue }) => {
    try {
      const data = await googleLogin(credential);

      if (data.user) {
        return data.user;
      }

      const currentUserData = await getCurrentUser();
      return currentUserData.user || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Google login failed",
      );
    }
  },
);

export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await registerUser(formData);

      if (data.user) {
        return data.user;
      }

      const currentUserData = await getCurrentUser();
      return currentUserData.user || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed",
      );
    }
  },
);

export const logoutUserThunk = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Logout failed",
      );
    }
  },
);

const initialState = {
  user: null,
  authLoading: true,
  authError: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.authError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUserThunk.pending, (state) => {
        state.authLoading = true;
        state.authError = "";
      })
      .addCase(loadCurrentUserThunk.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload;
      })
      .addCase(loadCurrentUserThunk.rejected, (state) => {
        state.authLoading = false;
        state.user = null;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.authError = "";
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authError = "";
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.user = null;
        state.authError = action.payload || "Login failed";
      })

      .addCase(registerUserThunk.pending, (state) => {
        state.authError = "";
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authError = "";
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.user = null;
        state.authError = action.payload || "Registration failed";
      })
      .addCase(googleLoginThunk.pending, (state) => {
        state.authError = "";
      })
      .addCase(googleLoginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authError = "";
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.user = null;
        state.authError = action.payload || "Google login failed";
      })

      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.authError = "";
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.authError = action.payload || "Logout failed";
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.authLoading;
export const selectAuthError = (state) => state.auth.authError;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectIsAdmin = (state) =>
  state.auth.user?.role?.toLowerCase() === "admin";

export default authSlice.reducer;
