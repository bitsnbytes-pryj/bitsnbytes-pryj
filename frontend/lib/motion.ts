import { Variants } from "framer-motion"

/**
 * Global motion variants for consistent animations across the app
 * All animations respect prefers-reduced-motion
 */

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // ease-out variant
    },
  },
}

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * Confluence line animation variants for hero section
 * Simulates the Sangam river confluence
 */
export const confluenceLine: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0,
  },
  visible: { 
    pathLength: 1,
    opacity: 0.6,
    transition: { 
      pathLength: { duration: 2, ease: "easeInOut" },
      opacity: { duration: 0.5, delay: 0.5 },
    },
  },
}

/**
 * Text reveal animation - staggers words
 */
export const textReveal: Variants = {
  hidden: { 
    opacity: 0,
    y: 10,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * Stat counter animation
 */
export const counterUp: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * Glow pulse animation
 */
export const glowPulse: Variants = {
  hidden: { opacity: 0.5, scale: 1 },
  visible: {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

/**
 * Hover lift effect for cards
 */
export const hoverLift: Variants = {
  rest: { 
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  hover: { 
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * Message entrance animation for chat
 */
export const messageSlide: Variants = {
  hidden: { 
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * Shimmer effect for loading states
 */
export const shimmer: Variants = {
  initial: {
    backgroundPosition: "200% 0",
  },
  animate: {
    backgroundPosition: "-200% 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
}

/**
 * Typewriter cursor blink
 */
export const cursorBlink: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

/**
 * Scale bounce for interactive elements
 */
export const scaleBounce: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
}

/**
 * Slide in from direction
 */
export const slideIn: Variants = {
  hidden: (direction: "up" | "down" | "left" | "right" = "up") => {
    const offset = 50
    switch (direction) {
      case "up":
        return { opacity: 0, y: offset }
      case "down":
        return { opacity: 0, y: -offset }
      case "left":
        return { opacity: 0, x: offset }
      case "right":
        return { opacity: 0, x: -offset }
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * Parallax layer - moves based on scroll progress
 */
export const parallaxLayer: Variants = {
  initial: (depth: number = 1) => ({
    y: 0,
  }),
  animate: (depth: number = 1) => ({
    y: depth * -50,
    transition: {
      type: "tween",
      ease: "linear",
    },
  }),
}

/**
 * Magnetic hover effect
 */
export const magneticHover: Variants = {
  rest: {
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  hover: {
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
}

/**
 * Reveal animation for images and cards
 */
export const revealFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    clipPath: "inset(100% 0 0 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * Fade with blur
 */
export const fadeBlur: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}
