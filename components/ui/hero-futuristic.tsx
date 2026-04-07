"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef, MouseEvent } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useSpring, useMotionValue } from "framer-motion";

import dynamic from "next/dynamic";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((mod) => mod.WebGLShader),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-cyan-600/20" />
    ),
  },
);

import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/ui/glass-container";
import { 
  textReveal, 
  scaleIn, 
  fadeInUp, 
  fadeInRight,
  staggerContainer, 
  glowPulse 
} from "@/lib/motion";

const stats = [
  { value: "100+", label: "Builders" },
  { value: "25+", label: "Projects" },
  { value: "12+", label: "Events" },
];

const heroEvents = [
  {
    image: "/images/github-copilot-hero-desktop.png",
    imageMobile: "/images/github-copilot-hero-mobile.png",
    alt: "GitHub Copilot Dev Days | Lucknow",
    badge: "Upcoming Event",
    status: "upcoming",
    title: "GitHub Copilot Dev Days",
    subtitle: "19 Apr 2026 · Lucknow",
    href: "/events",
  },
  {
    image: "/event_pictures/HEe923uagAATqvy.jpg",
    imageMobile: "/event_pictures/HEe923uagAATqvy.jpg",
    alt: "India Innovates 2026 archive",
    badge: "Archived Event",
    status: "archived",
    title: "India Innovates 2026 Archive",
    subtitle: "28 Mar 2026 · New Delhi",
    href: "/events",
  },
];

// Split headline into words for staggered animation
const headlineWords = ["Building", "at", "Sangam"];

