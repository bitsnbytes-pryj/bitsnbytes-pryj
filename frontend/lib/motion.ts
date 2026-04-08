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