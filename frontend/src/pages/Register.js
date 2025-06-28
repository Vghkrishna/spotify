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
      <div className="flex flex-col items-center justify-center h-screen bg-spotify-black">
        <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin-slow mb-5"></div>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-spotify-black">
      <div className="bg-spotify-black-light p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-spotify-green mb-2">
            Spotify Clone
          </h1>
          <p className="text-spotify-gray">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {passwordError && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-white font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-spotify-black-lighter border border-spotify-gray rounded-lg text-white placeholder-spotify-gray focus:outline-none focus:border-spotify-green"
              required
              minLength={3}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-white font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-spotify-black-lighter border border-spotify-gray rounded-lg text-white placeholder-spotify-gray focus:outline-none focus:border-spotify-green"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-spotify-black-lighter border border-spotify-gray rounded-lg text-white placeholder-spotify-gray focus:outline-none focus:border-spotify-green"
              required
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-white font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-spotify-black-lighter border border-spotify-gray rounded-lg text-white placeholder-spotify-gray focus:outline-none focus:border-spotify-green"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-spotify-green text-white py-2 px-4 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-spotify-gray">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-spotify-green hover:text-spotify-green-hover"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
