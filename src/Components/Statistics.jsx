import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import {
  FaWallet,
  FaChartPie,
  FaTasks,
  FaChalkboardTeacher,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import useAuth from "../hooks/useAuth";

const Statistics = () => {
  const axios = useAxios();
  const { user } = useAuth();
  const email = user?.providerData[0]?.email;

  // ---- Fetch Overview ----
  const { data: stats = {}, isLoading: loadingStats } = useQuery({
    queryKey: ["stats-overview", email],
    queryFn: async () => {
      const res = await axios.get(`/stats/overview?email=${email}`);
      return res.data;
    },
    enabled: !!email,
  });

  // ---- Fetch Expense Breakdown ----
  const { data: expenseByCategory = [], isLoading: loadingExpense } = useQuery({
    queryKey: ["stats-expense", email],
    queryFn: async () => {
      const res = await axios.get(`/stats/expense-by-category?email=${email}`);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!email,
  });

  // ---- Fetch Classes ----
  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ["stats-classes", email],
    queryFn: async () => {
      const res = await axios.get(`/classes?email=${email}`);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!email,
  });

  if (loadingStats || loadingExpense || loadingClasses) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-6">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
        📊 Statistics Dashboard
      </h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
          <FaWallet className="text-4xl text-green-500" />
          <div>
            <h4 className="text-lg font-semibold">Transactions</h4>
            <p className="text-2xl font-bold">{stats.totalTransactions || 0}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
          <FaChartPie className="text-4xl text-blue-500" />
          <div>
            <h4 className="text-lg font-semibold">Classes</h4>
            <p className="text-2xl font-bold">{stats.totalClasses || 0}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
          <FaTasks className="text-4xl text-purple-500" />
          <div>
            <h4 className="text-lg font-semibold">Tasks</h4>
            <p className="text-2xl font-bold">{stats.totalTasks || 0}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
          <FaChalkboardTeacher className="text-4xl text-orange-500" />
          <div>
            <h4 className="text-lg font-semibold">Income vs Expense</h4>
            <p className="text-md">
              {stats.income || 0} 💰 / {stats.expense || 0} 💸
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Income vs Expense Pie */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Income", value: stats.income || 0 },
                  { name: "Expense", value: stats.expense || 0 },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                <Cell fill="#00C49F" />
                <Cell fill="#FF6B6B" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Expense by Category</h3>
          {expenseByCategory.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#845EC2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No expense data available.</p>
          )}
        </div>
      </div>

      {/* Class Stats */}
      <div className="bg-white shadow rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">My Classes</h3>
        {classes.length ? (
          <ul className="divide-y">
            {classes.map((cls) => (
              <li
                key={cls._id}
                className="py-3 flex justify-between items-center"
              >
                <span className="font-medium">
                  {cls.subject || "Untitled Class"}
                </span>
                <span className="text-sm text-gray-500">
                  {cls.instructor || "General"} • {cls.datetime || "N/A"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No classes available.</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
