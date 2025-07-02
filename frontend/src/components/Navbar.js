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
    <nav className="bg-gradient-to-r from-spotify-black/95 to-spotify-black-light/95 backdrop-blur-xl border-b border-gray-700/30 sticky top-0 z-40 shadow-lg">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-spotify rounded-xl flex items-center justify-center shadow-spotify group-hover:shadow-spotify-hover transition-all duration-300 group-hover:scale-105 animate-float">
              <span className="text-2xl font-bold text-white">🎧</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold gradient-text">
                Spotify Clone
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className={`nav-link text-lg font-medium ${
                isActive("/dashboard") ? "active" : ""
              }`}
            >
              {user?.isAdmin ? "Admin Dashboard" : "Dashboard"}
            </Link>
            <Link
              to="/songs"
              className={`nav-link text-lg font-medium ${
                isActive("/songs") ? "active" : ""
              }`}
            >
              Songs
            </Link>
            {!user?.isAdmin && (
              <Link
                to="/playlists"
                className={`nav-link text-lg font-medium ${
                  isActive("/playlists") ? "active" : ""
                }`}
              >
                Playlists
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-spotify rounded-full flex items-center justify-center shadow-spotify hover:shadow-spotify-hover transition-all duration-300 hover:scale-110">
                <span className="text-sm font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  {user?.username}
                </div>
                {user?.isAdmin && (
                  <div className="text-spotify-green text-xs font-semibold">
                    Admin
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn btn-ghost text-sm hover-lift"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">🚪</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-spotify-black-lighter/50 border border-gray-700/50 hover:bg-spotify-black-lighter hover:border-spotify-green/30 transition-all duration-300 hover-lift"
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
          <div className="md:hidden py-4 border-t border-gray-700/30 animate-slide-down">
            <div className="flex flex-col space-y-3">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link text-lg px-4 py-3 rounded-xl hover:bg-spotify-black-lighter/50 transition-all duration-300 ${
                  isActive("/dashboard")
                    ? "active bg-spotify-black-lighter/30"
                    : ""
                }`}
              >
                {user?.isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>
              <Link
                to="/songs"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link text-lg px-4 py-3 rounded-xl hover:bg-spotify-black-lighter/50 transition-all duration-300 ${
                  isActive("/songs") ? "active bg-spotify-black-lighter/30" : ""
                }`}
              >
                Songs
              </Link>
              {!user?.isAdmin && (
                <Link
                  to="/playlists"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-link text-lg px-4 py-3 rounded-xl hover:bg-spotify-black-lighter/50 transition-all duration-300 ${
                    isActive("/playlists")
                      ? "active bg-spotify-black-lighter/30"
                      : ""
                  }`}
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
