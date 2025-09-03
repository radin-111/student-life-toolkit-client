import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const TaskList = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const email = user?.email || user?.providerData?.[0]?.email;

  // Fetch tasks for the logged-in user
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", email],
    queryFn: async () => {
      if (!email) throw new Error("User email not found");
      const res = await axiosSecure.get(`/tasks?email=${email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">Failed to load tasks.</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={task._id}>
                <td>{idx + 1}</td>
                <td>{task.title}</td>
                <td>{task.subject}</td>
                <td>
                  <span
                    className={`badge ${
                      task.priority === "high"
                        ? "badge-error"
                        : task.priority === "medium"
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      task.status === "done"
                        ? "badge-success"
                        : task.status === "inprogress"
                        ? "badge-info"
                        : "badge-neutral"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
