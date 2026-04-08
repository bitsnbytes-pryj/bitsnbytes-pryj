"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformanceTier } from "@/lib/hooks";

interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

/**
 * 3D tilt card for bento grid items
 */
function BentoCard({ item }: { item: BentoItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const { canUseComplexAnimations, reducedMotion } = usePerformanceTier();
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canUseComplexAnimations || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Size classes
  const sizeClasses = {
    sm: "col-span-1 row-span-1",
    md: "col-span-1 md:col-span-2 row-span-1",
    lg: "col-span-1 md:col-span-2 row-span-1 md:row-span-2",
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 overflow-hidden",
        "transition-shadow duration-500",
        sizeClasses[item.size || "sm"],
        item.className
      )}
      style={
        canUseComplexAnimations && !reducedMotion
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }
          : {}
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={reducedMotion ? {} : { scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(13, 148, 136, 0.3), rgba(34, 211, 238, 0.2), rgba(245, 158, 11, 0.2))",
        }}
      />

      {/* Shine effect */}
      {canUseComplexAnimations && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.06), transparent 40%)",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {item.icon && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-[#0d9488]/20 to-transparent w-fit">
            {item.icon}
          </div>
        )}
        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
        <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#0d9488]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </motion.div>
  );
}

/**
 * Asymmetric bento grid layout for features
 */
export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {items.map((item, index) => (
        <BentoCard key={item.id} item={item} />
      ))}
    </div>
  );
}

/**
 * Animated section wrapper with scroll-triggered reveal
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { reducedMotion } = usePerformanceTier();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? {} : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default BentoGrid;