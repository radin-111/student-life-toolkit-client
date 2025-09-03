import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const AddTaskForm = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const email = user?.email || user?.providerData?.[0]?.email;

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    priority: "medium",
    dueDate: "",
    topic: "",
    scheduledAt: "",
    durationMinutes: 60,
  });

  // Mutation to create a task
  const { mutate, isLoading } = useMutation({
    mutationFn: async (newTask) => {
      if (!email) throw new Error("User email not found");

      // Prepare task object: remove empty strings and convert date fields
      const taskWithEmail = {
        title: newTask.title,
        subject: newTask.subject,
        topic: newTask.topic || "",
        priority: newTask.priority || "medium",
        status: "todo",
        deadline: newTask.dueDate ? new Date(newTask.dueDate) : null,
        scheduledAt: newTask.scheduledAt ? new Date(newTask.scheduledAt) : null,
        durationMinutes: newTask.durationMinutes || 60,
        email,
      };

      const res = await axiosSecure.post("/tasks", taskWithEmail);
      return res.data;
    },
    onSuccess: () => {
      // Refetch tasks
      queryClient.invalidateQueries(["tasks"]);

      // Reset form fields
      setFormData({ title: "", subject: "", priority: "medium", dueDate: "" });

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Task Added",
        text: "Your task has been added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Something went wrong!",
      });
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert("User email not found.");
    mutate(formData);
  };

  return (
    <div className="p-4 mb-6 bg-base-200 rounded-xl">
      <h2 className="text-lg font-bold mb-3">Add New Task</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        {/* Title */}
        <div className="form-control">
          <label className="label">Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            className="input input-bordered w-full"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        {/* Subject */}
        <div className="form-control">
          <label className="label">Subject</label>
          <input
            type="text"
            placeholder="e.g. Math, Physics"
            className="input input-bordered w-full"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            required
          />
        </div>

        {/* Priority */}
        <div className="form-control">
          <label className="label">Priority</label>
          <select
            className="select select-bordered w-full"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="form-control">
          <label className="label">Due Date</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>

        {/* Topic */}
        <div className="form-control">
          <label className="label">Topic (optional)</label>
          <input
            type="text"
            placeholder="Enter topic"
            className="input input-bordered w-full"
            value={formData.topic}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.target.value })
            }
          />
        </div>

        {/* Scheduled At */}
        <div className="form-control">
          <label className="label">Scheduled At (optional)</label>
          <input
            type="datetime-local"
            className="input input-bordered w-full"
            value={formData.scheduledAt}
            onChange={(e) =>
              setFormData({ ...formData, scheduledAt: e.target.value })
            }
          />
        </div>

        {/* Duration */}
        <div className="form-control">
          <label className="label">Duration (minutes)</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                durationMinutes: Number(e.target.value),
              })
            }
            min={1}
          />
        </div>

        <div className="form-control md:col-span-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Add Task"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
