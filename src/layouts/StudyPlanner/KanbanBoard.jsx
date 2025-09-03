import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const KanbanBoard = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const email = user?.email || user?.providerData?.[0]?.email;

  // Fetch tasks for the logged-in user
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", email],
    queryFn: async () => {
      if (!email) return [];
      const res = await axiosSecure.get(`/tasks?email=${email}`);
      return res.data;
    },
  });

  // Mutation to update task status
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/tasks/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks", email]),
  });

  // Mutation to delete task
  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/tasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", email]);
      Swal.fire("Deleted!", "Task has been deleted.", "success");
    },
  });

  const sensors = useSensors(useSensor(PointerSensor));

  // Columns
  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.dataset.status;

    const task = tasks.find((t) => t._id.toString() === taskId);
    if (task && task.status !== newStatus) {
      updateTaskMutation.mutate({ id: taskId, status: newStatus });
    }
  };

  // Task Card Component
  const TaskCard = ({ task }) => (
    <div className="card bg-base-100 shadow-md p-4 mb-4 border border-gray-200 rounded-lg">
      <h4 className="font-semibold text-lg">{task.title}</h4>
      <p className="text-sm opacity-70">
        {task.subject} • Priority: {task.priority}
      </p>
      <div className="mt-3 flex gap-2">
        {task.status !== "done" && (
          <button
            onClick={() =>
              updateTaskMutation.mutate({
                id: task._id.toString(),
                status: "done",
              })
            }
            className="btn btn-xs btn-success"
          >
            Mark Done
          </button>
        )}
        {task.status !== "inprogress" && task.status !== "done" && (
          <button
            onClick={() =>
              updateTaskMutation.mutate({
                id: task._id.toString(),
                status: "inprogress",
              })
            }
            className="btn btn-xs btn-warning"
          >
            In Progress
          </button>
        )}
        {task.status === "todo" && (
          <button
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "This task will be permanently deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  deleteTaskMutation.mutate(task._id.toString());
                }
              });
            }}
            className="btn btn-xs btn-error"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Kanban Board</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([colId, items]) => (
            <div
              key={colId}
              data-status={colId}
              className="bg-base-200 rounded-xl p-4 min-h-[500px] flex flex-col"
            >
              <h3 className="font-bold mb-4 text-center uppercase text-lg">
                {colId}
              </h3>
              {items.map((task) => (
                <div key={task._id.toString()} id={task._id.toString()}>
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
