import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { AnimatedCard } from "../../utils/animations";

const TransactionForm = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Latest TanStack Query v5 mutation
  const mutation = useMutation({
    mutationFn: (data) => axiosSecure.post("/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      Swal.fire("Success!", "Transaction added successfully", "success");
      reset();
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong", "error");
    },
  });

  const onSubmit = (data) => {
    data.amount = parseFloat(data.amount);
    mutation.mutate(data);
  };

  return (
    <AnimatedCard className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <motion.h2 
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Add Transaction
      </motion.h2>
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Email */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="email"
            value={user?.providerData[0]?.email}
            readOnly
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <motion.span 
              className="text-red-500 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.email.message}
            </motion.span>
          )}
        </motion.div>

        {/* Type */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <select
            {...register("type", { required: "Transaction type is required" })}
            className="select select-bordered w-full"
            defaultValue=""
          >
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          {errors.type && (
            <motion.span 
              className="text-red-500 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.type.message}
            </motion.span>
          )}
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            placeholder="Category (e.g., Food, Rent)"
            {...register("category", { required: "Category is required" })}
            className="input input-bordered w-full"
          />
          {errors.category && (
            <motion.span 
              className="text-red-500 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.category.message}
            </motion.span>
          )}
        </motion.div>

        {/* Amount */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            {...register("amount", { required: "Amount is required" })}
            className="input input-bordered w-full"
          />
          {errors.amount && (
            <motion.span 
              className="text-red-500 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.amount.message}
            </motion.span>
          )}
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="input input-bordered w-full"
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.date && (
            <motion.span 
              className="text-red-500 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.date.message}
            </motion.span>
          )}
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <textarea
            placeholder="Notes (optional)"
            {...register("notes")}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="btn btn-primary mt-2 w-full"
          disabled={mutation.isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {mutation.isLoading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              Adding...
            </motion.span>
          ) : (
            "Add Transaction"
          )}
        </motion.button>
      </motion.form>
    </AnimatedCard>
  );
};

export default TransactionForm;
