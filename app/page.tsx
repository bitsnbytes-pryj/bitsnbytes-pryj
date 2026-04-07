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
      </div>
    </>
  );
}