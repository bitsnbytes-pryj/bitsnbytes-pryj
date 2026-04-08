"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  align?: "left" | "center";
  as?: "section" | "div";
  bleed?: boolean;
  animate?: boolean;
  staggerChildren?: boolean;
  parallax?: boolean;
  parallaxStrength?: number;
  revealDirection?: "up" | "left" | "right" | "fade";
};

export function PageSection({
  children,
  className,
  eyebrow,
  title,
  description,
  align = "left",
  as: Component = "section",
  bleed = false,
  animate = true,
  staggerChildren = false,
  parallax = false,
  parallaxStrength = 0.1,
  revealDirection = "up",
}: PageSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [50 * parallaxStrength * 100, -50 * parallaxStrength * 100]
  );
  
  const headingAlignment =
    align === "center" ? "items-center text-center" : "text-left";

  const MotionComponent = motion(Component as any);

  // Determine animation variant based on reveal direction
  const getAnimationVariant = () => {
    if (!animate) return undefined;
    
    switch (revealDirection) {
      case "left":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
        };
      case "right":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
        };
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        };
      case "up":
      default:
        return fadeInUp;
    }
  };

  // Parallax and stagger are always enabled
  const shouldParallax = parallax;
  const shouldStagger = staggerChildren;

  const content = (
    <>
      {(eyebrow || title || description) && (
        <motion.div
          className={cn(
            "mb-6 sm:mb-8 md:mb-10 flex flex-col gap-2 sm:gap-3",
            headingAlignment,
          )}
          variants={shouldStagger ? staggerItem : undefined}
        >
          {eyebrow && (
            <span className="section-eyebrow text-[0.6rem] sm:text-[0.7rem] px-3 sm:px-4">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-foreground/90 font-medium px-2 sm:px-0">
              {description}
            </p>
          )}
        </motion.div>
      )}
      {shouldStagger ? (
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </>
  );

  return (
    <MotionComponent
      ref={ref}
      className={cn(
        "section-shell py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden",
        bleed && "max-w-none px-0 sm:px-6",
        className,
      )}
      initial={animate ? "hidden" : undefined}
      animate={animate && isInView ? "visible" : undefined}
      variants={getAnimationVariant()}
      style={shouldParallax ? { y: parallaxY } : undefined}
    >
      {content}
    </MotionComponent>
  );
}

export default PageSection;