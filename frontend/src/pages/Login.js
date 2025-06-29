import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, reset } from "../store/slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
      setIsSubmitting(false);
    }

    if (isSuccess || user) {
      navigate("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userData = {
      email,
      password,
    };
    await dispatch(login(userData));
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
            Logging you in...
          </h2>
          <p className="text-spotify-gray">Preparing your music experience</p>
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
            Welcome Back
          </h1>
          <p className="text-spotify-gray text-lg">
            Sign in to your music world
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  placeholder="Enter your email"
                  onChange={handleChange}
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="input pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-spotify-gray hover:text-white transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {isError && (
              <div className="toast-error rounded-xl p-4 animate-slide-in">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-red-200 font-medium">Login Failed</p>
                    <p className="text-red-300 text-sm">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full py-4 px-6 text-lg font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-3"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
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

          {/* Register Link */}
          <div className="text-center">
            <p className="text-spotify-gray mb-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-spotify-green hover:text-spotify-green-light font-semibold transition-colors hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-spotify-gray text-sm">
            Experience music like never before
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

export default Login;
