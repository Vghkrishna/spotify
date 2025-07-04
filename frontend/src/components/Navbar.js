import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-spotify-black/95 via-spotify-black-light/90 to-spotify-black/95 backdrop-blur-xl border-b border-gray-700/30 sticky top-0 z-40 shadow-2xl">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-spotify-green via-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-spotify-hover transition-all duration-500 group-hover:scale-110 animate-float">
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  🎧
                </span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-spotify-green to-green-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-3xl font-black bg-gradient-to-r from-spotify-green via-green-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
                Playhive
              </h1>
              <div className="text-xs text-gray-400 font-medium tracking-wider">
                MUSIC HUB
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`relative px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 group ${
                isActive("/dashboard")
                  ? "bg-gradient-to-r from-spotify-green to-green-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-xl">🏠</span>
                <span>{user?.isAdmin ? "Admin" : "Dashboard"}</span>
              </span>
              {isActive("/dashboard") && (
                <div className="absolute inset-0 bg-gradient-to-r from-spotify-green to-green-500 rounded-xl blur opacity-30"></div>
              )}
            </Link>
            <Link
              to="/songs"
              className={`relative px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 group ${
                isActive("/songs")
                  ? "bg-gradient-to-r from-spotify-green to-green-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-xl">🎵</span>
                <span>Songs</span>
              </span>
              {isActive("/songs") && (
                <div className="absolute inset-0 bg-gradient-to-r from-spotify-green to-green-500 rounded-xl blur opacity-30"></div>
              )}
            </Link>
            {!user?.isAdmin && (
              <Link
                to="/playlists"
                className={`relative px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 group ${
                  isActive("/playlists")
                    ? "bg-gradient-to-r from-spotify-green to-green-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="text-xl">📋</span>
                  <span>Playlists</span>
                </span>
                {isActive("/playlists") && (
                  <div className="absolute inset-0 bg-gradient-to-r from-spotify-green to-green-500 rounded-xl blur opacity-30"></div>
                )}
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <span className="text-sm font-bold text-white drop-shadow-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold text-sm">
                  {user?.username}
                </div>
                {user?.isAdmin && (
                  <div className="text-spotify-green text-xs font-bold tracking-wider bg-spotify-green/10 px-2 py-1 rounded-full">
                    ADMIN
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="relative px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold text-sm hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-lg">🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600/50 hover:border-spotify-green/50 transition-all duration-300 hover:scale-105 shadow-lg group"
            >
              <div className="relative z-10">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-spotify-green to-green-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-700/30 animate-slide-down bg-gradient-to-b from-gray-900/50 to-gray-800/30 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 group ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-spotify-green to-green-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">🏠</span>
                  <span>{user?.isAdmin ? "Admin Dashboard" : "Dashboard"}</span>
                </span>
                {isActive("/dashboard") && (
                  <div className="absolute inset-0 bg-gradient-to-r from-spotify-green to-green-500 rounded-2xl blur opacity-30"></div>
                )}
              </Link>
              <Link
                to="/songs"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 group ${
                  isActive("/songs")
                    ? "bg-gradient-to-r from-spotify-green to-green-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">🎵</span>
                  <span>Songs</span>
                </span>
                {isActive("/songs") && (
                  <div className="absolute inset-0 bg-gradient-to-r from-spotify-green to-green-500 rounded-2xl blur opacity-30"></div>
                )}
              </Link>
              {!user?.isAdmin && (
                <Link
                  to="/playlists"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 group ${
                    isActive("/playlists")
                      ? "bg-gradient-to-r from-spotify-green to-green-500 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">📋</span>
                    <span>Playlists</span>
                  </span>
                  {isActive("/playlists") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-spotify-green to-green-500 rounded-2xl blur opacity-30"></div>
                  )}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
