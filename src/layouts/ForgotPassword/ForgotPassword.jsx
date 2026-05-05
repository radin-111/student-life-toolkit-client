import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "../../Context/ThemeContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEnvelope, 
  FaArrowLeft, 
  FaPaperPlane, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";

export default function ForgotPassword() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      
      Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent!",
        html: `
          <div class="text-center">
            <div class="mb-4">
              <i class="fas fa-envelope text-4xl text-blue-500 mb-2"></i>
            </div>
            <p class="text-sm mb-2">We've sent a password reset link to:</p>
            <p class="font-semibold text-blue-600 text-lg">${email}</p>
            <p class="text-sm mt-2 text-gray-600">Please check your inbox and follow the instructions.</p>
          </div>
        `,
        confirmButtonColor: isDarkMode ? "#8b5cf6" : "#3b82f6",
        confirmButtonText: "Got it!",
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      }).then(() => {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
        {/* Back to Login */}
        <motion.div 
          variants={itemVariants}
          className="mb-6"
        >
          <Link 
            to="/login" 
            className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            <FaArrowLeft className="text-sm" />
            Back to Login
          </Link>
        </motion.div>

        {/* Logo / Icon */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
          }`}>
            <FaEnvelope className="text-2xl text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {emailSent ? 'Check Your Email' : 'Reset Password'}
          </h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {emailSent 
              ? 'We\'ve sent you instructions to reset your password'
              : 'Enter your email address and we\'ll send you a link to reset your password'
            }
          </p>
        </motion.div>

        {!emailSent ? (
          /* Reset Form */
          <motion.form 
            variants={itemVariants}
            onSubmit={handleResetPassword} 
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
                  <FaEnvelope className="text-lg" />
                </motion.div>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
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
                <AnimatePresence mode="wait">
                  {email && (
                    <motion.div
                      key="clear"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-400 hover:text-blue-500'
                      }`}
                      onClick={() => setEmail('')}
                    >
                      <FaExclamationTriangle className="text-sm" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:shadow-lg ${
                loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105'
              } ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/25' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white shadow-blue-500/25'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <FaPaperPlane className="text-sm" />
                  </>
                )}
              </span>
            </motion.button>
          </motion.form>
        ) : (
          /* Success Message */
          <motion.div 
            variants={successVariants}
            className="text-center space-y-4"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-green-900/30 border-2 border-green-600' 
                : 'bg-green-100 border-2 border-green-500'
            }`}>
              <FaCheckCircle className={`text-4xl ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <div className={`space-y-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <h3 className={`font-semibold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Email Sent Successfully!
              </h3>
              <p className="text-sm">
                Check your inbox at <span className={`font-semibold ${
                  isDarkMode ? 'text-purple-400' : 'text-blue-600'
                }`}>{email}</span>
              </p>
              <p className="text-xs opacity-75">
                If you don't see the email, check your spam folder.
              </p>
            </div>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div 
          variants={itemVariants}
          className={`text-center text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <p>Remember your password?</p>
          <Link 
            to="/login" 
            className={`font-semibold transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            Sign in here
          </Link>
        </motion.div>

        <ToastContainer 
          position="top-right"
          theme={isDarkMode ? "dark" : "light"}
        />
      </motion.div>
    </div>
  );
}
