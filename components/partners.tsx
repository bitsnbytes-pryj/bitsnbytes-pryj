"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PageSection } from "@/components/page-section";
import { ExternalLink, Sparkles, Shield, Cpu, Zap } from "lucide-react";

const strategicPartners = [
  {
    name: "osmAPI",
    logo: "/partners/OSM-API-Light-BBO_4Eff.png",
    url: "https://www.osmapi.com/",
    role: "AI Gateway Partner",
    description: "One Awesome API for everything AI. Route to multiple AI providers, track usage, optimize costs, and scale with confidence through a unified OpenAI-compatible gateway.",
    features: ["Unified AI Gateway", "15+ Providers", "Smart Cost Routing"],
    color: "pink",
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    name: "YRI Science",
    logo: "/partners/yri.png",
    url: "https://www.yriscience.com/",
    role: "Knowledge Partner",
    description: "Advancing scientific research and education. Empowering the next generation of researchers with cutting-edge knowledge systems.",
    features: ["Scientific Research", "Education Tech", "Knowledge Systems"],
    color: "purple",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    name: "z.ai",
    logo: "/partners/zai.svg",
    url: "https://chat.z.ai/",
    role: "AI Interaction Partner",
    description: "Building the future of intelligent chat and language models. Powering human-like interactions across our digital ecosystem.",
    features: ["Intelligent Chat", "Custom Models", "Neural Interaction"],
    color: "pink",
    icon: <Zap className="w-5 h-5" />,
  },
];

export function Partners() {
  return (
    <PageSection
      eyebrow="Ecosystem"
      title="Partnered with Industry Leaders"
      description="We collaborate with cutting-edge technology partners to deliver exceptional AI development tools and hardware."
      align="center"
      className="pb-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto px-4">
        {strategicPartners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
          >
            {/* Animated Glow Backdrop */}
            <div 
              className={`absolute -inset-1 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl pointer-events-none bg-gradient-to-br ${
                partner.color === "pink" 
                  ? "from-(--brand-pink)/30 to-(--brand-purple)/0" 
                  : "from-(--brand-purple)/30 to-(--brand-pink)/0"
              }`} 
            />

            <div className="relative h-full flex flex-col glass-card border-white/5 bg-white/[0.02] p-8 md:p-10 rounded-[2rem] overflow-hidden group-hover:bg-white/[0.04] transition-colors duration-500">
              {/* Top Accent Icon */}
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 text-white`}>
                {partner.icon}
              </div>

              {/* Logo Section */}
              <div className="h-16 mb-8 relative">
                <div className="relative w-full h-full filter brightness-110 contrast-125 opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>

              {/* Title & Role */}
              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-(--brand-pink)">
                  {partner.role}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tighter">
                  {partner.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-white/50 leading-relaxed font-medium mb-8">
                {partner.description}
              </p>

              {/* Features Chips */}
              <div className="flex flex-wrap gap-2 mb-10">
                {partner.features.map(feat => (
                  <span key={feat} className="text-[10px] px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-white/40 font-bold uppercase tracking-wider group-hover:border-white/10 group-hover:text-white/60 transition-all duration-300">
                    {feat}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <Link
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-white px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-(--brand-pink) hover:border-(--brand-pink) transition-all duration-300 shadow-xl group/btn"
                >
                  Visit Platform
                  <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 translate-y-[1px] group-hover/btn:translate-x-0.5 transition-all" />
                </Link>
              </div>

              {/* Decorative Corner Glow */}
              <div 
                className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20 filter blur-3xl pointer-events-none group-hover:opacity-40 transition-opacity duration-700 ${
                  partner.color === "pink" ? "bg-(--brand-pink)" : "bg-(--brand-purple)"
                }`} 
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Background Section Ambient Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-[120%] opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-(--brand-pink) rounded-full filter blur-[180px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-(--brand-purple) rounded-full filter blur-[180px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </PageSection>
  );
}
