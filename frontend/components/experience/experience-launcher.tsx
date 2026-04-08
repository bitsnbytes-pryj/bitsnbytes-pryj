"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, X } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import for the experience scene to avoid SSR issues
const ConfluenceScene = dynamic(
  () => import("./confluence-scene").then((mod) => mod.ConfluenceScene),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
          <p className="text-teal-400 text-sm font-medium">Loading Experience...</p>
        </div>
      </div>
    ),
  }
);

// Mobile fallback component
const MobileExperience = dynamic(
  () => import("./mobile-experience").then((mod) => mod.MobileExperience),
  { ssr: false }
);

export const ExperienceLauncher = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLaunch = () => {
    setIsActive(true);
    // Track analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "experience_mode_launch", {
        event_category: "engagement",
        event_label: "experience_mode",
      });
    }
  };

  const handleClose = () => {
    setIsActive(false);
  };

  return (
    <>
      {/* Main Launch Button */}
      <motion.button
        onClick={handleLaunch}
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white font-bold text-lg shadow-2xl shadow-teal-500/40 hover:shadow-teal-400/50 transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {/* Shimmer effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Glow ring */}
        <span className="absolute inset-0 rounded-full border border-white/20" />
        <span className="absolute -inset-1 rounded-full border border-teal-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <Play className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" fill="currentColor" />
        <span className="relative z-10">Try Experience Mode</span>
        <Sparkles className="w-5 h-5 relative z-10 text-teal-200 group-hover:text-yellow-300 transition-colors" />
      </motion.button>

      {/* Experience Mode Modal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#030712]"
          >
            {/* Close button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-6 right-6 z-[110] flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all border border-white/10 backdrop-blur-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Exit Experience</span>
            </motion.button>

            {/* Progress indicator */}
            <div className="absolute top-6 left-6 z-[110]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs text-white/60 font-medium">Experience Mode</span>
              </motion.div>
            </div>

            {/* Render appropriate experience based on device */}
            {isMobile ? (
              <MobileExperience onClose={handleClose} />
            ) : (
              <ConfluenceScene onClose={handleClose} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExperienceLauncher;

// Compact version for inline use
export function ExperienceLauncherCompact() {
  return (
    <Link 
      href="/experience" 
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-sm font-semibold hover:bg-teal-500/30 hover:text-teal-300 transition-all"
    >
      <Play className="w-4 h-4" fill="currentColor" />
      Try Experience Mode
    </Link>
  );
}
