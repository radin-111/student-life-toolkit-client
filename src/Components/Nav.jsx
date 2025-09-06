import React from "react";
import { NavLink, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import Logout from "./Logout";
import {
  FiBook,
  FiCalendar,
  FiClock,
  FiCpu,
  FiDollarSign,
  FiEdit,
} from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";

const Nav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const links = (
    <>
      <li>
        <a href={"#features"}>Features</a>
      </li>
      <li>
        <a href={"#reviews"}>Reviews</a>
      </li>
      
    </>
  );

  return (
    // https://i.ibb.co.com/s9J7m3XX/image-1.jpg
    <div className="navbar bg-base-100 lg:px-10 shadow-sm fixed top-0 z-50 ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
           {links}
          </ul>
        </div>
        <div className="flex gap-1 items-center">
          <img
            src="https://i.ibb.co.com/s9J7m3XX/image-1.jpg"
            className="w-[50px] h-[50px] rounded"
            alt=""
          />
          <p className="font-bold italic">HappyLearn</p>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
         {links}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        {user && (
          <div className="max-sm:hidden font-semibold">
            <h1>{user?.providerData[0]?.displayName}</h1>
          </div>
        )}

        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring-2 ring-offset-2">
                <img src={user?.providerData[0]?.photoURL} alt="User Avatar" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow space-y-4"
            >
              <li>
                <NavLink to={"/dashboard"} className="flex items-center gap-2">
                  <MdSpaceDashboard /> DashBoard
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
            </ul>
          </div>
        )}

        <div>
          {user ? (
            <Logout btn={"btn-error"}></Logout>
          ) : (
            <button
              className="btn btn-success btn-outline rounded-2xl"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
