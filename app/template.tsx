"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Entropy } from "@/components/ui/entropy";

const LOADING_QUOTES = [
  "Calculating the matrix...",
  "Loading node_modules...",
  "Reticulating splines...",
  "Compiling quantum fluctuations...",
  "Initializing neural pathways...",
  "Downloading more RAM...",
  "Untangling the blockchain...",
  "Feeding the hamsters...",
  "Warming up the flux capacitor...",
  "Generating random semicolons...",
  "Parsing the cosmic rays...",
  "Deploying to production (yolo)...",
  "Asking ChatGPT for help...",
  "npm install universe...",
  "git push --force life...",
  "Refactoring reality...",
  "Debugging the simulation...",
  "Consulting the documentation...",
  "Hydrating the components...",
  "Spinning up the cloud...",
  "Clearing the cache...",
  "Optimizing the algorithms...",
  "Brewing some coffee...",
  "Counting to infinity...",
  "Dividing by zero (carefully)...",
  "Syncing with the mothership...",
  "Establishing quantum entanglement...",
  "Loading cat pictures...",
  "Convincing AI to cooperate...",
  "Reversing entropy locally...",
  "Calibrating the pixel density...",
  "Summoning the dev gods...",
  "Polishing the UI crystals...",
  "Aligning the CSS stars...",
  "Rendering the impossible...",
  "Solving P vs NP...",
  "Compressing time and space...",
  "Injecting dependencies...",
  "Awaiting the promises...",
  "Resolving merge conflicts...",
];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Check if this is the first visit (only show intro once per session)
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("bits-intro-seen");
    if (!hasSeenIntro) {
      setShowIntro(true);
      // Mark as seen after the intro completes
      const timer = setTimeout(() => {
        sessionStorage.setItem("bits-intro-seen", "true");
        setShowIntro(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Pick a random starting quote
  const randomStartIndex = useMemo(
    () => Math.floor(Math.random() * LOADING_QUOTES.length),
    []
  );

  useEffect(() => {
    setQuoteIndex(randomStartIndex);
  }, [randomStartIndex]);

  // Rotate quotes every 400ms during intro
  useEffect(() => {
    if (!showIntro) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
    }, 400);
    return () => clearInterval(interval);
  }, [showIntro]);

  return (
    <>
      {/* Preload content in background while intro shows */}
      {showIntro && (
        <div className="invisible absolute inset-0 -z-10" aria-hidden="true">
          {children}
        </div>
      )}

      {/* Main content with smooth page transitions */}
      {!showIntro && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        >
          {children}
        </motion.div>
      )}

      {/* One-time intro loading overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <Entropy size={280} className="rounded-xl" />
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="mt-6 font-mono text-sm text-white/60 tracking-wide h-6"
            >
              {LOADING_QUOTES[quoteIndex]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
