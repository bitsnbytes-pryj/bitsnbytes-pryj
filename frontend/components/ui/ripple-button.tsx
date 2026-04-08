"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "default" | "teal" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  rippleColor?: string;
  magnetic?: boolean;
  className?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Enhanced button with ripple click effect and optional magnetic hover.
 * Creates a premium tactile feel for interactions.
 */
export function RippleButton({
  children,
  variant = "default",
  size = "md",
  rippleColor = "rgba(255, 255, 255, 0.35)",
  magnetic = false,
  className = "",
  onClick,
  ...props
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const rippleIdRef = useRef(0);

  const createRipple = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Clean up ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      onClick?.(event);
    },
    [createRipple, onClick]
  );

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic) return;
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (event.clientX - centerX) * 0.15;
    const deltaY = (event.clientY - centerY) * 0.15;

    setMagneticOffset({ x: deltaX, y: deltaY });
  }, [magnetic]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMagneticOffset({ x: 0, y: 0 });
  }, []);

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    teal: "bg-teal-600 text-white hover:bg-teal-500 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50",
    ghost: "bg-transparent hover:bg-white/10 text-foreground",
    outline: "border border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-medium overflow-hidden transition-all duration-300",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      style={{
        transform: magnetic
          ? `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`
          : undefined,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor,
            }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

export default RippleButton;