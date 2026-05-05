import React, { useEffect, useRef } from 'react';
import { FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useTheme } from "../../Context/ThemeContext";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const { isDarkMode } = useTheme();
  const testimonialsRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards stagger animation on scroll
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.children,
          {
            opacity: 0,
            y: 80,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              once: true
            }
          }
        );
      }
    }, testimonialsRef);

    return () => ctx.revert();
  }, []);
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Engineering Student",
      text: "This app keeps my classes, budget, and study planner in sync. It feels like having a personal assistant!",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Computer Science",
      text: "The Pomodoro timer and exam prep tools boosted my productivity massively. I’m scoring higher with less stress!",
      rating: 4,
    },
    {
      name: "Emma Wilson",
      role: "Medical Student",
      text: "I love the AI-powered flashcards and smart insights. Learning feels more efficient and less overwhelming.",
      rating: 5,
    },
    {
      name: "James Patel",
      role: "Business Major",
      text: "The budgeting tracker is a lifesaver. I finally saved enough for my textbooks this semester.",
      rating: 4,
    },
    {
      name: "Lina Zhang",
      role: "Design Student",
      text: "The study planner with Kanban board keeps me organized. I never miss deadlines now!",
      rating: 5,
    },
    {
      name: "Carlos Mendes",
      role: "Law Student",
      text: "The reminders and notifications mean I never miss a lecture or exam again.",
      rating: 5,
    },
    {
      name: "Hannah Lee",
      role: "Psychology Student",
      text: "The wellness tools and motivational quotes really help me stay balanced during exams.",
      rating: 4,
    },
    {
      name: "Aarav Singh",
      role: "Data Science",
      text: "The AI-generated questions from my notes feel like practicing real exams. Super useful!",
      rating: 5,
    },
    {
      name: "Nora Ali",
      role: "Architecture Student",
      text: "Beautiful UI, easy to use, and packed with everything a student could ask for.",
      rating: 5,
    },
  ];

  return (
    <motion.section
      ref={testimonialsRef}
      id="reviews"
      className={`py-20 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-base-300 to-base-200' 
          : 'bg-gradient-to-b from-base-100 to-base-200'
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
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
        What Students Say
      </motion.h2>
      <div 
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-6"
      >
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            className={`relative card shadow-xl p-6 rounded-xl overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-base-100 border-base-300' 
                : 'bg-base-100 border-gray-200'
            } border`}
            whileHover={{ 
              y: -8,
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Gradient border effect */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-transparent 
                            bg-gradient-to-r from-primary to-secondary opacity-0 
                            hover:opacity-100 transition duration-500 pointer-events-none"
              whileHover={{ opacity: 1 }}
            />

            <motion.div
              className="absolute top-4 left-4"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear",
                delay: index * 2
              }}
            >
              <FaQuoteLeft className={`text-3xl opacity-20 ${
                isDarkMode ? 'text-purple-400' : 'text-primary'
              }`} />
            </motion.div>
            
            <p className={`mb-6 italic relative z-10 ${
              isDarkMode ? 'text-base-content/80' : 'text-gray-700'
            }`}>
              "{t.text}"
            </p>

            <div className={`flex items-center gap-3 mt-auto pt-4 border-t relative z-10 ${
              isDarkMode ? 'border-base-300' : 'border-gray-200'
            }`}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <FaUserCircle className={`text-4xl ${
                  isDarkMode ? 'text-purple-400' : 'text-primary'
                }`} />
              </motion.div>
              <div>
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-base-content' : 'text-base-content'
                }`}>{t.name}</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-base-content/60' : 'text-gray-500'
                }`}>{t.role}</p>
                <div className="flex text-yellow-500 mt-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.3 + i * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      viewport={{ once: true }}
                    >
                      <FaStar />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
