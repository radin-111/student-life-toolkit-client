import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "../../Context/ThemeContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      
      Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent!",
        html: `
          <p class="text-sm">We've sent a password reset link to:</p>
          <p class="font-semibold text-primary">${email}</p>
          <p class="text-sm mt-2">Please check your inbox and follow the instructions.</p>
        `,
        confirmButtonColor: isDarkMode ? "#8b5cf6" : "#3b82f6",
        confirmButtonText: "Got it!",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      let errorMessage = "Failed to send password reset email";
      
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-base-300' : 'bg-base-200'
    }`}>
      <div className={`w-full max-w-md rounded-2xl shadow-lg p-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-base-200' : 'bg-white'
      }`}>
        {/* Back to Login */}
        <Link 
          to="/login" 
          className={`inline-flex items-center gap-2 mb-6 text-sm font-medium transition-colors duration-300 ${
            isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-primary hover:underline'
          }`}
        >
          <FaArrowLeft />
          Back to Login
        </Link>

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-purple-900/30' : 'bg-primary/10'
          }`}>
            <FaEnvelope className={`text-2xl ${isDarkMode ? 'text-purple-400' : 'text-primary'}`} />
          </div>
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-base-content' : 'text-gray-900'
          }`}>
            Reset Password
          </h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-base-content/70' : 'text-gray-600'
          }`}>
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleResetPassword}>
          {/* Email */}
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-base-content' : 'text-gray-700'
              }`}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-base-300 border-base-300 text-base-content focus:ring-purple-500 focus:border-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary focus:border-primary'
              }`}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:opacity-90 transform hover:scale-105'
            } ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-primary text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className={`mt-6 text-center text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-base-content/60' : 'text-gray-500'
        }`}>
          <p>Remember your password?</p>
          <Link 
            to="/login" 
            className={`font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-primary hover:underline'
            }`}
          >
            Sign in here
          </Link>
        </div>

        <ToastContainer 
          position="top-right"
          theme={isDarkMode ? "dark" : "light"}
        />
      </div>
    </div>
  );
}
