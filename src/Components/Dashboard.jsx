import React, { useEffect, useRef } from "react";
import { Link, NavLink, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import {
  FiBook,
  FiCalendar,
  FiClock,
  FiCpu,
  FiDollarSign,
  FiEdit,
  FiHome,
} from "react-icons/fi";
import Logout from "./Logout";
import { FaCode, FaFileAlt } from "react-icons/fa";
import { RxActivityLog } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis, animateSidebar, slideInLeft, cardVariants } from "../utils/animations";
const Dashboard = () => {
  const { user } = useAuth();
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  // Initialize smooth scrolling
  useLenis();

  // Animate sidebar on mount
  useEffect(() => {
    if (sidebarRef.current) {
      animateSidebar(sidebarRef, true);
    }
  }, []);

  const navItems = [
    { to: "/", icon: <FiHome />, label: "Home" },
    { to: "/dashboard/classes", icon: <FiBook />, label: "Classes" },
    { to: "/dashboard/budget_tracker", icon: <FiDollarSign />, label: "Budget Tracker" },
    { to: "/dashboard/exam_qa_generator", icon: <FiEdit />, label: "Exam Q&A Generator" },
    { to: "/dashboard/study_planner", icon: <FiCalendar />, label: "Study Planner" },
    { to: "/dashboard/timer", icon: <FiClock />, label: "Timer" },
    { to: "/dashboard/assistant", icon: <FiCpu />, label: "AI Assistant" },
    { to: "/dashboard/summarizer", icon: <FaFileAlt />, label: "Summarizer" },
    { to: "/dashboard/coder", icon: <FaCode />, label: "AI Coder" },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <motion.div 
        ref={contentRef}
        className="drawer-content flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top bar with menu icon */}
        <motion.div 
          className="p-4 flex items-center justify-between lg:justify-end"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label
            htmlFor="my-drawer-2"
            className="btn btn-ghost lg:hidden text-2xl hover:scale-110 transition-transform"
          >
            {/* Hamburger Icon */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </motion.svg>
          </label>
        </motion.div>

        {/* Actual page content */}
        <motion.div 
          className="p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Sidebar */}
      <motion.div 
        ref={sidebarRef}
        className="drawer-side"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-3">
          {/* User Profile Section */}
          <motion.li 
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="flex flex-col items-start"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="avatar"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring-2 ring-offset-2">
                  <img src={user?.providerData[0]?.photoURL} alt="User avatar" />
                </div>
              </motion.div>
              <p className="font-medium text-[1rem] mt-2">
                {user?.providerData[0]?.displayName}
              </p>
            </motion.div>
          </motion.li>

          {/* Navigation Items */}
          {navItems.map((item, index) => (
            <motion.li
              key={item.to}
              variants={slideInLeft}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 transition-all duration-300 ${
                    isActive 
                      ? "bg-primary text-white rounded-lg" 
                      : "hover:bg-base-300 rounded-lg"
                  }`
                }
              >
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.icon}
                </motion.span>
                <span>{item.label}</span>
              </NavLink>
            </motion.li>
          ))}

          {/* Overview Button */}
          <motion.li
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.8 }}
          >
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <RxActivityLog />
              </motion.div>
              <span>Overview</span>
            </Link>
          </motion.li>

          {/* Logout Button */}
          <motion.li 
            className="mt-10"
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.9 }}
          >
            <Logout btn={"btn-error"} />
          </motion.li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Dashboard;
