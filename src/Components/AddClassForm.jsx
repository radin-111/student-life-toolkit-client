import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function AddClassForm() {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      navigate('/dashboard/classes')
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
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 shadow-lg rounded-2xl p-6 my-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Add New Class
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Subject */}
        <div>
          <label className="label">
            <span className="label-text font-semibold">Subject</span>
          </label>
          <input
            type="text"
            {...register("subject", { required: true })}
            placeholder="Enter subject name"
            className="input input-bordered w-full"
          />
          {errors.subject && (
            <p className="text-error text-sm">Subject is required</p>
          )}
        </div>

        {/* Date & Time */}
        <div>
          <label className="label">
            <span className="label-text font-semibold">Date & Time</span>
          </label>
          <input
            type="datetime-local"
            {...register("datetime", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.datetime && (
            <p className="text-error text-sm">Date and time are required</p>
          )}
        </div>

        {/* Instructor */}
        <div>
          <label className="label">
            <span className="label-text font-semibold">Instructor</span>
          </label>
          <input
            type="text"
            {...register("instructor", { required: true })}
            placeholder="Enter instructor name"
            className="input input-bordered w-full"
          />
          {errors.instructor && (
            <p className="text-error text-sm">Instructor is required</p>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="label">
            <span className="label-text font-semibold">Color Label</span>
          </label>
          <select
            {...register("color", { required: true })}
            className="select select-bordered w-full"
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
          </select>
          {errors.color && (
            <p className="text-error text-sm">Color is required</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-full mt-4 rounded-xl"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Adding..." : "Add Class"}
        </button>
      </form>
    </div>
  );
}
