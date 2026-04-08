"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Rocket, 
  Calendar, 
  Code2, 
  ArrowRight,
  ChevronDown,
  Sparkles,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/ui/glass-container";

const EXPERIENCE_NODES = [
  {
    id: "welcome",
    title: "Welcome to Prayagraj",
    subtitle: "Where Rivers Converge, Code Flows",
    description: "Experience the Prayagraj chapter of Bits&Bytes — a community of ambitious teen builders at the sacred Sangam.",
    icon: MapPin,
    color: "#0d9488",
  },
  {
    id: "chapter",
    title: "The Chapter",
    subtitle: "Born at the Sangam",
    description: "Prayagraj's teen-led tech community, building real projects and hosting premium events.",
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
    description: "A tight crew of designers, engineers, and community leads powering Prayagraj's tech movement.",
    team: [
      { name: "Akshat K.", role: "Technical Lead" },
    ],
    icon: Users,
    color: "#22d3ee",
  },
  {
    id: "projects",
    title: "Projects Shipped",
    subtitle: "Built at the Sangam",
    description: "From AI tools to community platforms, our builders ship real products.",
    projects: [
      { name: "Bits&Bytes Platform", tech: "Next.js" },
      { name: "MedReady AI", tech: "AI/ML" },
    ],
    icon: Code2,
    color: "#8b5cf6",
  },
  {
    id: "events",
    title: "Events & Hackathons",
    subtitle: "Where Builders Gather",
    description: "Premium hackathons, workshops, and community gatherings. Real events, real outcomes.",
    icon: Calendar,
    color: "#ec4899",
  },
  {
    id: "join",
    title: "Join the Crew",
    subtitle: "Your Journey Starts Here",
    description: "Ready to build something meaningful? Join Prayagraj's most ambitious teen tech community.",
    cta: "Apply Now",
    icon: Rocket,
    color: "#10b981",
  },
];

function RiverParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#0d9488", "#22d3ee", "#f59e0b", "#fbbf24"];
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.3) * 0.8,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 300
      );
      gradient.addColorStop(0, "rgba(13, 148, 136, 0.15)");
      gradient.addColorStop(0.5, "rgba(245, 158, 11, 0.05)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - p.x;
        const dy = centerY - p.y + 100;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 50) {
          p.vx += (dx / dist) * 0.01;
          p.vy += (dy / dist) * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glowGradient.addColorStop(0, p.color);
        glowGradient.addColorStop(1, "transparent");
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

function ContentNode({
  node,
  index,
  isActive,
  onActivate,
}: {
  node: typeof EXPERIENCE_NODES[0];
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const Icon = node.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 + 0.5 }}
      className="absolute cursor-pointer group"
      style={{
        left: `${20 + (index % 3) * 30}%`,
        top: `${15 + Math.floor(index / 3) * 40}%`,
      }}
      onClick={onActivate}
    >
      <motion.div
        className="absolute inset-0 rounded-full border-2 opacity-30"
        style={{ borderColor: node.color }}
        animate={{
          scale: isActive ? [1, 1.3, 1] : [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive ? "scale-110" : "group-hover:scale-105"
        }`}
        style={{
          background: `linear-gradient(135deg, ${node.color}40, ${node.color}20)`,
          boxShadow: isActive
            ? `0 0 40px ${node.color}60`
            : `0 0 20px ${node.color}30`,
          border: `2px solid ${node.color}50`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color: node.color }} />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
        <p className="text-xs font-bold text-white/80">{node.title}</p>
      </div>
    </motion.div>
  );
}

function NodeDetailPanel({
  node,
  onClose,
}: {
  node: typeof EXPERIENCE_NODES[0] | null;
  onClose: () => void;
}) {
  if (!node) return null;

  const Icon = node.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg"
      >
        <GlassContainer className="p-6" glowColor="teal">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${node.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: node.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: node.color }}
                >
                  {node.subtitle}
                </p>
                <h3 className="text-xl font-display font-bold text-white mt-1">
                  {node.title}
                </h3>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              {node.description}
            </p>

            {node.stats && (
              <div className="grid grid-cols-3 gap-4">
                {node.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-white/60 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {node.team && (
              <div className="flex items-center gap-3">
                {node.team.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `${node.color}40` }}
                    >
                      {member.name[0]}
                    </div>
                    <span className="text-xs text-white/80">{member.name}</span>
                  </div>
                ))}
              </div>
            )}

            {node.projects && (
              <div className="space-y-2">
                {node.projects.map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-sm font-medium text-white">{project.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      {project.tech}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {node.cta && (
              <Link href="/join" className="block">
                <Button
                  className="w-full rounded-full py-6 text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${node.color}, ${node.color}cc)`,
                  }}
                >
                  {node.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}

            <p className="text-center text-xs text-white/40">
              Click anywhere to close
            </p>
          </div>
        </GlassContainer>
      </motion.div>
    </AnimatePresence>
  );
}

function NodeNavigation({
  nodes,
  activeIndex,
  onNavigate,
}: {
  nodes: typeof EXPERIENCE_NODES;
  activeIndex: number;
  onNavigate: (index: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
    >
      {nodes.map((node, index) => (
        <button
          key={node.id}
          onClick={() => onNavigate(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activeIndex === index
              ? "w-6"
              : "opacity-50 hover:opacity-100"
          }`}
          style={{
            background: activeIndex === index ? node.color : "white",
          }}
          aria-label={`Go to ${node.title}`}
        />
      ))}
    </motion.div>
  );
}

function KeyboardHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-4 text-xs text-white/40"
    >
      <span className="flex items-center gap-1">
        <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20">←</kbd>
        <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20">→</kbd>
        <span className="ml-1">Navigate</span>
      </span>
      <span className="flex items-center gap-1">
        <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20">ESC</kbd>
        <span className="ml-1">Exit</span>
      </span>
    </motion.div>
  );
}

export function ConfluenceScene({ onClose = () => {} }: { onClose?: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeNode = EXPERIENCE_NODES[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % EXPERIENCE_NODES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + EXPERIENCE_NODES.length) % EXPERIENCE_NODES.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          handleNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          handlePrev();
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0d1f35] to-[#0A1628]" />

      <RiverParticles />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative w-64 h-64"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border border-teal-500/20" />
          <div
            className="absolute inset-8 rounded-full border border-amber-500/20"
            style={{ animation: "spin 45s linear infinite reverse" }}
          />
          <div className="absolute inset-16 rounded-full bg-gradient-to-br from-teal-500/20 to-amber-500/20 blur-xl" />
        </motion.div>
      </div>

      <div className="relative w-full h-full">
        {EXPERIENCE_NODES.map((node, index) => (
          <ContentNode
            key={node.id}
            node={node}
            index={index}
            isActive={activeIndex === index}
            onActivate={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <div
        className="fixed inset-0 z-30"
        onClick={() => {
          handleNext();
        }}
      />
      <NodeDetailPanel
        node={activeNode}
        onClose={() => setActiveIndex((prev) => (prev + 1) % EXPERIENCE_NODES.length)}
      />

      <NodeNavigation
        nodes={EXPERIENCE_NODES}
        activeIndex={activeIndex}
        onNavigate={setActiveIndex}
      />
      <KeyboardHint />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-40 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/40"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
        <span className="text-xs">Scroll or use arrows</span>
      </motion.div>
    </div>
  );
}

export default ConfluenceScene;