import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import useAuth from "../../hooks/useAuth";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on scroll for the entire hero section
      gsap.to(heroRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Animate background particles
      if (particlesRef.current) {
        gsap.fromTo(particlesRef.current.children, 
          { 
            opacity: 0,
            scale: 0
          },
          { 
            opacity: 0.3,
            scale: 1,
            duration: 2,
            stagger: 0.1,
            ease: "power2.out"
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);
  return (
    <section ref={heroRef} className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white min-h-screen flex items-center relative overflow-hidden">
      {/* Animated background particles */}
      <div ref={particlesRef} className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 text-center flex flex-col items-center justify-center gap-6 relative z-10">
        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            ease: "easeOut",
            delay: 0.2
          }}
        >
          Balance Your <span className="text-yellow-300">Academics & Life</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-lg sm:text-xl text-gray-100 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.5,
            ease: "easeOut"
          }}
        >
          Manage classes, budget smartly, plan studies, prep for exams, and
          boost productivity—all in one app.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8,
            ease: "easeOut"
          }}
        >
          {!user && (
            <motion.button
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          )}
            
        </motion.div>
      </div>
    </section>
  );
}
