import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register, clearError } from "../store/slices/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    if (user) {
      navigate("/dashboard");
    }
  }, [user, error, navigate]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    // Clear password error when user starts typing
    if (e.target.name === "confirmPassword" || e.target.name === "password") {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    dispatch(clearError()); // Clear any previous errors
    dispatch(register(userData));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-spotify-black-dark to-spotify-black-light relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-spotify-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow animate-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-spotify-green/5 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="loading-spinner mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold gradient-text mb-2">
            Creating your account...
          </h2>
          <p className="text-spotify-gray">Setting up your music experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-spotify-black-dark to-spotify-black-light p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-spotify-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow animate-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-spotify-green/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-spotify-green/3 rounded-full blur-2xl animate-float animate-delay-500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-green-500/3 rounded-full blur-xl animate-float animate-delay-700"></div>
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-spotify rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-spotify animate-float">
            <span className="text-5xl">🎵</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 text-shadow">
            Join the Music
          </h1>
          <p className="text-spotify-gray text-lg">
            Create your account and start your journey
          </p>
        </div>

        {/* Register Form */}
        <div className="card p-8 animate-scale-in">
          {error && (
            <div className="toast-error rounded-xl p-4 mb-6 animate-slide-in">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-red-200 font-medium">
                    Registration Failed
                  </p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {passwordError && (
            <div className="toast-error rounded-xl p-4 mb-6 animate-slide-in">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="text-red-200 font-medium">Password Error</p>
                  <p className="text-red-300 text-sm">{passwordError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-white font-semibold text-sm">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-spotify-gray">👤</span>
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="input pl-12"
                  required
                  minLength={3}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-white font-semibold text-sm">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-spotify-gray">📧</span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input pl-12"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-white font-semibold text-sm">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-spotify-gray">🔒</span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input pl-12"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-white font-semibold text-sm">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-spotify-gray">🔐</span>
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="input pl-12"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-4 px-6 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-3"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-700/50"></div>
            <span className="px-4 text-spotify-gray text-sm font-medium">
              or
            </span>
            <div className="flex-1 border-t border-gray-700/50"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-spotify-gray mb-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-spotify-green hover:text-spotify-green-light font-semibold transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-spotify-gray text-sm">
            Start your musical journey today
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animate-delay-300"></div>
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse animate-delay-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
