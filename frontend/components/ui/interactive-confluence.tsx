"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformanceTier, useMousePosition } from "@/lib/hooks";
import { X, Sparkles, Code, Users, Calendar } from "lucide-react";

interface ConfluenceNode {
  id: string;
  type: "project" | "team" | "event";
  title: string;
  description: string;
  x: number;
  y: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const sampleNodes: ConfluenceNode[] = [
  { id: "1", type: "project", title: "Web Platform", description: "Building the next-gen web experience", x: 0.2, y: 0.35, color: "#0d9488" },
  { id: "2", type: "team", title: "Core Team", description: "10 passionate builders", x: 0.75, y: 0.3, color: "#22d3ee" },
  { id: "3", type: "event", title: "Hackathon 2024", description: "48 hours of innovation", x: 0.5, y: 0.55, color: "#f59e0b" },
  { id: "4", type: "project", title: "Mobile App", description: "iOS & Android apps", x: 0.18, y: 0.65, color: "#0d9488" },
  { id: "5", type: "team", title: "Design Crew", description: "Crafting beautiful UIs", x: 0.82, y: 0.55, color: "#22d3ee" },
];

const typeIcons = {
  project: Code,
  team: Users,
  event: Calendar,
};

/**
 * Interactive Confluence Map - The "WOW Factor" feature
 * A full-viewport interactive visualization of the river confluence concept
 */
export function InteractiveConfluence({
  className,
  nodes = sampleNodes,
}: {
  className?: string;
  nodes?: ConfluenceNode[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const dimensionsRef = useRef({ width: 0, height: 0 }); // Use ref to avoid re-render loop
  
  const { canUseParticles, canUseComplexAnimations, reducedMotion, tier } = usePerformanceTier();
  const [selectedNode, setSelectedNode] = useState<ConfluenceNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ConfluenceNode | null>(null);
  const [tiltState, setTiltState] = useState<{ id: string; rotateX: number; rotateY: number } | null>(null);
  const [, forceRender] = useState(0); // For triggering re-renders when needed
  
  const isEnabled = canUseParticles && !reducedMotion;

  // Initialize particles
  useEffect(() => {
    if (!isEnabled) return;
    
    const particleCount = tier === "high" ? 100 : tier === "mid" ? 50 : 20;
    const colors = ["#0d9488", "#22d3ee", "#f59e0b", "#14b8a6"];
    
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: Math.random() * 0.001 + 0.0005, // Flow downward
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [isEnabled, tier]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !isEnabled) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      dimensionsRef.current = { width: rect.width, height: rect.height };
      forceRender(n => n + 1); // Trigger re-render for node positioning
    };
    resize();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw river paths (confluence effect)
      drawRivers(ctx, width, height, mouseRef.current);

      // Update and draw particles
      if (canUseParticles) {
        particlesRef.current = particlesRef.current.filter((p) => {
          // Update position
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          // Mouse attraction
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.2) {
            p.vx += dx * 0.00005;
            p.vy += dy * 0.00005;
          }

          // Reset if out of bounds or dead
          if (p.x < 0 || p.x > 1 || p.y > 1 || p.life > p.maxLife) {
            p.x = Math.random();
            p.y = -0.1;
            p.vx = (Math.random() - 0.5) * 0.002;
            p.vy = Math.random() * 0.001 + 0.0005;
            p.life = 0;
          }

          // Draw particle
          const opacity = 1 - p.life / p.maxLife;
          ctx.beginPath();
          ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(")", `, ${opacity * 0.6})`).replace("rgb", "rgba").replace("#", "");
          // Convert hex to rgba
          const hexMatch = p.color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
          if (hexMatch) {
            const r = parseInt(hexMatch[1], 16);
            const g = parseInt(hexMatch[2], 16);
            const b = parseInt(hexMatch[3], 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`;
          }
          ctx.fill();

          return true;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isEnabled, canUseParticles]);

  // Draw river paths
  const drawRivers = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    mouse: { x: number; y: number }
  ) => {
    const time = Date.now() * 0.001;

    // River 1 (Ganga - teal)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let y = 0; y <= height; y += 5) {
      const x = width * 0.35 + Math.sin(y * 0.01 + time * 0.5) * 30;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(13, 148, 136, 0.15)";
    ctx.lineWidth = 60;
    ctx.stroke();

    // River 2 (Yamuna - cyan)
    ctx.beginPath();
    ctx.moveTo(width, 0);
    for (let y = 0; y <= height; y += 5) {
      const x = width * 0.65 + Math.cos(y * 0.012 - time * 0.4) * 25;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(34, 211, 238, 0.12)";
    ctx.lineWidth = 50;
    ctx.stroke();

    // River 3 (Saraswati - gold, mythical/hidden)
    ctx.beginPath();
    ctx.moveTo(width * 0.5, 0);
    for (let y = 0; y <= height; y += 5) {
      const x = width * 0.5 + Math.sin(y * 0.008 + time * 0.3) * 20;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(245, 158, 11, 0.08)";
    ctx.lineWidth = 40;
    ctx.stroke();

    // Confluence glow
    const gradient = ctx.createRadialGradient(
      width * 0.5, height * 0.5, 0,
      width * 0.5, height * 0.5, width * 0.3
    );
    gradient.addColorStop(0, "rgba(13, 148, 136, 0.1)");
    gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.05)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  // Node click handler
  const handleNodeClick = (node: ConfluenceNode) => {
    setSelectedNode(node);
  };

  if (!isEnabled) {
    // Static fallback
    return (
      <div className={cn("relative w-full h-[600px] bg-gradient-to-br from-[#0a1628] to-[#0f172a]", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-[#0d9488] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">The Confluence</h3>
            <p className="text-white/60 mt-2">Where ideas meet and grow</p>
          </div>
        </div>
        <div className="absolute inset-0 grid grid-cols-3 gap-8 p-8">
          {nodes.slice(0, 3).map((node) => (
            <div
              key={node.id}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              {React.createElement(typeIcons[node.type], { className: "w-8 h-8 mb-2", style: { color: node.color } })}
              <span className="font-medium text-white">{node.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative w-full h-[600px] md:h-[700px] overflow-hidden", className)}>
      {/* Canvas for rivers and particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Node markers with enhanced interactions */}
      {dimensionsRef.current.width > 0 && nodes.map((node, index) => {
        const Icon = typeIcons[node.type];
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        
        return (
          <motion.button
            key={node.id}
            className="absolute z-10"
            style={{
              left: `${node.x * 100}%`,
              top: `${node.y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -8, 0], // Floating animation
            }}
            transition={{ 
              opacity: { duration: 0.5, delay: index * 0.1 },
              scale: { duration: 0.5, delay: index * 0.1 },
              y: { 
                duration: 3 + (index * 0.5), 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: index * 0.3 
              }
            }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(node)}
            whileHover={{ scale: 1.15, y: 0 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Outer glow ring - only on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ 
                background: `radial-gradient(circle, ${node.color}30 0%, transparent 70%)`,
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ 
                scale: isHovered ? 2.5 : 1, 
                opacity: isHovered ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Orbital ring */}
            <motion.div
              className="absolute -inset-3 rounded-full pointer-events-none"
              style={{ 
                border: `2px solid ${node.color}`,
                opacity: isHovered ? 0.6 : 0.2,
              }}
              animate={{ 
                rotate: 360,
                scale: isHovered ? 1.3 : 1.1,
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.3 }
              }}
            />
            
            {/* Secondary orbital ring - opposite direction */}
            <motion.div
              className="absolute -inset-5 rounded-full pointer-events-none"
              style={{ 
                border: `1px solid ${node.color}`,
                opacity: isHovered ? 0.4 : 0.1,
              }}
              animate={{ 
                rotate: -360,
                scale: isHovered ? 1.4 : 1,
              }}
              transition={{ 
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.3 }
              }}
            />

            {/* Main icon container with glassmorphism and 3D perspective */}
            <motion.div
              className={cn(
                "relative p-4 rounded-2xl cursor-pointer",
                "backdrop-blur-xl border"
              )}
              style={{
                background: isHovered 
                  ? `linear-gradient(135deg, ${node.color}25, ${node.color}10, transparent)`
                  : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                borderColor: isHovered ? `${node.color}60` : 'rgba(255,255,255,0.2)',
                boxShadow: isHovered 
                  ? `0 8px 32px ${node.color}30, 0 0 60px ${node.color}20, inset 0 1px 0 rgba(255,255,255,0.2)`
                  : '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
              animate={{
                rotateX: isHovered ? (tiltState?.id === node.id ? tiltState.rotateX : 15) : 0,
                rotateY: isHovered ? (tiltState?.id === node.id ? tiltState.rotateY : -15) : 0,
                translateZ: isHovered ? 20 : 0,
              }}
              transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 20 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -20; // Max 20 degrees
                const rotateY = ((x - centerX) / centerX) * 20;
                setTiltState({ id: node.id, rotateX, rotateY });
              }}
              onMouseLeave={() => {
                setTiltState(null);
                setHoveredNode(null);
              }}
            >
              {/* Icon */}
              <motion.div
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon 
                  className="w-8 h-8" 
                  style={{ 
                    color: node.color,
                    filter: isHovered ? `drop-shadow(0 0 8px ${node.color})` : 'none'
                  }} 
                />
              </motion.div>
              
              {/* Inner glow pulse */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${node.color}20, transparent 70%)`,
                }}
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              />
              
              {/* Sparkle particles on hover */}
              {isHovered && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ 
                        background: node.color,
                        boxShadow: `0 0 4px ${node.color}`,
                      }}
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        opacity: 1,
                        scale: 0 
                      }}
                      animate={{ 
                        x: Math.cos((i * Math.PI) / 2) * 30,
                        y: Math.sin((i * Math.PI) / 2) * 30,
                        opacity: 0,
                        scale: [0, 1.5, 0],
                      }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity,
                        delay: i * 0.15 
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
            
            {/* Label with enhanced styling */}
            <motion.div
              className="absolute left-1/2 mt-4 whitespace-nowrap pointer-events-none"
              style={{ transform: 'translateX(-50%)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0.6, 
                y: isHovered ? 0 : 5,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <span 
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                  background: isHovered ? `${node.color}20` : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${isHovered ? node.color + '40' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {node.title}
              </span>
            </motion.div>
          </motion.button>
        );
      })}

      {/* Selected node detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute inset-x-4 bottom-4 md:left-1/2 md:-translate-x-1/2 md:w-96 p-6 rounded-2xl z-20"
            style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
            
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${selectedNode.color}30, transparent)` }}
              >
                {React.createElement(typeIcons[selectedNode.type], {
                  className: "w-6 h-6",
                  style: { color: selectedNode.color },
                })}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">{selectedNode.title}</h4>
                <p className="text-sm text-white/60 mt-1">{selectedNode.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title overlay */}
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white">The Confluence</h3>
        <p className="text-white/60 mt-1">Where ideas meet and grow together</p>
      </div>

      {/* Legend */}
      <div className="absolute top-6 right-6 z-10 hidden md:flex flex-col gap-2">
        {[
          { label: "Projects", color: "#0d9488", icon: Code },
          { label: "Team", color: "#22d3ee", icon: Users },
          { label: "Events", color: "#f59e0b", icon: Calendar },
        ].map(({ label, color, icon: Icon }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-white/60">
            <Icon className="w-3 h-3" style={{ color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InteractiveConfluence;