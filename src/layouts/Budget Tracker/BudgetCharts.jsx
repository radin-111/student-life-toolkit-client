import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip, // for PieChart
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip, // for BarChart
  ResponsiveContainer,
} from "recharts";
import Loading from "../../Components/Loading";
import useAuth from "../../hooks/useAuth";

const COLORS = [
  "#4f46e5",
  "#facc15",
  "#10b981",
  "#f87171",
  "#8b5cf6",
  "#3b82f6",
];

const BudgetCharts = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  // TanStack Query v5
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/transactions?email=${user?.providerData[0]?.email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading></Loading>;

  // Prepare PieChart data (expenses by category)
  const categoryData = Object.values(
    transactions.reduce((acc, t) => {
      if (t.type === "Expense") {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
      }
      return acc;
    }, {})
  );

  // Prepare BarChart data (monthly income vs expense)
  const monthMap = {};
  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!monthMap[month]) monthMap[month] = { month, Income: 0, Expense: 0 };
    monthMap[month][t.type] += t.amount;
  });
  const monthlyData = Object.values(monthMap);

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-xl font-bold mb-2 text-center">
          Spending by Category
        </h3>
        {categoryData.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 mt-8">No expense data</p>
        )}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-xl font-bold mb-2 text-center">
          Monthly Income vs Expenses
        </h3>
        {monthlyData.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip /> {/* BarChart tooltip */}
              <Legend />
              <Bar dataKey="Income" fill="#4f46e5" />
              <Bar dataKey="Expense" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 mt-8">No transaction data</p>
        )}
      </div>
    </div>
  );
};

export default BudgetCharts;
