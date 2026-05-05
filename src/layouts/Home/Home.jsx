import React, { useEffect, useRef } from 'react';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import CTA from './CTA';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    lenisRef.current = new Lenis({
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

    // Connect Lenis to GSAP ScrollTrigger
    const raf = (time) => {
      lenisRef.current.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Update ScrollTrigger on Lenis scroll
    lenisRef.current.on('scroll', ScrollTrigger.update);

    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        ScrollTrigger.refresh();
      }
    };
  }, []);
    return (
        <div ref={containerRef} className="overflow-x-hidden">
            <Hero></Hero>
            <Features></Features>
            <Testimonials></Testimonials>
            <CTA></CTA>
        </div>
    );
};

export default Home;