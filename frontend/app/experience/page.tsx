"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import for the heavy 3D scene
const ConfluenceScene = dynamic(
  () => import("@/components/experience/confluence-scene").then((mod) => mod.ConfluenceScene),
  {
    ssr: false,
    loading: () => <ExperienceLoader />,
  }
);

// Mobile/low-end fallback
const MobileExperience = dynamic(
  () => import("@/components/experience/mobile-experience").then((mod) => mod.MobileExperience),
  { ssr: false }
);

function ExperienceLoader() {
  return (
    <div className="fixed inset-0 bg-[#0A1628] flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-teal-500/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-amber-500/30"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-teal-500 to-amber-500"
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="space-y-2">
          <p className="text-white font-display text-xl font-bold">Preparing Your Experience</p>
          <p className="text-white/60 text-sm">Converging at the Sangam...</p>
        </div>
      </div>
    </div>
  );
}

function ExitButton() {
  return (
    <Link href="/">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Site</span>
      </motion.button>
    </Link>
  );
}

function ExperienceNav() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="fixed top-6 right-6 z-50 flex items-center gap-3"
    >
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-all"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </motion.div>
  );
}

function useDeviceCapabilities() {
  // Always return high-end capabilities to show full experience
  const [capabilities] = useState({
    canRunWebGL: true,
    isMobile: false,
    isLowEnd: false,
  });

  return capabilities;
}

export default function ExperiencePage() {
  const [mounted, setMounted] = useState(false);
  const capabilities = useDeviceCapabilities();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ExperienceLoader />;
  }

  // Always show WebGL experience, ignore reduced motion and device capabilities
  const showMobileExperience = false;
  const showWebGLExperience = true;

  return (
    <div className="fixed inset-0 bg-[#0A1628] overflow-hidden">
      <ExitButton />
      <ExperienceNav />

      <AnimatePresence mode="wait">
        {showWebGLExperience ? (
          <motion.div
            key="webgl-experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Suspense fallback={<ExperienceLoader />}>
              <ConfluenceScene />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="mobile-experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full overflow-y-auto"
          >
            <Suspense fallback={<ExperienceLoader />}>
              <MobileExperience />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}