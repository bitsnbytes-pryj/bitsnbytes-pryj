"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { counterUp } from "@/lib/motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2000,
  delay = 0,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
      const startTime = performance.now();
      const endTime = startTime + duration;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutExpo
        const easeOutExpo = (t: number) => {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const easedProgress = easeOutExpo(progress);
        const currentCount = Math.floor(easedProgress * value);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      const delayedStart = setTimeout(() => {
        requestAnimationFrame(animate);
      }, delay);

      return () => clearTimeout(delayedStart);
    }
  }, [isInView, isVisible, value, duration, delay]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={counterUp}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
}