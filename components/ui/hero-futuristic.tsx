"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import dynamic from "next/dynamic";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((mod) => mod.WebGLShader),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-purple)]/20 to-[var(--brand-pink)]/20" />
    ),
  },
);
import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/ui/glass-container";

const stats = [
  { value: "200+", label: "Active members" },
  { value: "15+", label: "Projects shipped" },
  { value: "10+", label: "Partner schools" },
];

export const HeroFuturistic = () => {
  return (
    <section className="relative overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] md:rounded-b-[3.5rem] text-white w-full max-w-full">
      <WebGLShader />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8 md:gap-12 px-4 pb-8 pt-16 sm:px-6 sm:pb-16 sm:pt-24 md:pb-20 md:pt-28 lg:flex-row lg:items-stretch lg:gap-16 box-border">
        {/* Left content card */}
        <div className="flex-[1.2] min-w-0">
          <GlassContainer
            className="p-6 sm:p-8 md:p-12"
            containerClassName="h-full"
          >
            <div className="flex flex-col h-full gap-8 md:gap-10">
              {/* Teen-led badge */}
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-white/80 backdrop-blur-md shadow-inner">
                <Sparkles className="h-3 w-3 text-(--brand-pink)" />
                TEEN-LED
              </span>

              {/* Main content */}
              <div className="space-y-6">
                <h1 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tighter drop-shadow-2xl">
                  India&apos;s boldest <br className="hidden sm:block" /> builders club
                </h1>
                <p className="text-base text-white/80 sm:text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed">
                  We host premium hackathons, design/dev squads, and real-world
                  launches—run entirely by students who want to ship things that
                  matter.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row w-full mt-2">
                <Button
                  asChild
                  className="h-14 px-8 rounded-full bg-(--brand-pink) text-base font-bold text-white shadow-[0_0_30px_rgba(228,90,146,0.5)] hover:shadow-[0_0_50px_rgba(228,90,146,0.7)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href="/join">
                    Join the crew
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-14 px-8 rounded-full border-white/20 bg-white/5 text-base font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-all hover:scale-[1.02]"
                >
                  <Link href="/impact">See what we&apos;ve built</Link>
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="mt-auto grid grid-cols-3 gap-4 sm:gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <p className="text-xl sm:text-3xl font-black text-white">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassContainer>
        </div>

        {/* Right image card - Archive highlight */}
        <div className="relative flex-1 min-w-0">
          <GlassContainer
            className="h-full aspect-[4/5] lg:aspect-auto"
            containerClassName="h-full"
            glowColor="purple"
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg"
                alt="Scrapyard Lucknow teens building together"
                fill
                className="object-cover opacity-60 mix-blend-overlay"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[0.65rem] font-bold uppercase tracking-widest text-white/70">
                  Archive highlight
                </span>
                <h3 className="font-display text-2xl font-black text-white">
                  Scrapyard Lucknow · 2025
                </h3>
              </div>
            </div>
          </GlassContainer>
        </div>
      </div>
    </section>
  );
};

export default HeroFuturistic;
