import React from "react";
import { useNavigate } from "react-router";
import FuzzyText from "./FuzzyText";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center px-4">
      {/* Fuzzy Glitching Error Text */}
      <FuzzyText>
        404
      </FuzzyText>

      <p className="mt-6 text-gray-300 text-lg md:text-xl">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Go Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 text-base md:text-lg font-semibold rounded-2xl 
                   bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg 
                   hover:from-pink-500 hover:to-red-500 transition-all duration-300"
      >
        Go Home
      </button>
    </div>
  );
};

export default Error;
