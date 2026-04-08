"use client";

import { motion, Variants } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  splitBy?: "word" | "character";
}

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

/**
 * Animated text reveal component with stagger animation.
 * Splits text into words or characters and animates them with stagger.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Component = "span",
  splitBy = "character",
}: TextRevealProps) {
  // Split text into items
  const items = useMemo(() => {
    if (splitBy === "word") {
      return text.split(" ");
    }
    return text.split("");
  }, [text, splitBy]);

  const variants = splitBy === "word" ? wordVariants : letterVariants;
  const MotionComponent = motion(Component as any);

  return (
    <MotionComponent
      className={cn("inline-flex flex-wrap", className)}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {items.map((item, i) => (
        <motion.span
          key={`${i}-${item}`}
          custom={i + delay * 30}
          variants={variants}
          style={{ 
            display: "inline-block",
            whiteSpace: splitBy === "word" ? "pre" : "pre-wrap",
          }}
        >
          {item}
          {splitBy === "word" && i < items.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionComponent>
  );
}

export default TextReveal;