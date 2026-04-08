"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { usePerformanceTier } from "@/lib/hooks";

interface ScrollProgressProps {
  className?: string;
}

/**
 * River-styled scroll progress indicator.
 * Shows progress as converging rivers flowing toward the confluence.
 */
export function ScrollProgress({ className = "" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const { canUseComplexAnimations, reducedMotion } = usePerformanceTier();
  
  // Smooth spring animation for progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Color transitions based on scroll position
  const gradientStart = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#0d9488", "#22d3ee", "#f59e0b"]
  );

  if (reducedMotion) {
    return (
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0d9488] via-[#22d3ee] to-[#f59e0b] origin-left z-50 ${className}`}
        style={{ scaleX }}
      />
    );
  }

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 origin-left z-50 ${className}`}
        style={{ 
          scaleX,
          background: canUseComplexAnimations 
            ? `linear-gradient(90deg, #0d9488, #22d3ee, #f59e0b)`
            : "#0d9488"
        }}
      />
      
      {/* Glow effect for the progress bar */}
      {canUseComplexAnimations && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-3 origin-left z-40 pointer-events-none"
          style={{ 
            scaleX,
            background: "linear-gradient(90deg, rgba(13, 148, 136, 0.4), rgba(34, 211, 238, 0.3), rgba(245, 158, 11, 0.4))",
            filter: "blur(4px)",
          }}
        />
      )}
    </>
  );
}

/**
 * Circular scroll progress indicator
 */
export function ScrollProgressCircle({ className = "" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const { reducedMotion } = usePerformanceTier();
  
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.div
      className={`fixed bottom-6 right-6 w-12 h-12 z-50 ${className}`}
      style={reducedMotion ? {} : { rotate }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="4"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            pathLength,
            rotate: -90,
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

/**
 * Section-based scroll progress with indicators
 */
export function SectionProgress({ 
  sections = [] 
}: { 
  sections: { id: string; label: string }[] 
}) {
  const { scrollYProgress } = useScroll();
  const { reducedMotion } = usePerformanceTier();

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
      {sections.map((section, index) => (
        <motion.a
          key={section.id}
          href={`#${section.id}`}
          className="group flex items-center gap-2"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-white/30 transition-colors group-hover:bg-[#0d9488]"
            whileHover={{ scale: 1.5 }}
          />
          <span className="text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            {section.label}
          </span>
        </motion.a>
      ))}
    </div>
  );
}

export default ScrollProgress;