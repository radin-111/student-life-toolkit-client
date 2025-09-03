import React from "react";
import { useQuery } from "@tanstack/react-query";
import { startOfWeek, format } from "date-fns";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const ProgressDashboard = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const email = user?.email || user?.providerData?.[0]?.email;

  // Get the start of the week (Sunday)
  const weekStart = format(
    startOfWeek(new Date(), { weekStartsOn: 0 }),
    "yyyy-MM-dd"
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["weekly-progress", weekStart, email],
    queryFn: async () => {
      if (!email) throw new Error("User email not found");
      const res = await axiosSecure.get(
        `/stats/weekly?start=${weekStart}&email=${email}`
      );
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

  if (isError || !data) {
    return (
      <div className="text-red-500 text-center">Failed to load progress.</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Weekly Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Tasks Done */}
        <div className="stats shadow bg-base-200 rounded-xl p-4">
          <div className="stat-title">Tasks Done</div>
          <div className="stat-value text-success">{data.done ?? 0}</div>
          <div className="stat-desc">Out of {data.total ?? 0}</div>
        </div>

        {/* Tasks In Progress */}
        <div className="stats shadow bg-base-200 rounded-xl p-4">
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-info">{data.inProgress ?? 0}</div>
          <div className="stat-desc">Tasks ongoing</div>
        </div>

        {/* Completion Rate */}
        <div className="stats shadow bg-base-200 rounded-xl p-4">
          <div className="stat-title">Completion Rate</div>
          <div className="stat-value text-primary">{data.percent ?? 0}%</div>
          <div className="stat-desc">This week's goal</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <progress
          className="progress progress-primary w-full h-6"
          value={data.percent ?? 0}
          max="100"
        />
      </div>
    </div>
  );
};

export default ProgressDashboard;
