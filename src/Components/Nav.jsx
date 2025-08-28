import React from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const Nav = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Logged Out",
              text: "You have been successfully logged out.",
              timer: 2000,
              showConfirmButton: false,
            });

            navigate("/");
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Logout Failed",
              text: error.message,
              confirmButtonText: "Try Again",
            });
          });
      }
    });
  };

  return (
    // https://i.ibb.co.com/s9J7m3XX/image-1.jpg
    <div className="navbar bg-base-100 lg:px-10 shadow-sm">
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
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
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
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        {user && (
          <div className="avatar mr-1 max-sm:mr-2">
            <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring-2 ring-offset-2">
              <img src={user?.providerData[0]?.photoURL} />
            </div>
          </div>
        )}
        {user && (
          <div className="max-sm:hidden font-semibold">
            <h1>{user?.providerData[0]?.displayName}</h1>
          </div>
        )}
        <div>
          {user ? (
            <button
              className="btn btn-error btn-outline rounded-2xl"
              onClick={logout}
            >
              Logout
            </button>
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
