import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const Social = () => {
  const { googleSignIn, githubSignIn } = useAuth();

  const handleGoogleLogin = () => {
    googleSignIn()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Login successful 🎉",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: e.message,
          confirmButtonText: "Try Again",
        });
      });
  };

  const handleGithubSignIn = () => {
    githubSignIn()
      .then((r) => {
        console.log(r.user)
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Login successful 🎉",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: e.message,
          confirmButtonText: "Try Again",
        });
      });
  };
  return (
    <div className="flex flex-col space-y-3">
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition"
      >
        <FcGoogle className="text-red-500 text-lg" />
        Continue with Google
      </button>
      <button onClick={handleGithubSignIn} className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition">
        <FaGithub className="text-gray-800 text-lg" />
        Continue with GitHub
      </button>
    </div>
  );
};

export default Social;
