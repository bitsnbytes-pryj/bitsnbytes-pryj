"use client";

import Link from "next/link";
import {
  ArrowRight,
  CodeXml,
  Users,
  Rocket,
  Lightbulb,
  Trophy,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { HeroFuturistic } from "@/components/ui/hero-futuristic";
import { PageSection } from "@/components/page-section";
import { Features } from "@/components/ui/features-8";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingInline } from "@/components/loading-wrapper";
import { Partners } from "@/components/partners";

// Lazy load heavy components
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

const Testimonial = dynamic(
  () =>
    import("@/components/ui/design-testimonial").then((mod) => ({
      default: mod.Testimonial,
    })),
  {
    loading: () => <LoadingInline />,
    ssr: true,
  },
);

import { GlassContainer } from "@/components/ui/glass-container";
import { FoundingLineage } from "@/components/founding-lineage";
import { ExperienceLauncherCompact } from "@/components/experience/experience-launcher";

const stats = [
  { value: "100+", label: "Builders", detail: "across Prayagraj" },
  { value: "25+", label: "Projects shipped", detail: "from apps to AI" },
  { value: "12+", label: "Events hosted", detail: "at the Sangam" },
];

export default function Home() {
  return (
    <>
      <WebGLShader />
      <div className="flex flex-col w-full max-w-full overflow-x-hidden">
        <HeroFuturistic />

        <PageSection
          eyebrow="Our Impact"
          title="Building at the Sangam"
          description="Bits&Bytes Prayagraj is where young minds converge to build, learn, and ship real technology—from AI prototypes to community platforms."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <GlassContainer
                key={stat.label}
                className="p-8"
                glowColor={stat.label === "Projects shipped" ? "teal" : stat.label === "Events hosted" ? "amber" : "cyan"}
              >
                <div className="space-y-4">
                  <p className="text-5xl font-black text-white tracking-tighter">
                    {stat.value}
                  </p>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                      {stat.label}
                    </h3>
                    <p className="text-base text-white/60 font-medium">
                      {stat.detail}
                    </p>
                  </div>
                </div>
              </GlassContainer>
            ))}
          </div>
        </PageSection>

        <PageSection
          eyebrow="What We Do"
          title="How We Build"
          description="Prayagraj's space for ambitious teenagers to ship meaningful tech through premium hackathons, design squads, and real-world product launches."
          align="center"
        >
          <Features />
        </PageSection>

        <Partners />

        <PageSection
          eyebrow="Community"
          title="Voices from Prayagraj"
          align="center"
        >
          <Suspense fallback={<LoadingInline />}>
            <Testimonial />
          </Suspense>
        </PageSection>

        {/* Chapter Spotlight */}
        <PageSection
          eyebrow="Prayagraj Chapter"
          title="Built at the Sangam"
          description="Rooted in Prayagraj, connected to the Bits&Bytes foundation. We're the present tense story of teen-led innovation at India's most sacred confluence."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <GlassContainer className="p-6" glowColor="teal">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Active Chapter</h3>
                    <p className="text-xs text-white/50">Prayagraj is live and building</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm">
                  The Prayagraj chapter operates independently with its own core team, local events, 
                  and projects. We ship real products and host premium experiences for the city's 
                  ambitious teen builders.
                </p>
                <Link href="/join" className="inline-flex items-center gap-2 text-teal-400 text-sm font-semibold hover:text-teal-300 transition-colors">
                  Join Prayagraj
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </GlassContainer>

            <GlassContainer className="p-6" glowColor="amber">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Experience Mode</h3>
                    <p className="text-xs text-white/50">Try our signature feature</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm">
                  Dive into an immersive journey through the Prayagraj chapter. Explore our story, 
                  meet the team, and discover what we're building — all in a stunning 3D environment 
                  inspired by the Sangam.
                </p>
                <ExperienceLauncherCompact />
              </div>
            </GlassContainer>
          </div>
        </PageSection>

        {/* Founding Lineage Credit */}
        <FoundingLineage />
      </div>
    </>
  );
}
