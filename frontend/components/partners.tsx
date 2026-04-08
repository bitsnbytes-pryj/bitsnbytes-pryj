"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageSection } from "@/components/page-section";
import { ExternalLink, Sparkles, Cpu, Zap, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";

const strategicPartners = [
  {
    name: "osmAPI",
    logo: "/partners/OSM-API-Light-BBO_4Eff.png",
    url: "https://www.osmapi.com/",
    role: "API Partner",
    description: "One Awesome API for everything AI. Route to OpenAI, Anthropic, Google & 14+ LLM providers.",
    features: ["Universal Router", "Multi-model", "Fast Inference"],
    color: "blue",
    icon: <Cpu className="w-5 h-5 text-blue-500" />,
  },
  {
    name: "YRI Fellowship",
    logo: "/partners/yri.png",
    url: "https://www.yriscience.com/",
    role: "Knowledge Partner",
    description: "Advancing scientific research and building the next generation of innovators through the fellowship.",
    features: ["Research Hub", "Fellowships", "Open Science"],
    color: "purple",
    icon: <Sparkles className="w-5 h-5 text-(--brand-purple)" />,
  },
  {
    name: "z.ai",
    logo: "/partners/zai.svg",
    url: "https://chat.z.ai/",
    role: "AI Partner",
    description: "Intelligent chat experiences and frontier language model integrations for the modern developer.",
    features: ["Neural Chat", "LLM Native", "Agentic IC"],
    color: "pink",
    icon: <Zap className="w-5 h-5 text-(--brand-pink)" />,
  },
];

export function Partners() {
  return (
    <PageSection
      eyebrow="Ecosystem"
      title="Our Strategic Partners"
      description="We collaborate with industry leaders to unlock new opportunities for teen builders."
      align="center"
      className="pb-24 relative overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 max-w-7xl mx-auto px-4 relative z-10">
        {strategicPartners.map((partner, index) => (
          <CardContainer key={partner.name} className="inter-var w-full">
            <CardBody className="bg-black/40 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-white/[0.1] w-full h-[520px] rounded-3xl p-8 border glass-card transition-all duration-300">
              <CardItem
                translateZ="50"
                className="mb-8"
              >
                <div className={`h-10 relative w-32 filter brightness-200 contrast-150 ${partner.name === "z.ai" ? "invert" : ""}`}>
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain object-left grayscale group-hover/card:grayscale-0 transition-all duration-500"
                  />
                </div>
              </CardItem>
              
              <CardItem
                as="p"
                translateZ="60"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-(--brand-pink) mb-2"
              >
                {partner.role}
              </CardItem>
              
              <CardItem
                translateZ="70"
                className="text-3xl font-black text-white tracking-tighter mb-4"
              >
                {partner.name}
              </CardItem>
              
              <CardItem
                as="p"
                translateZ="80"
                className="text-sm text-white/50 leading-relaxed font-medium mb-12"
              >
                {partner.description}
              </CardItem>
              
              <CardItem translateZ="90" className="flex flex-wrap gap-2 mb-12">
                {partner.features.map(feat => (
                  <span 
                    key={feat} 
                    className="text-[10px] px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/40 font-bold uppercase tracking-wider group-hover/card:text-white/60 transition-colors"
                  >
                    {feat}
                  </span>
                ))}
              </CardItem>
              
              <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/5">
                <CardItem
                  translateZ={100}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-white/10 bg-white/5 text-white font-black hover:bg-(--brand-pink) hover:border-(--brand-pink) hover:text-white transition-all group-hover/card:translate-x-1"
                    asChild
                  >
                    <Link href={partner.url} target="__blank">
                      Visit Platform
                      <Globe className="w-3.5 h-3.5 ml-2 opacity-50" />
                    </Link>
                  </Button>
                </CardItem>
                <CardItem
                  translateZ={100}
                  className="p-3 rounded-full bg-white/[0.03] border border-white/5 text-white/20 group-hover/card:bg-white/[0.08] group-hover/card:border-white/10 group-hover/card:text-white transition-all shadow-inner"
                >
                  {partner.icon}
                </CardItem>
              </div>

              {/* Decorative Corner Glow */}
              <div 
                className={`absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-0 filter blur-3xl pointer-events-none group-hover/card:opacity-20 transition-opacity duration-1000 ${
                  partner.color === "pink" ? "bg-(--brand-pink)" : "bg-(--brand-purple)"
                }`} 
              />
            </CardBody>
          </CardContainer>
        ))}
      </div>
      
      {/* Background Section Ambient Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 w-full h-[120%] opacity-20 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-(--brand-pink) rounded-full filter blur-[200px] opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-(--brand-purple) rounded-full filter blur-[200px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </PageSection>
  );
}
