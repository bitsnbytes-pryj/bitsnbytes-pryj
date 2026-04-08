"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ExternalLink, Github, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  live?: string;
  color: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Bits&Bytes Platform",
    description: "The main community platform built with Next.js, featuring real-time updates and member management.",
    image: "/projects/platform.png",
    tags: ["Next.js", "TypeScript", "Supabase"],
    github: "https://github.com/bitsnbytes-pryj",
    color: "#0d9488",
  },
  {
    id: "2",
    title: "MedReady AI",
    description: "AI-powered medication reminder and interaction checker for better health management.",
    image: "/projects/medready.png",
    tags: ["AI/ML", "Python", "React"],
    color: "#f59e0b",
  },
  {
    id: "3",
    title: "Event Check-in",
    description: "QR-based event check-in system for seamless hackathon and workshop management.",
    image: "/projects/checkin.png",
    tags: ["QR Code", "Node.js", "MongoDB"],
    color: "#8b5cf6",
  },
  {
    id: "4",
    title: "Community Bot",
    description: "Discord bot for community engagement with moderation and fun commands.",
    image: "/projects/bot.png",
    tags: ["Discord.js", "Node.js", "AI"],
    color: "#22d3ee",
  },
  {
    id: "5",
    title: "Portfolio Generator",
    description: "Generate stunning developer portfolios from your GitHub profile automatically.",
    image: "/projects/portfolio.png",
    tags: ["GitHub API", "Next.js", "Tailwind"],
    color: "#ec4899",
  },
];

function ProjectCard({ project, index, activeIndex }: { project: Project; index: number; activeIndex: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isActive = index === activeIndex;
  const isPrev = index === (activeIndex - 1 + projects.length) % projects.length;
  const isNext = index === (activeIndex + 1) % projects.length;
  
  // Calculate position and rotation
  const getCardStyle = () => {
    if (isActive) {
      return {
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
      };
    } else if (isPrev) {
      return {
        x: -280,
        z: -100,
        rotateY: 25,
        scale: 0.85,
        opacity: 0.7,
      };
    } else if (isNext) {
      return {
        x: 280,
        z: -100,
        rotateY: -25,
        scale: 0.85,
        opacity: 0.7,
      };
    } else {
      return {
        x: index < activeIndex ? -400 : 400,
        z: -200,
        rotateY: index < activeIndex ? 45 : -45,
        scale: 0.7,
        opacity: 0,
      };
    }
  };

  const style = getCardStyle();

  // Mouse tracking for 3D effect on active card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute w-80 h-96 cursor-pointer"
      style={{
        x: style.x,
        z: style.z,
        rotateY: isActive ? rotateY : style.rotateY,
        rotateX: isActive ? rotateX : 0,
        scale: style.scale,
        opacity: style.opacity,
        transformStyle: "preserve-3d",
        zIndex: isActive ? 10 : 1,
      }}
      animate={{
        x: style.x,
        scale: style.scale,
        opacity: style.opacity,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="w-full h-full rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${project.color}20, #0A1628 50%)`,
          boxShadow: isActive ? `0 25px 50px -12px ${project.color}40` : "none",
        }}
      >
        {/* Project Image */}
        <div className="relative h-44 w-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${project.color}40 0%, transparent 100%)`,
            }}
          />
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          
          {/* Shine effect */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 
            className="text-xl font-bold text-white mb-2"
            style={{ textShadow: `0 0 20px ${project.color}60` }}
          >
            {project.title}
          </h3>
          
          <p className="text-white/70 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full border border-white/20 bg-white/5 text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4" />
                Code
              </motion.a>
            )}
            {project.live && (
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
                Live
              </motion.a>
            )}
          </div>
        </div>

        {/* Glow effect for active card */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 60px ${project.color}20, 0 0 30px ${project.color}30`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

export function Projects3DCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  return (
    <div className="relative w-full">
      {/* Carousel container */}
      <div 
        className="relative h-[450px] w-full flex items-center justify-center"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            activeIndex={activeIndex}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          onClick={handlePrev}
          className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        {/* Dots indicator */}
        <div className="flex gap-2">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8"
                  : "opacity-50 hover:opacity-100"
              }`}
              style={{
                background: index === activeIndex ? project.color : "white",
              }}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default Projects3DCarousel;