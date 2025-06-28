import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProfile } from "./store/slices/authSlice";
import { ToastProvider } from "./context/ToastContext";

// Components
import Navbar from "./components/Navbar";
import AudioPlayer from "./components/AudioPlayer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PlaylistPage from "./pages/PlaylistPage";
import SongLibrary from "./pages/SongLibrary";

function App() {
  const dispatch = useDispatch();
  const { user, isLoading, isProfileLoaded } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Only fetch profile if user exists, has token, and profile hasn't been loaded yet
    if (user && user.token && !isProfileLoaded) {
      dispatch(getProfile());
    }
  }, [dispatch, user, isProfileLoaded]); // Include isProfileLoaded in dependencies

  // Don't fetch songs and playlists here - let individual pages handle it
  // This prevents the infinite loop

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-spotify-black">
        <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin-slow mb-5"></div>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        {user && <Navbar />}

        <main className="flex-1 pb-24">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.isAdmin ? <AdminDashboard /> : <UserDashboard />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/songs"
              element={
                <ProtectedRoute>
                  <SongLibrary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlist/:id"
              element={
                <ProtectedRoute>
                  <PlaylistPage />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />
            <Route
              path="*"
              element={
                user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </main>

        {user && <AudioPlayer />}
      </div>
    </ToastProvider>
  );
}

export default App;