export const HeroFuturistic = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);

  const heroRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroEvents.length);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setMousePosition({ x, y });
    
    // Subtle parallax tilt
    rotateX.set(y * -0.01);
    rotateY.set(x * 0.01);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-b-[1.5rem] sm:rounded-b-[2rem] md:rounded-b-[3rem] lg:rounded-b-[3.5rem] text-white w-full max-w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-labelledby="home-hero-title"
    >
      <WebGLShader />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Confluence Lines - Animated SVG representing rivers merging */}
      <motion.svg
        className="absolute inset-0 pointer-events-none opacity-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        {/* Left river line */}
        <motion.path
          d="M -10 60 Q 30 50 50 50 T 110 40"
          stroke="url(#gradient1)"
          strokeWidth="0.3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
        
        {/* Right river line */}
        <motion.path
          d="M -10 40 Q 30 55 50 50 T 110 60"
          stroke="url(#gradient2)"
          strokeWidth="0.3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />
        
        {/* Confluence glow */}
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill="url(#glowGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-12 px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-20 md:px-6 md:pb-16 md:pt-24 lg:pb-20 lg:pt-28 lg:flex-row lg:items-stretch lg:gap-16 box-border">
        {/* Left content card with parallax */}
        <motion.div 
          className="flex-[1.2] min-w-0"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          <GlassContainer
            className="p-5 sm:p-6 md:p-8 lg:p-12"
            containerClassName="h-full"
          >
            <div className="flex flex-col h-full gap-6 sm:gap-8 md:gap-10">
              {/* Teen-led badge */}
              <motion.span
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.2 }}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 sm:px-4 sm:py-1.5 text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white/80 backdrop-blur-md shadow-inner"
              >
                <Sparkles className="h-3 w-3 text-teal-400" />
                TEEN-LED
              </motion.span>

              {/* Main content with staggered text */}
              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 
                  id="home-hero-title" 
                  className="font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter drop-shadow-2xl"
                >
                  {headlineWords.map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      variants={textReveal}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                  <br className="hidden sm:block" />
                  <motion.span
                    className="inline-block"
                    variants={textReveal}
                    transition={{ delay: 0.8 }}
                  >
                    Sangam
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-sm text-white/80 sm:text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed"
                  variants={textReveal}
                  transition={{ delay: 0.9 }}
                >
                  Prayagraj's teen-led tech community where ambitious builders ship real products through premium hackathons, design squads, and community launches.
                </motion.p>
              </motion.div>

              {/* CTA Buttons with delayed entrance */}
              <motion.div 
                className="flex flex-col gap-4 sm:flex-row w-full mt-2"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                transition={{ delayChildren: 1.0 }}
              >
                <motion.div variants={fadeInUp}>
                  <Button
                    asChild
                    className="w-full sm:flex-1 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-teal-600 text-sm sm:text-base font-bold text-white shadow-[0_0_30px_rgba(13,148,136,0.5)] hover:shadow-[0_0_50px_rgba(13,148,136,0.7)] transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                  >
                    <Link href="/join" className="flex items-center justify-center gap-2">
                      Join the crew
                      <ArrowRight className="h-5 w-5 shrink-0" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div variants={fadeInUp} transition={{ delay: 0.1 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:flex-1 h-12 sm:h-14 px-6 sm:px-8 rounded-full border-white/20 bg-white/5 text-sm sm:text-base font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                  >
                    <Link href="/impact" className="flex items-center justify-center">See what we've built</Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats Grid with enhanced animations */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                transition={{ delayChildren: 1.3 }}
              >
                <GlassContainer className="mt-auto p-4 sm:p-6" glowColor="none" animated={false}>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                      <motion.div 
                        key={stat.label} 
                        className="text-center sm:text-left relative"
                        variants={fadeInUp}
                        transition={{ delay: index * 0.1 + 1.3 }}
                      >
                        {/* Subtle glow on hover */}
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-teal-500/10 blur-xl -z-10"
                          variants={glowPulse}
                        />
                        <motion.p 
                          className="text-lg sm:text-xl md:text-3xl font-black text-white relative"
                          variants={scaleIn}
                        >
                          {stat.value}
                        </motion.p>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-white/60 font-bold relative">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </GlassContainer>
              </motion.div>
            </div>
          </GlassContainer>
        </motion.div>

        {/* Right — Event Slideshow */}
        <motion.div
          className="flex-1 min-w-0"
          initial="hidden"
          animate="visible"
          variants={fadeInRight}
          transition={{ delay: 0.4 }}
        >
          <Link
            href={heroEvents[activeSlide].href}
            className="relative flex-1 min-w-0 block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 rounded-[1.75rem]"
            aria-label={`View details for ${heroEvents[activeSlide].title}`}
          >
            <GlassContainer
              className="h-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto transition-transform duration-500 group-hover:scale-[1.02]"
              containerClassName="h-full"
              glowColor="teal"
            >
              <div className="relative h-full w-full overflow-hidden">
                {heroEvents.map((event, idx) => (
                  <motion.div
                    key={event.title}
                    className={`absolute inset-0 bg-[#0a0a0d] transition-opacity duration-700 ease-in-out ${idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    initial={{ scale: idx === activeSlide ? 1.02 : 1 }}
                    animate={{ scale: idx === activeSlide ? 1.02 : 1 }}
                    transition={{ duration: 2 }}
                  >
                    <Image
                      src={event.image}
                      alt={event.alt}
                      fill
                      className={`hidden sm:block object-cover transition-all duration-700 ${idx === 0 ? "object-center scale-[1.05]" : "object-center"}`}
                      priority={idx === 0}
                    />
                    <Image
                      src={event.imageMobile ?? event.image}
                      alt={event.alt}
                      fill
                      className={`block sm:hidden object-cover transition-all duration-700 ${idx === 0 ? "object-center scale-[1.02]" : "object-center"}`}
                      priority={idx === 0}
                    />
                  </motion.div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 z-20" />

                <div className="absolute bottom-8 left-8 right-8 space-y-2 z-30">
                  <motion.span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest ${heroEvents[activeSlide].status === "upcoming"
                      ? "bg-teal-500/10 border border-teal-500/30 text-teal-400"
                      : "bg-white/10 border border-white/20 text-white/80"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={heroEvents[activeSlide].badge}
                    transition={{ duration: 0.3 }}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${heroEvents[activeSlide].status === "upcoming"
                        ? "bg-teal-500 animate-pulse"
                        : "bg-white/70"
                        }`}
                    />
                    {heroEvents[activeSlide].badge}
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`${heroEvents[activeSlide].title}-content`}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <h3 className="font-display text-2xl font-black text-white flex items-center gap-2">
                      {heroEvents[activeSlide].title}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </h3>
                    <p className="text-white/60 text-sm font-medium mt-1">{heroEvents[activeSlide].subtitle}</p>
                  </motion.div>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-2 pt-2" role="tablist" aria-label="Hero event slides">
                    {heroEvents.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveSlide(idx); }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeSlide ? "w-6 bg-teal-600" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
                        aria-label={`Go to slide ${idx + 1}`}
                        aria-current={idx === activeSlide}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </GlassContainer>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroFuturistic;