import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import KanbanBoard from "./KanbanBoard";
import ProgressDashboard from "./ProgressDashboard";
import CalendarView from "./CalendarView";
import AddTaskForm from "./AddTaskForm";
import { useLenis, AnimatedPage } from "../../utils/animations";

const StudyPlanner = () => {
  const [activeTab, setActiveTab] = useState("add");

  // Initialize smooth scrolling
  useLenis();

  const tabs = [
    { id: "add", label: "➕ Add Task", icon: "➕" },
    { id: "kanban", label: "📌 Kanban Board", icon: "📌" },
    { id: "progress", label: "📈 Progress", icon: "📈" },
    { id: "calendar", label: "📅 Calendar", icon: "📅" },
  ];

  return (
    <AnimatedPage className="p-6">
      <motion.h1 
        className="text-2xl font-bold mb-6 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        📚 Study Planner Dashboard
      </motion.h1>

      {/* Tabs */}
      <motion.div 
        className="tabs tabs-boxed justify-center mb-6 gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            className={`btn ${
              activeTab === tab.id ? "btn-primary" : "btn-soft btn-primary"
            }`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div 
        className="bg-base-100 p-4 rounded-xl shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "add" && (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <AddTaskForm />
            </motion.div>
          )}
          {activeTab === "kanban" && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <KanbanBoard />
            </motion.div>
          )}
          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <ProgressDashboard />
            </motion.div>
          )}
          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <CalendarView />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatedPage>
  );
};

export default StudyPlanner;
