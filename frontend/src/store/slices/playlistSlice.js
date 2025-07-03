import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://spotify-production-97f7.up.railway.app/api/playlists";

const initialState = {
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  isLoaded: false,
};

// Get user playlists
export const getPlaylists = createAsyncThunk(
  "playlists/getAll",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.playlists.playlists.length > 0 && state.playlists.isLoaded) {
        return state.playlists.playlists;
      }

      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No token available");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get playlist by ID
export const getPlaylistById = createAsyncThunk(
  "playlists/getById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No token available");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create playlist
export const createPlaylist = createAsyncThunk(
  "playlists/create",
  async (playlistData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL, playlistData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update playlist
export const updatePlaylist = createAsyncThunk(
  "playlists/update",
  async ({ id, playlistData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/${id}`,
        playlistData,
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

// Delete playlist
export const deletePlaylist = createAsyncThunk(
  "playlists/delete",
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

// Add song to playlist
export const addSongToPlaylist = createAsyncThunk(
  "playlists/addSong",
  async ({ playlistId, songId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/${playlistId}/songs`,
        { songId },
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

// Remove song from playlist
export const removeSongFromPlaylist = createAsyncThunk(
  "playlists/removeSong",
  async ({ playlistId, songId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${API_URL}/${playlistId}/songs/${songId}`,
        config
      );
      return { playlistId, songId, playlist: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlaylists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.playlists = action.payload;
        state.isLoaded = true;
      })
      .addCase(getPlaylists.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPlaylistById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentPlaylist = action.payload;
      })
      .addCase(getPlaylistById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPlaylist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.playlists.unshift(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePlaylist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.playlists.findIndex(
          (playlist) => playlist._id === action.payload._id
        );
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
        if (
          state.currentPlaylist &&
          state.currentPlaylist._id === action.payload._id
        ) {
          state.currentPlaylist = action.payload;
        }
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePlaylist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.playlists = state.playlists.filter(
          (playlist) => playlist._id !== action.payload
        );
        if (
          state.currentPlaylist &&
          state.currentPlaylist._id === action.payload
        ) {
          state.currentPlaylist = null;
        }
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addSongToPlaylist.fulfilled, (state, action) => {
        const index = state.playlists.findIndex(
          (playlist) => playlist._id === action.payload._id
        );
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
        if (
          state.currentPlaylist &&
          state.currentPlaylist._id === action.payload._id
        ) {
          state.currentPlaylist = action.payload;
        }
      })
      .addCase(removeSongFromPlaylist.fulfilled, (state, action) => {
        const index = state.playlists.findIndex(
          (playlist) => playlist._id === action.payload.playlistId
        );
        if (index !== -1) {
          state.playlists[index] = action.payload.playlist;
        }
        if (
          state.currentPlaylist &&
          state.currentPlaylist._id === action.payload.playlistId
        ) {
          state.currentPlaylist = action.payload.playlist;
        }
      });
  },
});

export const { reset, setCurrentPlaylist, clearCurrentPlaylist } =
  playlistSlice.actions;
export default playlistSlice.reducer;
