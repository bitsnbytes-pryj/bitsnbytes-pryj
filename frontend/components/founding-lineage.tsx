"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export function FoundingLineage() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Subtle background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10" />

          <div className="relative p-6 sm:p-8">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                <span className="text-lg">🌱</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg">Our Roots</h3>
                <p className="text-white/50 text-xs uppercase tracking-widest">Where it began</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                <span className="text-white font-semibold">Bits&Bytes</span> was founded by a team of ambitious teen builders 
                who believed students could ship real, production-grade products — not just toys.
              </p>

              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                The <span className="text-teal-400 font-semibold">Prayagraj chapter</span> carries this vision forward at the 
                sacred Sangam, building on the foundation laid by the original team while forging our own path.
              </p>

              {/* Attribution line */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
                <span className="text-white/40 text-xs">Founded by</span>
                <div className="flex flex-wrap gap-2">
                  {["Yash Singh", "Aadrika Maurya", "Akshat Kushwaha", "Devaansh Pathak"].map((name, i) => (
                    <span
                      key={name}
                      className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/60"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link to original */}
              <div className="flex items-center gap-4 pt-4">
                <Link
                  href="https://github.com/gobitsnbytes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors group"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View original foundation</span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 transition-colors group"
                >
                  <span>Our full story</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Compact version for footer or sidebar
export function FoundingLineageCompact() {
  return (
    <div className="flex items-center gap-2 text-white/40 text-xs">
      <span>A chapter of</span>
      <Link
        href="https://gobitsnbytes.org"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white/60 transition-colors underline underline-offset-2"
      >
        Bits&Bytes
      </Link>
      <span>· Founded 2024</span>
    </div>
  );
}

export default FoundingLineage;