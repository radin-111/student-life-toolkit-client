import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white min-h-screen flex items-center">
      <div className="container mx-auto px-6 text-center flex flex-col items-center justify-center gap-6">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl"
        >
          Balance Your <span className="text-yellow-300">Academics & Life</span>
        </motion.h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-100 max-w-2xl">
          Manage classes, budget smartly, plan studies, prep for exams, and
          boost productivity—all in one app.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          {!user && (
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
            >
              Get Started Free
            </button>
          )}
          <button className="px-6 py-3 rounded-2xl border border-white font-semibold hover:bg-white hover:text-indigo-600 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
