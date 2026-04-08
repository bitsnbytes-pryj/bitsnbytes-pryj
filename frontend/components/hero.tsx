"use client";

import Link from "next/link";
import { ArrowRight, Github, Linkedin, Twitter, Sparkles, ChevronDown } from "lucide-react";
import { TextGlitch } from "@/components/ui/text-glitch-effect";
import { Hero3DScene } from "@/components/ui/hero-3d-scene";
import { WaterRipple } from "@/components/ui/water-ripple";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePerformanceTier, useMousePosition } from "@/lib/hooks";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const { canUseParticles, canUseComplexAnimations, reducedMotion } = usePerformanceTier();
  
  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Scroll to next section
  const scrollToNext = () => {
    const nextSection = document.querySelector("#about");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0A1628] text-white overflow-hidden"
    >
      {/* 3D Background Scene */}
      <Hero3DScene />

      {/* Water Ripple Interaction Layer */}
      {canUseParticles && <WaterRipple className="z-5" maxRadius={300} rippleSpeed={2.5} />}

      {/* Main Content with Parallax */}
      <motion.div
        className="relative max-w-7xl mx-auto z-10"
        style={reducedMotion ? {} : { y, opacity, scale }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="animate-slide-in-up"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge with animated glow */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f59e0b]/20 to-[#0d9488]/20 rounded-full mb-6 border border-[#f59e0b]/30 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-sm font-medium text-[#f59e0b] relative z-10">
                Welcome to Bits&Bytes Prayagraj
              </span>
            </motion.div>

            {/* Main heading with enhanced reveal */}
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <TextGlitch
                  text="SANGAM"
                  hoverText="WHERE CODE FLOWS"
                  className="!text-[4rem] sm:!text-[5rem] lg:!text-[6rem]"
                  delay={0}
                />
              </motion.div>
            </div>

            {/* Description with staggered word animation */}
            <motion.p
              className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Join Prayagraj's boldest teen-led tech community at the sacred confluence. Build real
              projects, attend hackathons, and transform your ideas into reality through code.
            </motion.p>

            {/* Enhanced CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Primary CTA with water-ripple effect on hover */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d9488] to-[#22d3ee] rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                <Link
                  href="/join"
                  prefetch={true}
                  className="relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#0d9488]/30 group transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Join the Community{" "}
                    <ArrowRight
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </span>
                </Link>
              </motion.div>

              {/* Secondary CTA */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#0d9488] text-[#0d9488] rounded-full font-medium hover:bg-[#0d9488]/10 transition-colors backdrop-blur-sm group"
                >
                  Our Story
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Social Links with enhanced animations */}
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <span className="text-sm text-white/70">Follow us:</span>
              {[
                { href: "https://github.com/bitsnbytes-pryj", icon: Github },
                { href: "https://www.linkedin.com/company/bitsnbytes-prayagraj", icon: Linkedin },
                { href: "https://twitter.com/bitsnbytes_prj", icon: Twitter },
              ].map(({ href, icon: Icon }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-[#0d9488]/20 rounded-full transition-colors group relative"
                  whileHover={{ scale: 1.2, rotate: i % 2 === 0 ? 10 : -10 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                >
                  <Icon size={20} className="text-white group-hover:text-[#f59e0b] transition-colors" />
                  {/* Tooltip */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {href.includes("github") ? "GitHub" : href.includes("linkedin") ? "LinkedIn" : "Twitter"}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual: Enhanced stats card */}
          <motion.div
            className="relative h-full min-h-[500px] animate-fade-in"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Floating stats card with enhanced 3D effect */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
              animate={
                reducedMotion
                  ? {}
                  : {
                      y: [0, -10, 0],
                      rotateY: [0, 2, 0],
                      rotateX: [0, -2, 0],
                    }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              {/* Card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d9488]/20 to-[#f59e0b]/20 rounded-3xl blur-2xl opacity-50" />
              
              <div className="relative rounded-3xl bg-gradient-to-br from-[#0d9488]/20 via-[#0A1628]/80 to-[#f59e0b]/20 border border-white/10 px-6 py-8 backdrop-blur-md shadow-2xl shadow-[#0d9488]/20">
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(13, 148, 136, 0.3), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-[#0d9488]"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm uppercase tracking-[0.2em] text-white/80">
                    At the Sangam
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  Bits&Bytes Prayagraj
                </h3>

                <p className="text-white/70 text-sm mb-6">
                  Where the sacred rivers meet, code flows and innovation thrives.
                </p>

                {/* Stats grid with hover effects */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "200+", label: "Members", gradient: "from-[#0d9488] to-[#22d3ee]" },
                    { value: "15+", label: "Projects", gradient: "from-[#f59e0b] to-[#fbbf24]" },
                    { value: "10+", label: "Schools", gradient: "from-[#2dd4bf] to-[#22d3ee]" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0d9488]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p
                        className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-white/60 mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-6 pt-4 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Active Builders</span>
                    <motion.span
                      className="text-[#0d9488] font-medium flex items-center gap-1"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0d9488] mr-1" />
                      Right Now
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A1628] to-transparent pointer-events-none" />
    </section>
  );
}