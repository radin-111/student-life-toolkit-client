import React, { useRef, useEffect } from "react";
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
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { 
  useLenis, 
  AnimatedPage, 
  AnimatedCard, 
  AnimatedContainer,
  animateChart,
  useScrollAnimation 
} from "../utils/animations";

const Statistics = () => {
  const axios = useAxios();
  const { user } = useAuth();
  const email = user?.providerData[0]?.email;
  
  // Refs for animations
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const cardsRef = useRef(null);

  // Initialize smooth scrolling
  useLenis();

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

  // Animate charts when data is loaded
  useEffect(() => {
    if (!loadingStats && pieChartRef.current) {
      animateChart(pieChartRef);
    }
    if (!loadingExpense && barChartRef.current) {
      animateChart(barChartRef);
    }
  }, [loadingStats, loadingExpense]);

  // Scroll animations
  useScrollAnimation(cardsRef, {
    start: "top 80%",
    onEnter: () => {
      gsap.from(".stat-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }
  });

  if (loadingStats || loadingExpense || loadingClasses) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="p-6 grid gap-6">
      {/* Header */}
      <motion.h2 
        className="text-2xl md:text-3xl font-bold text-center mb-4"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        📊 Statistics Dashboard
      </motion.h2>

      {/* Overview Cards */}
      <AnimatedContainer ref={cardsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard 
          className="stat-card bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
          delay={0.1}
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaWallet className="text-4xl text-green-500" />
          </motion.div>
          <div>
            <h4 className="text-lg font-semibold">Transactions</h4>
            <motion.p 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {stats.totalTransactions || 0}
            </motion.p>
          </div>
        </AnimatedCard>

        <AnimatedCard 
          className="stat-card bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
          delay={0.2}
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaChartPie className="text-4xl text-blue-500" />
          </motion.div>
          <div>
            <h4 className="text-lg font-semibold">Classes</h4>
            <motion.p 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              {stats.totalClasses || 0}
            </motion.p>
          </div>
        </AnimatedCard>

        <AnimatedCard 
          className="stat-card bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
          delay={0.3}
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaTasks className="text-4xl text-purple-500" />
          </motion.div>
          <div>
            <h4 className="text-lg font-semibold">Tasks</h4>
            <motion.p 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            >
              {stats.totalTasks || 0}
            </motion.p>
          </div>
        </AnimatedCard>

        <AnimatedCard 
          className="stat-card bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
          delay={0.4}
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaChalkboardTeacher className="text-4xl text-orange-500" />
          </motion.div>
          <div>
            <h4 className="text-lg font-semibold">Income vs Expense</h4>
            <motion.p 
              className="text-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {stats.income || 0} 💰 / {stats.expense || 0} 💸
            </motion.p>
          </div>
        </AnimatedCard>
      </AnimatedContainer>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Income vs Expense Pie */}
        <AnimatedCard 
          className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          delay={0.5}
        >
          <motion.h3 
            className="text-xl font-semibold mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Income vs Expenses
          </motion.h3>
          <div ref={pieChartRef}>
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
                  animationBegin={0}
                  animationDuration={1500}
                >
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF6B6B" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* Expense Breakdown */}
        <AnimatedCard 
          className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          delay={0.6}
        >
          <motion.h3 
            className="text-xl font-semibold mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            Expense by Category
          </motion.h3>
          <div ref={barChartRef}>
            {expenseByCategory.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="total" 
                    fill="#845EC2" 
                    radius={[8, 8, 0, 0]}
                    animationBegin={0}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <motion.p 
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                No expense data available.
              </motion.p>
            )}
          </div>
        </AnimatedCard>
      </div>

      {/* Class Stats */}
      <AnimatedCard 
        className="bg-white shadow rounded-2xl p-6 mt-8 hover:shadow-lg transition-all duration-300"
        delay={0.7}
      >
        <motion.h3 
          className="text-xl font-semibold mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          My Classes
        </motion.h3>
        {classes.length ? (
          <motion.ul 
            className="divide-y"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {classes.map((cls, index) => (
              <motion.li
                key={cls._id}
                className="py-3 flex justify-between items-center hover:bg-gray-50 rounded-lg px-2 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <span className="font-medium">
                  {cls.subject || "Untitled Class"}
                </span>
                <span className="text-sm text-gray-500">
                  {cls.instructor || "General"} • {cls.datetime || "N/A"}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.p 
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            No classes available.
          </motion.p>
        )}
      </AnimatedCard>
    </AnimatedPage>
  );
};

export default Statistics;
