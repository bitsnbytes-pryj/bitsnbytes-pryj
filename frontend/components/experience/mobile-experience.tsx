"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Rocket,
  Calendar,
  Code2,
  ArrowRight,
  Sparkles,
  MapPin,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/ui/glass-container";

const EXPERIENCE_SECTIONS = [
  {
    id: "welcome",
    title: "Welcome to Prayagraj",
    subtitle: "Where Rivers Converge, Code Flows",
    description:
      "Experience the Prayagraj chapter of Bits&Bytes — a community of ambitious teen builders at the sacred Sangam.",
    icon: MapPin,
    color: "#0d9488",
  },
  {
    id: "chapter",
    title: "The Chapter",
    subtitle: "Born at the Sangam",
    description:
      "Prayagraj's teen-led tech community, building real projects and hosting premium events.",
    stats: [
      { value: "100+", label: "Builders" },
      { value: "25+", label: "Projects" },
      { value: "12+", label: "Events" },
    ],
    icon: Sparkles,
    color: "#f59e0b",
  },
  {
    id: "team",
    title: "Meet the Team",
    subtitle: "Prayagraj Core Crew",
    description:
      "A tight crew of designers, engineers, and community leads powering Prayagraj's tech movement.",
    icon: Users,
    color: "#22d3ee",
  },
  {
    id: "projects",
    title: "Projects Shipped",
    subtitle: "Built at the Sangam",
    description:
      "From AI tools to community platforms, our builders ship real products.",
    projects: [
      { name: "Bits&Bytes Platform", tech: "Next.js", description: "This very platform" },
      { name: "MedReady AI", tech: "AI/ML", description: "Healthcare readiness platform" },
    ],
    icon: Code2,
    color: "#8b5cf6",
  },
  {
    id: "events",
    title: "Events & Hackathons",
    subtitle: "Where Builders Gather",
    description:
      "Premium hackathons, workshops, and community gatherings. Real events, real outcomes.",
    icon: Calendar,
    color: "#ec4899",
  },
  {
    id: "join",
    title: "Join the Crew",
    subtitle: "Your Journey Starts Here",
    description:
      "Ready to build something meaningful? Join Prayagraj's most ambitious teen tech community.",
    cta: "Apply Now",
    icon: Rocket,
    color: "#10b981",
  },
];

function SectionCard({
  section,
  index,
}: {
  section: (typeof EXPERIENCE_SECTIONS)[0];
  index: number;
}) {
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <GlassContainer
        className="p-6 space-y-4"
        glowColor={section.color === "#0d9488" ? "teal" : section.color === "#f59e0b" ? "amber" : "none"}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${section.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: section.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: section.color }}
            >
              {section.subtitle}
            </p>
            <h3 className="text-xl font-display font-bold text-white mt-1">
              {section.title}
            </h3>
          </div>
        </div>

        <p className="text-white/70 text-sm leading-relaxed">
          {section.description}
        </p>

        {section.stats && (
          <div className="grid grid-cols-3 gap-4 pt-2">
            {section.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-2xl font-black"
                  style={{ color: section.color }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-white/60 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {section.projects && (
          <div className="space-y-2">
            {section.projects.map((project) => (
              <div
                key={project.name}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white block">
                    {project.name}
                  </span>
                  <span className="text-xs text-white/50">{project.description}</span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full ml-2 shrink-0"
                  style={{
                    background: `${section.color}20`,
                    color: section.color,
                  }}
                >
                  {project.tech}
                </span>
              </div>
            ))}
          </div>
        )}

        {section.cta && (
          <Link href="/join" className="block pt-2">
            <Button
              className="w-full rounded-full py-6 text-sm font-bold group"
              style={{
                background: `linear-gradient(135deg, ${section.color}, ${section.color}cc)`,
              }}
            >
              {section.cta}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </GlassContainer>
    </motion.div>
  );
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
    </div>
  );
}

export function MobileExperience({ onClose = () => {} }: { onClose?: () => void }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0A1628] via-[#0d1f35] to-[#0A1628]">
      <AnimatedBackground />

      <div className="sticky top-0 z-40 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-amber-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">B&B</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-8 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Experience Mode
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight">
            Prayagraj
            <br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
              Chapter
            </span>
          </h1>

          <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto">
            Scroll to explore the story of Prayagraj's teen-led tech community at the sacred Sangam.
          </p>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="pt-4"
          >
            <ChevronRight className="w-6 h-6 text-white/40 rotate-90 mx-auto" />
          </motion.div>
        </motion.div>
      </div>

      <div className="px-4 pb-32 space-y-6">
        {EXPERIENCE_SECTIONS.map((section, index) => (
          <SectionCard key={section.id} section={section} index={index} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A1628] via-[#0A1628] to-transparent pt-12 z-30">
        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-full py-5 border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
          </Link>
          <Link href="/join" className="flex-1">
            <Button className="w-full rounded-full py-5 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold">
              Join Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MobileExperience;