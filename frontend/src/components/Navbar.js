import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-spotify-green to-green-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl font-bold text-white">🎵</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-spotify-green to-green-400 bg-clip-text text-transparent">
                Spotify Clone
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="nav-link text-lg">
              {user?.isAdmin ? "Admin Dashboard" : "Dashboard"}
            </Link>
            <Link to="/songs" className="nav-link text-lg">
              Songs
            </Link>
            {!user?.isAdmin && (
              <Link to="/playlists" className="nav-link text-lg">
                Playlists
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-spotify-green to-green-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  {user?.username}
                </div>
                {user?.isAdmin && (
                  <div className="text-spotify-green text-xs">Admin</div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="btn btn-ghost text-sm">
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">🚪</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
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
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50">
            <div className="flex flex-col space-y-4">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link text-lg px-4 py-2 rounded-lg hover:bg-gray-800/50"
              >
                {user?.isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>
              <Link
                to="/songs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link text-lg px-4 py-2 rounded-lg hover:bg-gray-800/50"
              >
                Songs
              </Link>
              {!user?.isAdmin && (
                <Link
                  to="/playlists"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="nav-link text-lg px-4 py-2 rounded-lg hover:bg-gray-800/50"
                >
                  Playlists
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
