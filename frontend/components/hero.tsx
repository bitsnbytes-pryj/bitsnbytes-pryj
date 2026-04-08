"use client"

import Link from "next/link"
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import { TextGlitch } from "@/components/ui/text-glitch-effect"
import { ShaderAnimation } from "@/components/ui/shader-animation"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0A1628] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-in-up">
            <div className="inline-block px-4 py-2 bg-[#f59e0b]/20 rounded-full mb-6">
              <span className="text-sm font-medium text-[#f59e0b]">Welcome to Bits&Bytes Prayagraj</span>
            </div>
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
              <Link
                href="/join"
                prefetch={true}
                className="inline-flex items-center justify-center px-8 py-3 bg-[#0d9488] text-white rounded-full font-medium hover:bg-[#0f766e] transition-all hover:shadow-lg hover:shadow-[#0d9488]/30 group"
              >
                Join the Community <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#0d9488] text-[#0d9488] rounded-full font-medium hover:bg-[#0d9488]/10 transition-colors"
              >
                Our Story
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-sm text-white/70">Follow us:</span>
              <a href="https://github.com/bitsnbytes-pryj" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#0d9488]/20 rounded-full transition-colors group">
                <Github size={20} className="text-white group-hover:text-[#f59e0b]" />
              </a>
              <a href="https://www.linkedin.com/company/bitsnbytes-prayagraj" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#0d9488]/20 rounded-full transition-colors group">
                <Linkedin size={20} className="text-white group-hover:text-[#f59e0b]" />
              </a>
              <a href="https://twitter.com/bitsnbytes_prj" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#0d9488]/20 rounded-full transition-colors group">
                <Twitter size={20} className="text-white group-hover:text-[#f59e0b]" />
              </a>
            </div>
          </div>

          {/* Right Visual: Shader animation + overlayed stats */}
          <div className="relative h-full min-h-[500px] animate-fade-in rounded-3xl overflow-hidden border border-[#0d9488]/40 bg-[#0A1628]">
            <ShaderAnimation />

            {/* Overlay content */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
              {/* Top pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-black/50 border border-white/10 px-3 py-1 text-[0.7rem] sm:text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-pulse" />
                At the Sangam
              </div>

              {/* Bottom stats card */}
              <div className="self-end w-full max-w-xs sm:max-w-sm">
                <div className="rounded-2xl bg-[#0A1628]/60 border border-white/10 px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-md text-white pointer-events-auto">
                  <p className="text-xs sm:text-sm font-medium text-white/70 mb-2">
                    Bits&Bytes Prayagraj
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-[#0d9488]">200+</p>
                      <p className="text-[0.65rem] sm:text-xs text-white/60">Members</p>
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-[#f59e0b]">15+</p>
                      <p className="text-[0.65rem] sm:text-xs text-white/60">Projects</p>
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-[#2dd4bf]">10+</p>
                      <p className="text-[0.65rem] sm:text-xs text-white/60">Schools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}