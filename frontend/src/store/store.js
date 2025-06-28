import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import songReducer from "./slices/songSlice";
import playlistReducer from "./slices/playlistSlice";
import playerReducer from "./slices/playerSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    songs: songReducer,
    playlists: playlistReducer,
    player: playerReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["player/setAudioElement"],
        ignoredPaths: ["player.audioElement"],
      },
    }),
});
