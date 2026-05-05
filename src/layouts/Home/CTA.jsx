import React, { useEffect, useRef } from 'react';
import { FaRocket, FaSignInAlt, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";
import { motion } from 'framer-motion';
import { useTheme } from "../../Context/ThemeContext";
import GradientText from "../../Components/GradientText";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const { isDarkMode } = useTheme();
  const ctaRef = useRef(null);
  const benefitsRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Benefits stagger animation on scroll
      if (benefitsRef.current) {
        gsap.fromTo(benefitsRef.current.children,
          {
            opacity: 0,
            y: 40,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: benefitsRef.current,
              start: "top 85%",
              once: true
            }
          }
        );
      }

      // Buttons animation on scroll
      if (buttonsRef.current) {
        gsap.fromTo(buttonsRef.current.children,
          {
            opacity: 0,
            y: 30,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: buttonsRef.current,
              start: "top 90%",
              once: true
            }
          }
        );
      }
    }, ctaRef);

    return () => ctx.revert();
  }, []);
  return (
    <motion.section 
      ref={ctaRef}
      className={`relative py-24 text-center overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-base-200' : 'bg-base-200'
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-24 h-24 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-900/10 to-pink-900/10' 
                : 'bg-gradient-to-r from-primary/5 to-secondary/5'
            }`}
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 25}%`,
              top: `${10 + i * 20}%`,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Headline */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <GradientText>
              <h1 className="text-5xl font-bold">Take Control of Your Student Journey</h1>
          </GradientText>
        </motion.div>
        <br />

        {/* Supporting text */}
        <motion.p 
          className={`text-lg mb-12 transition-colors duration-300 ${
            isDarkMode ? 'text-base-content/80' : 'text-gray-600'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Manage your <b>classes</b>, track <b>budget</b>, plan <b>studies</b>,
          and prep for <b>exams</b> — all in one place. Start today and make
          studying easier, smarter, and stress-free.
        </motion.p>

        {/* Quick Benefits */}
        <div 
          ref={benefitsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: FaCheckCircle, color: "primary", text: "Organize Classes" },
            { icon: FaCheckCircle, color: "secondary", text: "Track Budget" },
            { icon: FaCheckCircle, color: "accent", text: "Boost Productivity" }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-center gap-3 p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-base-100 hover:bg-base-300' 
                  : 'bg-base-200 hover:bg-base-100'
              }`}
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: isDarkMode
                  ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                  : "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                <benefit.icon className={`text-2xl transition-colors duration-300 ${
                isDarkMode ? 'text-purple-400' : `text-${benefit.color}`
              }`} />
              </motion.div>
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-base-content' : 'text-base-content'
              }`}>{benefit.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div 
          ref={buttonsRef}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/register"
              className={`btn btn-lg px-10 rounded-2xl flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500' 
                  : 'bg-gradient-to-r from-primary to-secondary text-white'
              }`}
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaRocket />
              </motion.div>
              Get Started Free
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/login"
              className={`btn btn-lg px-10 rounded-2xl flex items-center gap-3 font-semibold shadow-sm hover:shadow-md transition-all duration-300 ${
                isDarkMode 
                  ? 'border-purple-600 text-purple-400 hover:bg-base-300' 
                  : 'border-gray-400 text-base-content hover:bg-base-100'
              } border`}
            >
              <FaSignInAlt /> Login
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
