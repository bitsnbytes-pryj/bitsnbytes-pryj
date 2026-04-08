"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ExternalLink, Github, Filter, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Note: Metadata must be in a separate layout.tsx or use generateMetadata for client components
// For now, the page title will be set via the layout

// Lazy load WebGL shader
const WebGLShader = dynamic(
  () =>
    import("@/components/ui/web-gl-shader").then((mod) => ({
      default: mod.WebGLShader,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

type ProjectCategory = "all" | "web" | "ai" | "mobile" | "tools" | "design";

interface Project {
  id: string;
  title: string;
  description: string;
  category: Exclude<ProjectCategory, "all">;
  image: string;
  tags: string[];
  team: string[];
  links?: {
    live?: string;
    github?: string;
  };
  featured?: boolean;
}

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "web", label: "Web Apps" },
  { value: "ai", label: "AI & ML" },
  { value: "mobile", label: "Mobile" },
  { value: "tools", label: "Dev Tools" },
  { value: "design", label: "Design" },
];

const projects: Project[] = [
  {
    id: "1",
    title: "Bits&Bytes Website",
    description:
      "The official platform you're browsing right now. Built with production-grade Next.js 14, featuring glassmorphism design, WebGL shaders, and agentic AI integrations.",
    category: "web",
    image: "/images/hero-img.jpeg",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "WebGL"],
    team: ["Akshat Singh Kushwaha", "Aadrika Maurya", "Devansh"],
    links: {
      live: "https://gobitsnbytes.org",
      github: "https://github.com/gobitsnbytes/website",
    },
    featured: true,
  },
  {
    id: "2",
    title: "Scrapyard Event Platform",
    description:
      "Registration and management platform for our flagship hackathon. Handled 80+ participant registrations, team formation, and project submissions in our 13-day sprint.",
    category: "web",
    image: "/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    team: ["Akshat Singh Kushwaha", "Devansh", "Areeb"],
    links: {
      live: "https://scrapyard.gobitsnbytes.org",
    },
    featured: true,
  },
  {
    id: "3",
    title: "StudyBuddy AI",
    description:
      "An AI-powered study assistant that helps students create flashcards, summarize notes, and generate practice questions from their study materials.",
    category: "ai",
    image: "/images/b653f79c-fcc9-49bb-a92a-4fc454659b3a-1-105-c.jpeg",
    tags: ["Python", "OpenAI", "FastAPI", "React"],
    team: ["Saksham", "Akshat Singh Kushwaha"],
    links: {
      github: "https://github.com/gobitsnbytes/studybuddy",
    },
  },
  {
    id: "4",
    title: "Club Connect Mobile",
    description:
      "A React Native app for club members to stay connected, view upcoming events, and collaborate on projects from their phones.",
    category: "mobile",
    image: "/images/4c59e5bb-c1eb-4e4d-9b69-f29faa693002-1-105-c.jpeg",
    tags: ["React Native", "Expo", "Firebase"],
    team: ["Maryam", "Yash Vardhan Singh"],
  },
  {
    id: "5",
    title: "DevMetrics Dashboard",
    description:
      "A developer productivity dashboard that tracks GitHub contributions, coding time, and project progress across the club.",
    category: "tools",
    image: "/images/hero-img.jpeg",
    tags: ["Next.js", "GitHub API", "Chart.js"],
    team: ["Devansh", "Areeb"],
    links: {
      github: "https://github.com/gobitsnbytes/devmetrics",
    },
  },
  {
    id: "6",
    title: "Brand Kit Generator",
    description:
      "A design tool that generates consistent brand assets, color palettes, and social media templates for student projects.",
    category: "design",
    image: "/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg",
    tags: ["Figma Plugin", "TypeScript", "Canvas API"],
    team: ["Aadrika Maurya", "Kaustubh"],
  },
  {
    id: "7",
    title: "Codiva",
    description:
      "A 5-star rated VS Code extension that gamifies coding, motivates developers with a distraction-free Pomodoro timer, and offers deep analytics on coding habits.",
    category: "tools",
    image: "/images/b653f79c-fcc9-49bb-a92a-4fc454659b3a-1-105-c.jpeg",
    tags: ["VS Code Extension", "TypeScript", "Node.js", "Analytics"],
    team: ["Yash Vardhan Singh"],
    links: {
      live: "https://marketplace.visualstudio.com/items?itemName=YASHVARDHANSINGH.codiva",
    },
  },
  {
    id: "8",
    title: "EventSnap",
    description:
      "A photo sharing and gallery platform specifically designed for hackathon events, with automatic face detection and tagging.",
    category: "web",
    image: "/images/4c59e5bb-c1eb-4e4d-9b69-f29faa693002-1-105-c.jpeg",
    tags: ["Next.js", "Cloudinary", "AWS Rekognition"],
    team: ["Oviyaa", "Kaustubh", "Devansh"],
  },
  {
    id: "11",
    title: "MedReady AI",
    description:
      "Workforce-readiness platform helping healthcare professionals train and move faster in underserved regions. Focused on access, clarity, and high-friction user movement.",
    category: "ai",
    image: "/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg",
    tags: ["Next.js 16", "Supabase", "Applied AI", "Healthcare Tech"],
    team: ["Akshat Kushwaha"],
  },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-24">
              <div className="relative border-2 border-teal-500/30 rounded-[32px] md:rounded-[40px] p-1.5 md:p-2 backdrop-blur-sm bg-black/10">
            <div className="relative border-2 border-teal-500/50 rounded-[28px] md:rounded-[36px] py-8 px-4 sm:px-10 overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-teal-500/10" />
              <div className="relative z-10 space-y-4 text-center">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/70">
                  Showcase
                </p>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight font-extrabold text-white">
                  Projects built by the crew
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
                  From web apps to AI tools, explore what our teen builders have
                  shipped. Every project here started as an idea in our Discord.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* Stats Bar */}
        <PageSection>
          <div className="glass-card relative isolate overflow-hidden p-6 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-teal-400">
                  25+
                </p>
                <p className="text-sm text-muted-foreground">
                  Projects shipped
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal-400">
                  100+
                </p>
                <p className="text-sm text-muted-foreground">Active members</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal-400">
                  10k+
                </p>
                <p className="text-sm text-muted-foreground">Impressions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal-400">
                  5k+
                </p>
                <p className="text-sm text-muted-foreground">Users served</p>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Featured Projects - 3D Enhanced */}
        <PageSection
          align="center"
          eyebrow="Featured"
          title="Flagship projects"
          description="Our most impactful builds that showcase what high-agency teen developers can accomplish together."
        >
          <div className="grid gap-8 md:grid-cols-2">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                className="glass-card group relative isolate overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: 2,
                  boxShadow: "0 25px 50px -12px rgba(13, 148, 136, 0.4)"
                }}
                style={{ 
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Animated glow border */}
                <motion.div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(135deg, #0d9488, #22d3ee, #0d9488)",
                    padding: "2px",
                  }}
                >
                  <div className="w-full h-full bg-[#0A1628] rounded-xl" />
                </motion.div>

                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Animated sparkle */}
                  <motion.div 
                    className="absolute top-4 right-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-[#f59e0b]" />
                  </motion.div>
                  
                  <div className="absolute top-4 left-4">
                    <motion.span 
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#0d9488] to-[#22d3ee] px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-[#0d9488]/30"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </motion.span>
                  </div>

                  {/* Shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground dark:text-white group-hover:text-[#0d9488] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-4">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, tagIdx) => (
                      <motion.span
                        key={tag}
                        className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: tagIdx * 0.1 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, i) => (
                        <motion.div
                          key={member}
                          className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-[#0d9488]/30 to-[#22d3ee]/30 flex items-center justify-center text-xs font-medium text-[#0d9488]"
                          style={{ zIndex: 3 - i }}
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                        >
                          {member[0]}
                        </motion.div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="h-8 w-8 rounded-full border-2 border-background bg-white/10 flex items-center justify-center text-xs text-muted-foreground">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.links?.github && (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full border border-white/20 hover:border-[#0d9488] hover:bg-[#0d9488]/10 transition-colors"
                          >
                            <Github className="h-4 w-4" />
                          </Link>
                        </motion.div>
                      )}
                      {project.links?.live && (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full border border-white/20 hover:border-[#0d9488] hover:bg-[#0d9488]/10 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* All Projects with Filter */}
        <PageSection
          align="center"
          eyebrow="All Projects"
          title="Browse the portfolio"
          description="Filter by category to find projects that interest you."
        >
          {/* Filter Toggle (Mobile) */}
          <div className="mb-6 md:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full rounded-full border-white/20"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filter Pills */}
          <div
            className={cn(
              "flex flex-wrap justify-center gap-2 mb-8",
              !showFilters && "hidden md:flex",
            )}
          >
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  activeCategory === category.value
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                    : "border border-white/20 bg-white/5 text-muted-foreground hover:border-white/40 hover:text-foreground",
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Active Filter Indicator */}
          {activeCategory !== "all" && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setActiveCategory("all")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
                Clear filter:{" "}
                {categories.find((c) => c.value === activeCategory)?.label}
              </button>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="glass-card group relative isolate overflow-hidden shadow-xl hover:shadow-[var(--glow-strong)] transition-all duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-display text-lg font-bold text-foreground dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      {project.team.join(", ")}
                    </p>
                    <div className="flex gap-1.5">
                      {project.links?.github && (
                        <Link
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 transition-colors"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      {project.links?.live && (
                        <Link
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No projects found in this category yet.
              </p>
              <Button
                variant="link"
                onClick={() => setActiveCategory("all")}
                className="mt-2 text-[var(--brand-pink)]"
              >
                View all projects
              </Button>
            </div>
          )}
        </PageSection>

        {/* CTA Section */}
        <PageSection align="center">
          <div className="glass-card relative isolate overflow-hidden p-8 md:p-12 text-center shadow-xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground dark:text-white">
              Have a project idea?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Join our club and turn your ideas into reality. We provide
              mentorship, resources, and a supportive community to help you
              ship.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:scale-105 transition-transform"
              >
                <Link href="/join">Join the Club</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20"
              >
                <Link href="/contact">Propose a Project</Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  );
}
