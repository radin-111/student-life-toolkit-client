import React from "react";
import { NavLink, Outlet } from "react-router";
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

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Top bar with menu icon */}
        <div className="p-4 flex items-center justify-between lg:justify-end">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-ghost lg:hidden text-2xl"
          >
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          {/* Add optional top bar content here */}
        </div>

        {/* Actual page content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-3">
          {/* Sidebar content here */}
          <li>
            <div className="flex flex-col items-start">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring-2 ring-offset-2">
                  <img src={user?.providerData[0]?.photoURL} />
                </div>
              </div>
              <p className="font-medium text-[1rem]">
                {user?.providerData[0]?.displayName}
              </p>
            </div>
          </li>

          <li>
            <NavLink
              to={"/"}
              className="flex items-center gap-2"
            >
              <FiHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/dashboard/classes"}
              className="flex items-center gap-2"
            >
              <FiBook /> Classes
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/dashboard/budget_tracker"}
              className="flex items-center gap-2"
            >
              <FiDollarSign /> Budget Tracker
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/dashboard/exam_qa_generator"}
              className="flex items-center gap-2"
            >
              <FiEdit /> Exam Q&A Generator
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/dashboard/study_planner"}
              className="flex items-center gap-2"
            >
              <FiCalendar /> Study Planner
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/dashboard/timer"}
              className="flex items-center gap-2"
            >
              <FiClock /> Timer
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/dashboard/assistant"}
              className="flex items-center gap-2"
            >
              <FiCpu /> AI Assistant
            </NavLink>
          </li>
          <li className="mt-10">  
            <Logout btn={"btn-error"}></Logout>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
