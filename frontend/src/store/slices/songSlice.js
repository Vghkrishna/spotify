import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://spotify-production-97f7.up.railway.app/api/songs";

const initialState = {
  songs: [],
  currentSong: null,
  isLoading: false,
  isLoadingMore: false,
  isError: false,
  isSuccess: false,
  message: "",
  totalPages: 0,
  currentPage: 1,
  total: 0,
  isLoaded: false,
  hasMore: true,
};

// Get all songs (initial load)
export const getSongs = createAsyncThunk(
  "songs/getAll",
  async (params = {}, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (
        state.songs.songs.length > 0 &&
        Object.keys(params).length === 0 &&
        state.songs.isLoaded
      ) {
        return state.songs;
      }

      // Set default limit to 8 for initial load
      const defaultParams = { ...params, limit: 8, page: 1 };
      const response = await axios.get(API_URL, { params: defaultParams });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Load more songs (infinite scroll)
export const loadMoreSongs = createAsyncThunk(
  "songs/loadMore",
  async (params = {}, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const nextPage = state.songs.currentPage + 1;

      if (nextPage > state.songs.totalPages) {
        return { songs: [], hasMore: false };
      }

      const loadMoreParams = { ...params, limit: 8, page: nextPage };
      const response = await axios.get(API_URL, { params: loadMoreParams });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all songs for admin (no pagination)
export const getAllSongsForAdmin = createAsyncThunk(
  "songs/getAllForAdmin",
  async (params = {}, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, {
        params: { ...params, limit: 1000 },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get song by ID
export const getSongById = createAsyncThunk(
  "songs/getById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add new song (Admin only)
export const addSong = createAsyncThunk(
  "songs/add",
  async (songData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      console.log("Adding song with token:", token ? "Present" : "Missing");
      console.log("API URL:", API_URL);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // Remove Content-Type - let axios set it automatically for FormData
        },
      };

      console.log("Making API call to add song...");
      const response = await axios.post(API_URL, songData, config);
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update song (Admin only)
export const updateSong = createAsyncThunk(
  "songs/update",
  async ({ id, songData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${API_URL}/${id}`, songData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete song (Admin only)
export const deleteSong = createAsyncThunk(
  "songs/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Increment play count
export const incrementPlayCount = createAsyncThunk(
  "songs/incrementPlayCount",
  async (id, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/play`);
      return { id, playCount: response.data.playCount };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    },
    clearCurrentSong: (state) => {
      state.currentSong = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSongs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getSongs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.songs = action.payload.songs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.isLoaded = true;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(getSongs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(loadMoreSongs.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(loadMoreSongs.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        if (action.payload.songs && action.payload.songs.length > 0) {
          state.songs = [...state.songs, ...action.payload.songs];
          state.currentPage = action.payload.currentPage;
          state.hasMore =
            action.payload.currentPage < action.payload.totalPages;
        } else {
          state.hasMore = false;
        }
      })
      .addCase(loadMoreSongs.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllSongsForAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllSongsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.songs = action.payload.songs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.isLoaded = true;
        state.hasMore = false; // Admin gets all songs at once
      })
      .addCase(getAllSongsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSongById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSongById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSong = action.payload;
      })
      .addCase(getSongById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addSong.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSong.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.songs.unshift(action.payload);
      })
      .addCase(addSong.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSong.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSong.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.songs.findIndex(
          (song) => song._id === action.payload._id
        );
        if (index !== -1) {
          state.songs[index] = action.payload;
        }
      })
      .addCase(updateSong.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteSong.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSong.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.songs = state.songs.filter((song) => song._id !== action.payload);
      })
      .addCase(deleteSong.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(incrementPlayCount.fulfilled, (state, action) => {
        const song = state.songs.find((s) => s._id === action.payload.id);
        if (song) {
          song.playCount = action.payload.playCount;
        }
      });
  },
});

export const { reset, setCurrentSong, clearCurrentSong } = songSlice.actions;
export default songSlice.reducer;
