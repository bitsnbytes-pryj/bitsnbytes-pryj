"use client";

import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Wrapper that adds magnetic pull effect to children.
 * Child element slightly follows the cursor when hovering.
 */
export function MagneticWrapper({
  children,
  strength = 0.3,
  className = "",
  disabled = false,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  }, [strength, disabled, x, y]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Magnetic effect is always enabled unless explicitly disabled
  const shouldMagnetize = !disabled;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: shouldMagnetize ? springX : 0,
        y: shouldMagnetize ? springY : 0,
      }}
      onMouseMove={shouldMagnetize ? handleMouseMove : undefined}
      onMouseEnter={shouldMagnetize ? handleMouseEnter : undefined}
      onMouseLeave={shouldMagnetize ? handleMouseLeave : undefined}
    >
      {children}
    </motion.div>
  );
}

export default MagneticWrapper;