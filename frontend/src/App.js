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
      <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-black-dark to-spotify-black-light flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-spotify-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow animate-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-spotify-green/5 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-spotify rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-spotify animate-pulse-slow">
            <span className="text-4xl">🎧</span>
          </div>

          {/* Loading spinner */}
          <div className="loading-spinner mx-auto mb-6"></div>

          {/* Loading text */}
          <h2 className="text-2xl font-bold gradient-text mb-2">Loading...</h2>
          <p className="text-spotify-gray">Preparing your music experience</p>

          {/* Loading dots */}
          <div className="loading-dots justify-center mt-6">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-black-dark to-spotify-black-light text-spotify-white relative">
        {/* Background noise texture */}
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-spotify-green/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse-slow animate-delay-1000"></div>
          <div className="absolute top-1/2 right-0 w-32 h-32 bg-spotify-green/3 rounded-full blur-2xl animate-float"></div>
        </div>

        {user && <Navbar />}

        <main className="relative z-10 flex-1 pb-24">
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
