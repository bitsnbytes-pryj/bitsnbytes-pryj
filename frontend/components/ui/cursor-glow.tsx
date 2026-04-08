"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface CursorGlowProps {
  size?: number;
  color?: string;
  opacity?: number;
  blur?: number;
  className?: string;
}

/**
 * A glow effect that follows the cursor position.
 */
export function CursorGlow({
  size = 400,
  color = "rgba(13, 148, 136, 0.15)", // teal glow
  opacity = 0.15,
  blur = 100,
  className = "",
}: CursorGlowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Spring for smooth follow
  const springX = useSpring(0, { stiffness: 150, damping: 20 });
  const springY = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setPosition({ x, y });
      springX.set(x);
      springY.set(y);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [springX, springY]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute"
        style={{
          x: springX,
          y: springY,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: isVisible ? opacity : 0,
          filter: `blur(${blur}px)`,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible ? opacity : 0, 
          scale: isVisible ? 1 : 0.8 
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}

export default CursorGlow;