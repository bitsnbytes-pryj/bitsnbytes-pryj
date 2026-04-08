"use client"

import Link from "next/link"
import { ArrowRight, Github, Linkedin, Twitter, Sparkles } from "lucide-react"
import { TextGlitch } from "@/components/ui/text-glitch-effect"
import { Hero3DScene } from "@/components/ui/hero-3d-scene"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0A1628] text-white overflow-hidden">
      {/* 3D Background Scene */}
      <Hero3DScene />

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="animate-slide-in-up"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f59e0b]/20 to-[#0d9488]/20 rounded-full mb-6 border border-[#f59e0b]/30"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-sm font-medium text-[#f59e0b]">Welcome to Bits&Bytes Prayagraj</span>
            </motion.div>
            <div className="mb-6">
              <TextGlitch
                text="SANGAM"
                hoverText="WHERE CODE FLOWS"
                className="!text-[4rem] sm:!text-[5rem] lg:!text-[6rem]"
                delay={0}
              />
            </div>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Join Prayagraj's boldest teen-led tech community at the sacred confluence. Build real projects, 
              attend hackathons, and transform your ideas into reality through code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/join"
                  prefetch={true}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#0d9488]/30 group transition-all"
                >
                  Join the Community <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#0d9488] text-[#0d9488] rounded-full font-medium hover:bg-[#0d9488]/10 transition-colors backdrop-blur-sm"
                >
                  Our Story
                </Link>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-sm text-white/70">Follow us:</span>
              <motion.a 
                href="https://github.com/bitsnbytes-pryj" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-[#0d9488]/20 rounded-full transition-colors group"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <Github size={20} className="text-white group-hover:text-[#f59e0b]" />
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/company/bitsnbytes-prayagraj" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-[#0d9488]/20 rounded-full transition-colors group"
                whileHover={{ scale: 1.2, rotate: -10 }}
              >
                <Linkedin size={20} className="text-white group-hover:text-[#f59e0b]" />
              </motion.a>
              <motion.a 
                href="https://twitter.com/bitsnbytes_prj" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-[#0d9488]/20 rounded-full transition-colors group"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <Twitter size={20} className="text-white group-hover:text-[#f59e0b]" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Visual: Stats card with 3D effect */}
          <motion.div 
            className="relative h-full min-h-[500px] animate-fade-in"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Floating stats card */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
              animate={{ 
                y: [0, -10, 0],
                rotateY: [0, 2, 0],
                rotateX: [0, -2, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              <div className="rounded-3xl bg-gradient-to-br from-[#0d9488]/20 via-[#0A1628]/80 to-[#f59e0b]/20 border border-white/10 px-6 py-8 backdrop-blur-md shadow-2xl shadow-[#0d9488]/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#0d9488] animate-pulse" />
                  <span className="text-sm uppercase tracking-[0.2em] text-white/80">At the Sangam</span>
                </div>
                
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  Bits&Bytes Prayagraj
                </h3>
                
                <p className="text-white/70 text-sm mb-6">
                  Where the sacred rivers meet, code flows and innovation thrives.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <motion.div 
                    className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(13, 148, 136, 0.1)" }}
                  >
                    <p className="text-3xl font-black bg-gradient-to-r from-[#0d9488] to-[#22d3ee] bg-clip-text text-transparent">200+</p>
                    <p className="text-xs text-white/60 mt-1">Members</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                  >
                    <p className="text-3xl font-black bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">15+</p>
                    <p className="text-xs text-white/60 mt-1">Projects</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 211, 238, 0.1)" }}
                  >
                    <p className="text-3xl font-black bg-gradient-to-r from-[#2dd4bf] to-[#22d3ee] bg-clip-text text-transparent">10+</p>
                    <p className="text-xs text-white/60 mt-1">Schools</p>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-6 pt-4 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Active Builders</span>
                    <span className="text-[#0d9488] font-medium">Right Now</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
