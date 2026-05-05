import React from "react";
import { motion } from "framer-motion";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import BudgetCharts from "./BudgetCharts";
import { useLenis, AnimatedPage } from "../../utils/animations";

const BudgetDashboard = () => {
  // Initialize smooth scrolling
  useLenis();

  return (
    <AnimatedPage className="bg-base-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <motion.h1 
          className="text-3xl font-bold text-gray-900 text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          💰 Budget Tracker
        </motion.h1>

        {/* Transaction Form */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <TransactionForm />
        </motion.section>

        {/* Charts */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <BudgetCharts />
        </motion.section>

        {/* Transaction List */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <TransactionList />
        </motion.section>
      </div>
    </AnimatedPage>
  );
};

export default BudgetDashboard;
