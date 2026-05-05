import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaGoogle,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaCamera,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";
import Social from "../../Components/Social";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../Context/ThemeContext";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user, handleSignUp } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isFocused, setIsFocused] = useState(null);
  setTimeout(() => {
    if (user) {
      navigate("/");
    }
  }, 1000);
  const onSubmit = (data) => {
    const info = {
      displayName: data.name,
      email: data.email,
      photoURL: preview,
      password: data.password,
    };

    if (!preview) {
      Swal.fire({
        icon: "error",
        title: "Image Required",
        text: "Please upload a profile picture",
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    const details = {
      displayName: info.displayName,
      photoURL: info.photoURL,
    };

    handleSignUp(info.email, info.password)
      .then(() => {
        updateProfile(auth.currentUser, details)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Account Created!",
              text: "Your account has been created successfully!",
              timer: 2000,
              showConfirmButton: false,
              background: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#000000',
            });
          })
          .catch((e) => {
            Swal.fire({
              icon: "error",
              title: "Profile Creation Failed",
              text: e.message,
              confirmButtonText: "Try Again",
              background: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#000000',
            });
          });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Sign Up Failed",
          text: err.message,
          confirmButtonText: "Try Again",
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
        });
      });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const key = import.meta.env.VITE_IMGBB_KEY;
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${key}`,
      formData
    );
    setPreview(res.data.data.display_url);
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
    <div className={`min-h-screen flex items-center py-10 justify-center px-4 transition-all duration-500 ${
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
            Create Account
          </h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Join us today and start your learning journey
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* Name Field */}
          <div>
            <label 
              htmlFor="name" 
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Full Name
            </label>
            <div className="relative">
              <motion.div 
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  isFocused === 'name' 
                    ? isDarkMode ? 'text-purple-400' : 'text-blue-500'
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                <FaUser className="text-lg" />
              </motion.div>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
                onFocus={() => setIsFocused('name')}
                onBlur={() => setIsFocused(null)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  isFocused === 'name'
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
              />
            </div>
            {errors.name && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

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
                <FaEnvelope className="text-lg" />
              </motion.div>
              <input
                type="email"
                id="email"
                placeholder="email@example.com"
                {...register("email", { required: "Email is required" })}
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
              />
            </div>
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.email.message}
              </motion.p>
            )}
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
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                })}
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
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label 
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Profile Picture
            </label>
            <motion.label 
              whileHover={{ scale: 1.02 }}
              className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                isDarkMode 
                  ? 'border-slate-600 hover:border-purple-500 hover:bg-slate-700/30' 
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                {...register("profileImage", { required: "Image is required" })}
                onChange={handleImageChange}
                className="hidden"
              />
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <motion.div 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaCamera className="text-white text-sm" />
                  </motion.div>
                </div>
              ) : (
                <div className={`flex flex-col items-center justify-center transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <FaUpload className="text-3xl mb-2" />
                  <span className="text-sm font-medium">Click to upload photo</span>
                  <span className="text-xs opacity-70">JPG, PNG up to 10MB</span>
                </div>
              )}
            </motion.label>
            {errors.profileImage && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.profileImage.message}
              </motion.p>
            )}
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
              Create Account
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

        {/* Login Link */}
        <motion.p 
          variants={itemVariants}
          className={`text-center text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Already have an account?{' '}
          <Link 
            to="/login" 
            className={`font-semibold transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            Sign in here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
