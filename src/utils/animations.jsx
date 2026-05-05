import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll setup
export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger to Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(gsap.ticker._listeners[lenis]);
    };
  }, []);
};

// Common animation variants for Framer Motion
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// GSAP animation hooks
export const useGSAPAnimation = (elementRef, animationConfig) => {
  useEffect(() => {
    if (elementRef.current) {
      const ctx = gsap.context(() => {
        gsap.to(elementRef.current, animationConfig);
      }, elementRef);
      
      return () => ctx.revert();
    }
  }, [elementRef, animationConfig]);
};

export const useScrollAnimation = (elementRef, animationConfig) => {
  useEffect(() => {
    if (elementRef.current) {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: elementRef.current,
          ...animationConfig
        });
      }, elementRef);
      
      return () => ctx.revert();
    }
  }, [elementRef, animationConfig]);
};

// Animated wrapper component
export const AnimatedPage = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
  >
    {children}
  </motion.div>
);

export const AnimatedCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={className}
    initial="initial"
    animate="animate"
    variants={cardVariants}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export const AnimatedContainer = ({ children, className = "" }) => (
  <motion.div
    className={className}
    variants={staggerContainer}
    initial="initial"
    animate="animate"
  >
    {children}
  </motion.div>
);

// Chart animation utilities
export const animateChart = (chartRef) => {
  if (!chartRef?.current) return;
  
  gsap.fromTo(chartRef.current, 
    {
      opacity: 0,
      scale: 0.8,
      rotation: 180
    },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: "power3.out"
    }
  );
};

// Sidebar animation
export const animateSidebar = (sidebarRef, isOpen) => {
  if (!sidebarRef?.current) return;
  
  gsap.to(sidebarRef.current, {
    x: isOpen ? 0 : '-100%',
    duration: 0.4,
    ease: 'power3.inOut'
  });
};

// Floating animation for elements
export const addFloatingAnimation = (elementRef) => {
  if (!elementRef?.current) return;
  
  gsap.to(elementRef.current, {
    y: -10,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });
};

// Pulse animation for important elements
export const addPulseAnimation = (elementRef) => {
  if (!elementRef?.current) return;
  
  gsap.to(elementRef.current, {
    scale: 1.05,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });
};
