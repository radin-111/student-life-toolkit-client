import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Transaction</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <input
          type="email"
          value={user?.providerData[0]?.email}
          readOnly
          {...register("email", { required: "Email is required" })}
          className="input input-bordered w-full"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        {/* Type */}
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
          <span className="text-red-500 text-sm">{errors.type.message}</span>
        )}

        {/* Category */}
        <input
          type="text"
          placeholder="Category (e.g., Food, Rent)"
          {...register("category", { required: "Category is required" })}
          className="input input-bordered w-full"
        />
        {errors.category && (
          <span className="text-red-500 text-sm">
            {errors.category.message}
          </span>
        )}

        {/* Amount */}
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          {...register("amount", { required: "Amount is required" })}
          className="input input-bordered w-full"
        />
        {errors.amount && (
          <span className="text-red-500 text-sm">{errors.amount.message}</span>
        )}

        {/* Date */}
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          className="input input-bordered w-full"
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.date && (
          <span className="text-red-500 text-sm">{errors.date.message}</span>
        )}

        {/* Notes */}
        <textarea
          placeholder="Notes (optional)"
          {...register("notes")}
          className="textarea textarea-bordered w-full"
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary mt-2 w-full"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
