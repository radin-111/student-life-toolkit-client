import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useLenis, AnimatedPage, AnimatedCard } from "../utils/animations";

export default function AddClassForm() {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Initialize smooth scrolling
  useLenis();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Mutation: add class
  const mutation = useMutation({
    mutationFn: async (newClass) => {
      const res = await axiosSecure.post("/classes", newClass);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]); // refresh list
      reset(); // clear form
      Swal.fire({
        title: "Success!",
        text: "Class added successfully.",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });
      navigate("/dashboard/classes");
    },
    onError: (err) => {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to add class.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  const onSubmit = (data) => {
    data.email = user?.providerData[0]?.email;
    mutation.mutate(data);
  };

  return (
    <AnimatedPage className="max-w-md mx-auto bg-base-100 shadow-lg rounded-2xl p-6 my-6">
      <motion.h2 
        className="text-2xl font-bold text-center mb-6 text-primary"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Add New Class
      </motion.h2>
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Subject */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.label className="label">
            <span className="label-text font-semibold">Subject</span>
          </motion.label>
          <motion.input
            type="text"
            {...register("subject", { required: true })}
            placeholder="Enter subject name"
            className="input input-bordered w-full"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileFocus={{ scale: 1.02 }}
          />
          <AnimatePresence>
            {errors.subject && (
              <motion.p 
                className="text-error text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                Subject is required
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Date & Time */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.label className="label">
            <span className="label-text font-semibold">Date & Time</span>
          </motion.label>
          <motion.input
            type="datetime-local"
            {...register("datetime", { required: true })}
            className="input input-bordered w-full"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileFocus={{ scale: 1.02 }}
          />
          <AnimatePresence>
            {errors.datetime && (
              <motion.p 
                className="text-error text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                Date and time are required
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructor */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.label className="label">
            <span className="label-text font-semibold">Instructor</span>
          </motion.label>
          <motion.input
            type="text"
            {...register("instructor", { required: true })}
            placeholder="Enter instructor name"
            className="input input-bordered w-full"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileFocus={{ scale: 1.02 }}
          />
          <AnimatePresence>
            {errors.instructor && (
              <motion.p 
                className="text-error text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                Instructor is required
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Color */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.label className="label">
            <span className="label-text font-semibold">Color Label</span>
          </motion.label>
          <motion.select
            {...register("color", { required: true })}
            className="select select-bordered w-full"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.0 }}
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Pick a color</option>
            <option value="red-500">Red</option>
            <option value="blue-500">Blue</option>
            <option value="green-500">Green</option>
            <option value="yellow-400">Yellow</option>
            <option value="purple-500">Purple</option>
            <option value="pink-500">Pink</option>
            <option value="indigo-500">Indigo</option>
            <option value="orange-500">Orange</option>
            <option value="teal-500">Teal</option>
            <option value="lime-500">Lime</option>
          </motion.select>
          <AnimatePresence>
            {errors.color && (
              <motion.p 
                className="text-error text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                Color is required
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          className="btn btn-primary w-full mt-4 rounded-xl"
          disabled={mutation.isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {mutation.isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-block", marginRight: "8px" }}
            >
              ⏳
            </motion.div>
          ) : null}
          {mutation.isLoading ? "Adding..." : "Add Class"}
        </motion.button>
      </motion.form>
    </AnimatedPage>
  );
}
