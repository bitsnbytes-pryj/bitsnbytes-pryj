"use client";

import { motion } from "framer-motion";
import { Sparkles, Rocket, Users, Code2, Calendar, MapPin } from "lucide-react";

const timelineEvents = [
  {
    year: "2024",
    quarter: "Q4",
    title: "Bits&Bytes Foundation",
    description: "The original Bits&Bytes community was founded, establishing a model for teen-led tech communities.",
    icon: Sparkles,
    color: "#f59e0b",
    isFoundation: true,
  },
  {
    year: "2025",
    quarter: "Q1",
    title: "Prayagraj Chapter Forms",
    description: "Akshat Kushwaha establishes the Prayagraj chapter at the Sangam, bringing high-agency builder culture to the city.",
    icon: MapPin,
    color: "#0d9488",
    isPrayagraj: true,
  },
  {
    year: "2025",
    quarter: "Q2",
    title: "First 50 Builders",
    description: "Prayagraj chapter reaches 50 active members, hosting regular hack nights and workshops.",
    icon: Users,
    color: "#22d3ee",
  },
  {
    year: "2025",
    quarter: "Q3",
    title: "Platform Launch",
    description: "Bits&Bytes Prayagraj platform ships with AI assistant, project showcases, and community features.",
    icon: Code2,
    color: "#8b5cf6",
  },
  {
    year: "2025",
    quarter: "Q4",
    title: "100+ Members Strong",
    description: "Chapter doubles in size. First flagship hackathon hosted in Prayagraj with 80+ participants.",
    icon: Rocket,
    color: "#ec4899",
  },
  {
    year: "2026",
    quarter: "Now",
    title: "Building the Future",
    description: "Active events, shipping projects, and growing Prayagraj's most ambitious teen tech community.",
    icon: Calendar,
    color: "#10b981",
    isCurrent: true,
  },
];

export function ChapterTimeline() {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-400 mb-2">
            Our Journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            Chapter Timeline
          </h2>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            From foundation to Prayagraj's present — building something real at the Sangam.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-teal-500/50 to-emerald-500/50" />

          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={`${event.year}-${event.quarter}`}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-8 last:mb-0 ${
                  isLeft ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content Card */}
                <div
                  className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                    isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                  }`}
                >
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all hover:scale-[1.02] ${
                      event.isPrayagraj
                        ? "bg-teal-500/10 border-teal-500/30"
                        : event.isFoundation
                        ? "bg-amber-500/10 border-amber-500/30"
                        : event.isCurrent
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${event.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: event.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-bold"
                            style={{ color: event.color }}
                          >
                            {event.year} {event.quarter}
                          </span>
                          {event.isPrayagraj && (
                            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                              Prayagraj
                            </span>
                          )}
                          {event.isFoundation && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                              Foundation
                            </span>
                          )}
                          {event.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                              Current
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Dot */}
                <div
                  className="absolute left-4 md:left-1/2 w-2 h-2 rounded-full -translate-x-1/2"
                  style={{
                    background: event.color,
                    boxShadow: `0 0 20px ${event.color}80`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ChapterTimeline;