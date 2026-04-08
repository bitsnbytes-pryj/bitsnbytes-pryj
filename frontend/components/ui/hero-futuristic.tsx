"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef, MouseEvent } from "react";
import { ArrowRight, Sparkles, Play, ChevronDown } from "lucide-react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((mod) => mod.WebGLShader),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1628]" />
    ),
  },
);

import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/ui/glass-container";
import { ExperienceLauncher } from "@/components/experience/experience-launcher";
import { 
  textReveal, 
  scaleIn, 
  fadeInUp, 
  staggerContainer
} from "@/lib/motion";

const stats = [
  { value: "100+", label: "Builders", detail: "at the Sangam" },
  { value: "25+", label: "Projects", detail: "shipped" },
  { value: "12+", label: "Events", detail: "hosted" },
];

const taglines = [
  "Where Rivers Converge, Code Flows",
  "Built at the Sangam",
  "Prayagraj's Teen Tech Crew",
];

export const HeroFuturistic = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);

  const heroRef = useRef<HTMLDivElement>(null);

  // Rotate taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Subtle parallax tilt
    rotateX.set(y * -0.01);
    rotateY.set(x * 0.01);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-b-[1.5rem] sm:rounded-b-[2rem] md:rounded-b-[3rem] lg:rounded-b-[3.5rem] text-white w-full max-w-full min-h-[90vh] sm:min-h-screen"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-labelledby="home-hero-title"
    >
      <WebGLShader />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

      {/* Confluence Lines - Animated SVG representing rivers merging */}
      <motion.svg
        className="absolute inset-0 pointer-events-none opacity-40"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
      >
        {/* Left river line - Ganga */}
        <motion.path
          d="M -10 60 Q 30 50 50 50 T 110 40"
          stroke="url(#gradient1)"
          strokeWidth="0.4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.3 }}
        />
        
        {/* Right river line - Yamuna */}
        <motion.path
          d="M -10 40 Q 30 55 50 50 T 110 60"
          stroke="url(#gradient2)"
          strokeWidth="0.4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
        />
        
        {/* Hidden river - Saraswati */}
        <motion.path
          d="M 50 110 Q 50 70 50 50"
          stroke="url(#gradient3)"
          strokeWidth="0.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.7 }}
          opacity={0.4}
        />
        
        {/* Confluence glow */}
        <motion.circle
          cx="50"
          cy="50"
          r="12"
          fill="url(#glowGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, ease: "easeOut", delay: 1, repeat: Infinity }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-teal-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center min-h-[90vh] sm:min-h-screen px-4 py-20 sm:py-24 md:py-28 lg:py-32">
        <div className="flex flex-col gap-8 lg:gap-12">
          
          {/* Main Hero Content */}
          <motion.div 
            className="flex flex-col items-center text-center gap-6 sm:gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-teal-300">
                Prayagraj Chapter · Live & Building
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              id="home-hero-title" 
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tighter"
              variants={textReveal}
            >
              <span className="text-white">Building at the</span>
              <br />
              <span className="text-gradient-sangam">Sangam</span>
            </motion.h1>

            {/* Dynamic Tagline */}
            <motion.div 
              className="h-8 flex items-center justify-center"
              variants={fadeInUp}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTagline}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg sm:text-xl md:text-2xl text-white/70 font-medium"
                >
                  {taglines[currentTagline]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed"
              variants={fadeInUp}
            >
              Prayagraj's teen-led tech community where ambitious builders ship real products 
              through premium hackathons, design squads, and community launches.
            </motion.p>

            {/* Primary CTA - Experience Mode */}
            <motion.div 
              className="flex flex-col items-center gap-4 mt-4"
              variants={fadeInUp}
            >
              <ExperienceLauncher />
              
              {/* Secondary CTAs */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all px-8"
                >
                  <Link href="/join" className="flex items-center gap-2">
                    Join Prayagraj
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm px-8"
                >
                  <Link href="/about#team">Meet the team</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="rounded-full text-white/70 hover:text-white hover:bg-white/10 px-6"
                >
                  <Link href="/projects">View projects</Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-8 w-full max-w-3xl"
            >
              <GlassContainer className="p-4 sm:p-6" glowColor="teal" animated={false}>
                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={stat.label} 
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                    >
                      <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                        {stat.value}
                      </p>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-teal-400 font-bold mt-1">
                        {stat.label}
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">
                        {stat.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </GlassContainer>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <span className="text-xs text-white/40 uppercase tracking-widest">Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5 text-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroFuturistic;