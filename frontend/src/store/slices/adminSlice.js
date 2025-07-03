import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://spotify-production-97f7.up.railway.app/api/admin";

const initialState = {
  users: [],
  stats: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  totalPages: 0,
  currentPage: 1,
  total: 0,
  isLoaded: false,
};

// Get all users (Admin only)
export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (params = {}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/users`, {
        ...config,
        params,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user (Admin only)
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/users/${userId}`, config);
      return userId;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle user admin status (Admin only)
export const toggleUserAdmin = createAsyncThunk(
  "admin/toggleUserAdmin",
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/users/${userId}/toggle-admin`,
        {},
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get admin stats
export const getAdminStats = createAsyncThunk(
  "admin/getStats",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/stats`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(toggleUserAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleUserAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.users.findIndex(
          (user) => user._id === action.payload.user._id
        );
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(toggleUserAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAdminStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
        state.isLoaded = true;
      })
      .addCase(getAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
