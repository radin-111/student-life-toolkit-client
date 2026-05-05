import React, { useState } from "react";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import Social from "../../Components/Social";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../Context/ThemeContext";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const { user, handleLogin } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  setTimeout(() => {
    if (user) {
      navigate("/");
    }
  }, 1000);
  const login = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    handleLogin(email, password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Authenticated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-base-300' : 'bg-base-200'
    }`}>
      <div className={`w-full max-w-md rounded-2xl shadow-lg p-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-base-200' : 'bg-white'
      }`}>
        {/* Logo / Heading */}
        <h2 className={`text-3xl font-bold text-center mb-6 transition-colors duration-300 ${
          isDarkMode ? 'text-base-content' : 'text-gray-900'
        }`}>Login</h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={login}>
          {/* Email */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-base-content' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-base-300 border-base-300 text-base-content focus:ring-purple-500 focus:border-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary focus:border-primary'
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-base-content' : 'text-gray-700'
              }`}
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-base-300 border-base-300 text-base-content focus:ring-purple-500 focus:border-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary focus:border-primary'
              }`}
              required
            />
            <span
              className={`absolute right-3 top-9 cursor-pointer transition-colors duration-300 ${
                isDarkMode ? 'text-base-content/50' : 'text-gray-500'
              }`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Forgot Password + Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className={`flex items-center gap-2 transition-colors duration-300 ${
              isDarkMode ? 'text-base-content' : 'text-gray-700'
            }`}>
              <input type="checkbox" className="checkbox checkbox-sm" />
              Remember me
            </label>
            <Link 
              to="/forgot-password" 
              className={`transition-colors duration-300 ${
                isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-primary hover:underline'
              }`}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90 transform hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-primary text-white'
            }`}
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className={`flex-grow border-t transition-colors duration-300 ${
            isDarkMode ? 'border-base-300' : 'border-gray-300'
          }`} />
          <span className={`px-3 text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-base-content/50' : 'text-gray-500'
          }`}>OR</span>
          <hr className={`flex-grow border-t transition-colors duration-300 ${
            isDarkMode ? 'border-base-300' : 'border-gray-300'
          }`} />
        </div>

        {/* Social Login */}
        <Social></Social>

        {/* Register Link */}
        <Link
          to="/register"
          className={`text-sm text-center mt-6 font-medium transition-colors duration-300 ${
            isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-primary hover:underline'
          }`}
        >
          Don't have an account? Sign up
        </Link>
      </div>
      <ToastContainer 
        position="top-right"
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}
