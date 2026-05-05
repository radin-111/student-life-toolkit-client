import React, { useState } from "react";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash, FaUser, FaLock, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isFocused, setIsFocused] = useState(null);

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
          title: "Welcome Back!",
          text: "You've been successfully logged in.",
          showConfirmButton: false,
          timer: 1500,
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
        });
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${
          isDarkMode ? 'bg-purple-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${
          isDarkMode ? 'bg-pink-500' : 'bg-purple-400'
        }`}></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative w-full max-w-md rounded-3xl shadow-2xl p-8 backdrop-blur-lg transition-all duration-500 ${
          isDarkMode 
            ? 'bg-slate-800/90 border border-slate-700' 
            : 'bg-white/90 border border-gray-200'
        }`}
      >
        {/* Logo/Brand */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
          }`}>
            <FaUser className="text-2xl text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back
          </h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to your account to continue
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          variants={itemVariants}
          onSubmit={login} 
          className="space-y-6"
        >
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <motion.div 
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  isFocused === 'email' 
                    ? isDarkMode ? 'text-purple-400' : 'text-blue-500'
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                <FaUser className="text-lg" />
              </motion.div>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  isFocused === 'email'
                    ? isDarkMode 
                      ? 'border-purple-500 bg-slate-700/50 text-white' 
                      : 'border-blue-500 bg-blue-50 text-gray-900'
                    : isDarkMode 
                      ? 'border-slate-600 bg-slate-700/30 text-gray-300' 
                      : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'focus:ring-purple-500/20' 
                    : 'focus:ring-blue-500/20'
                }`}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Password
            </label>
            <div className="relative">
              <motion.div 
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  isFocused === 'password' 
                    ? isDarkMode ? 'text-purple-400' : 'text-blue-500'
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                <FaLock className="text-lg" />
              </motion.div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                onFocus={() => setIsFocused('password')}
                onBlur={() => setIsFocused(null)}
                className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                  isFocused === 'password'
                    ? isDarkMode 
                      ? 'border-purple-500 bg-slate-700/50 text-white' 
                      : 'border-blue-500 bg-blue-50 text-gray-900'
                    : isDarkMode 
                      ? 'border-slate-600 bg-slate-700/30 text-gray-300' 
                      : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'focus:ring-purple-500/20' 
                    : 'focus:ring-blue-500/20'
                }`}
                required
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-400 hover:text-blue-500'
                }`}
              >
                <AnimatePresence mode="wait">
                  {showPassword ? (
                    <motion.div
                      key="hide"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaEyeSlash className="text-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="show"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaEye className="text-lg" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className={`flex items-center gap-3 cursor-pointer transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <input 
                type="checkbox" 
                className={`w-4 h-4 rounded border-2 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500' 
                    : 'border-gray-300 bg-white text-blue-500 focus:ring-blue-500'
                }`} 
              />
              <span className="text-sm">Remember me</span>
            </label>
            <Link 
              to="/forgot-password" 
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-500 hover:text-blue-600'
              }`}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/25' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white shadow-blue-500/25'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              Sign In
              <FaArrowRight className="text-sm" />
            </span>
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center my-8"
        >
          <div className={`flex-grow h-px transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
          }`}></div>
          <span className={`px-4 text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>OR</span>
          <div className={`flex-grow h-px transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
          }`}></div>
        </motion.div>

        {/* Social Login */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Social />
        </motion.div>

        {/* Register Link */}
        <motion.p 
          variants={itemVariants}
          className={`text-center text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className={`font-semibold transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            Sign up here
          </Link>
        </motion.p>
      </motion.div>
      <ToastContainer 
        position="top-right"
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}
