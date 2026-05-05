import React, { useEffect, useRef } from 'react';
import {
  FiCalendar,
  FiPieChart,
  FiEdit3,
  FiCheckSquare,
  FiClock,
  FiMessageSquare,
  FiCode,
  FiFileText,
} from "react-icons/fi";
import { motion } from 'framer-motion';
import { useTheme } from "../../Context/ThemeContext";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const { isDarkMode } = useTheme();
  const featuresRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards entrance animation on scroll
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.children,
          {
            opacity: 0,
            y: 60,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              once: true
            }
          }
        );
      }
    }, featuresRef);

    return () => ctx.revert();
  }, []);
  const features = [
    {
      title: "Class Tracker",
      desc: "Organize your weekly classes with a drag & drop calendar and smart reminders.",
      icon: <FiCalendar className="text-4xl text-blue-500" />,
    },
    {
      title: "Budget Planner",
      desc: "Track income & expenses, visualize spending, and set savings goals easily.",
      icon: <FiPieChart className="text-4xl text-green-500" />,
    },
    {
      title: "Exam Prep",
      desc: "Practice MCQs, true/false, and AI-generated questions from your notes.",
      icon: <FiEdit3 className="text-4xl text-purple-500" />,
    },
    {
      title: "Study Planner",
      desc: "Plan tasks with deadlines, Kanban board, and weekly progress tracking.",
      icon: <FiCheckSquare className="text-4xl text-orange-500" />,
    },
    {
      title: "Productivity Boosters",
      desc: "Stay focused with Pomodoro timer, motivation quotes, and wellness tools.",
      icon: <FiClock className="text-4xl text-pink-500" />,
    },
    {
      title: "Summarizer AI",
      desc: "Paste notes or upload long text and get concise, clear summaries in one click.",
      icon: <FiFileText className="text-4xl text-indigo-500" />,
    },
    {
      title: "AI Assistant",
      desc: "Chat with an intelligent study buddy for quick answers, brainstorming, and guidance.",
      icon: <FiMessageSquare className="text-4xl text-emerald-500" />,
    },
    {
      title: "AI Coder",
      desc: "Generate, debug, and explain code snippets in multiple programming languages.",
      icon: <FiCode className="text-4xl text-red-500" />,
    },
  ];

  return (
    <section 
      ref={featuresRef} 
      className={`py-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-base-300' : 'bg-base-100'
      }`} 
      id="features"
    >
      <motion.h2 
        className={`text-4xl font-bold text-center mb-14 ${
          isDarkMode ? 'text-base-content' : 'text-base-content'
        }`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        Everything You Need in One App
      </motion.h2>
      <div 
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`card shadow-xl p-8 flex flex-col items-center text-center rounded-xl transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-base-200 hover:bg-base-100' 
                : 'bg-base-200 hover:bg-base-100'
            }`}
            whileHover={{ 
              scale: 1.03, 
              y: -5,
              boxShadow: isDarkMode 
                ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className={`text-xl font-semibold mb-2 ${
              isDarkMode ? 'text-base-content' : 'text-base-content'
            }`}>{feature.title}</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-base-content/70' : 'text-gray-600'
            }`}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
