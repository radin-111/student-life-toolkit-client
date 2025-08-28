import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaGoogle,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaUpload,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Social from "../../Components/Social";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
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
              title: "Profile Created",
              text: "Your account has been created successfully!",
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch((e) => {
            Swal.fire({
              icon: "error",
              title: "Profile Creation Failed",
              text: e.message,
              confirmButtonText: "Try Again",
            });
          });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Sign Up Failed",
          text: err.message,
          confirmButtonText: "Try Again",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-6 ">Register</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                })}
                className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-primary"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Improved Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Picture
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FaUpload className="text-2xl mb-1" />
                  <span className="text-sm">Click to upload</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                {...register("profileImage", { required: "Image is required" })}
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {errors.profileImage && (
              <p className="text-error text-sm mt-1">
                {errors.profileImage.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex flex-col space-y-3 mb-2">
          <Social></Social>
        </div>

        {/* Login Link */}
        <Link
          to="/login"
          className="block text-sm text-center mt-6 text-primary font-medium hover:underline"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}
