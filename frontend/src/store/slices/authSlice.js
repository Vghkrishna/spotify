import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://spotify-production-97f7.up.railway.app/users";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  isLoading: false,
  error: null,
  isProfileLoaded: false,
  isProfileLoading: false,
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }

      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get user profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { user, isProfileLoaded, isProfileLoading } = state.auth;

      // Don't fetch if already loaded or currently loading
      if (isProfileLoaded || isProfileLoading) {
        return state.auth.user;
      }

      if (!user || !user.token) {
        return rejectWithValue("No token available");
      }

      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // If token is invalid, clear localStorage
        if (response.status === 401) {
          localStorage.removeItem("user");
        }
        return rejectWithValue(data.message || "Failed to get profile");
      }

      // Update localStorage with fresh user data
      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;

      if (!user || !user.token) {
        return rejectWithValue("No token available");
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update profile");
      }

      // Update localStorage with fresh user data
      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.isProfileLoaded = false;
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isSuccess = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.isProfileLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isProfileLoading = false;
        // Only update user if profile hasn't been loaded yet
        if (!state.isProfileLoaded) {
          state.user = { ...state.user, ...action.payload };
          state.isProfileLoaded = true;
        }
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isProfileLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, reset } = authSlice.actions;
export default authSlice.reducer;
