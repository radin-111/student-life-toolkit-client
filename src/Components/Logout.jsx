import React from "react";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Logout = ({ btn }) => {
  const { handleLogout } = useAuth();
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
    <button className={`btn btn-outline ${btn} rounded-2xl`} onClick={logout}>
      Logout
    </button>
  );
};

export default Logout;
