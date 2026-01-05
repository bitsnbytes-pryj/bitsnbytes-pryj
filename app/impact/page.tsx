"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { PageSection } from "@/components/page-section";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidGlassBackdrop } from "@/components/ui/liquid-glass-effect";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { LoadingInline } from "@/components/loading-wrapper";
import {
  GlowingCard,
  GlowingCardTitle,
  GlowingCardDescription,
  GlowingCardNumber,
} from "@/components/ui/glowing-card";

// Lazy load heavy components
const TeamGlobe = dynamic(() => import("@/components/team-globe"), {
  loading: () => <LoadingInline />,
  ssr: false,
});

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

const highlightStats = [
  {
    value: "200+",
    label: "Students active",
    description: "From across India",
    timeframe: "Since Jan 2024 ↑",
  },
  {
    value: "10+",
    label: "Schools represented",
    description: "Cross-campus exchange",
    timeframe: "Growing monthly ↑",
  },
  {
    value: "15+",
    label: "Projects shipped",
    description: "Products, apps, AI",
    timeframe: "Building the future ↑",
  },
  {
    value: "100%",
    label: "Student-led",
    description: "Community built for teens",
    timeframe: "Always will be",
  },
];

const culturePillars = [
  {
    title: "Innovation first",
    copy: "Every prompt becomes a prototype. We encourage bold experiments and rapid iteration.",
  },
  {
    title: "Club power",
    copy: "Mentors, pods, and accountability partners keep everyone shipping and learning.",
  },
  {
    title: "Real-world impact",
    copy: "We solve for real audiences, from school ops to civic tech to accessibility.",
  },
];

export default function Impact() {
  return (
    <>
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden text-white">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative border-2 border-[var(--brand-pink)]/30 rounded-[40px] p-2 backdrop-blur-sm bg-black/10">
            <div className="relative border-2 border-[var(--brand-pink)]/50 rounded-[36px] py-16 px-6 sm:px-10 overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[var(--brand-purple)]/20" />
              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-pink)]/60 bg-black/40 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-pink)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
                  </span>
                  Impact
                </span>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold text-white tracking-tighter">
                  Our impact hits beyond the venue walls
                </h1>
                <p className="max-w-2xl text-base sm:text-lg text-white/80 font-medium">
                  From first-high-schooler hackathons to squads embedded inside
                  local schools, we design experiences that get teens
                  building—and ship the outcomes publicly.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                  <LiquidButton
                    size="xl"
                    className="bg-[var(--brand-pink)] text-white border-2 border-white/20 rounded-full shadow-[0_0_30px_rgba(228,90,146,0.5)] hover:shadow-[0_0_50px_rgba(228,90,146,0.7)]"
                  >
                    See showcase reel
                  </LiquidButton>
                  <LiquidButton
                    size="xl"
                    className="border-2 border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 rounded-full"
                  >
                    Book the team
                  </LiquidButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-transparent">
        <PageSection
          title="Building the future with teen-led squads"
          description="Workshops, hackathons, and labs unlock hands-on practice, industry mentorship, and opportunities to deploy solutions in schools and communities."
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="order-2 w-full justify-self-center lg:order-1">
              <div className="glass-card relative h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden shadow-2xl">
                <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />
                <Suspense fallback={<LoadingInline />}>
                  <TeamGlobe />
                </Suspense>
              </div>
            </div>
            <div className="glass-card relative order-1 space-y-6 p-8 text-foreground shadow-2xl dark:text-white lg:order-2">
              <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />
              <div className="relative z-10 space-y-6">
                {highlightStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="flex flex-col border-b border-white/30 pb-5 last:border-none last:pb-0 dark:border-white/10"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-[var(--brand-pink)]">
                        {stat.value}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-[var(--brand-pink)]/30 bg-[var(--brand-pink)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--brand-pink)]">
                        {stat.timeframe}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-foreground dark:text-white">
                      {stat.label}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-white/70">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection
          align="center"
          eyebrow="Event highlight"
          title="Scrapyard Lucknow 2024"
          description={
            <span className="mx-auto block max-w-2xl">
              Our debut hackathon united 40+ coders, designers, filmmakers, and
              builders to tackle civic, education, and sustainability problems.
            </span>
          }
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                image:
                  "/images/b653f79c-fcc9-49bb-a92a-4fc454659b3a-1-105-c.jpeg",
                title: "Club United",
                copy: "40+ talented developers united for innovation",
              },
              {
                image: "/images/hero-img.jpeg",
                title: "Creative Ideation",
                copy: "Brainstorming solutions to real-world problems",
              },
              {
                image:
                  "/images/4c59e5bb-c1eb-4e4d-9b69-f29faa693002-1-105-c.jpeg",
                title: "Project Showcase",
                copy: "Presenting prototypes to judges and club members",
              },
            ].map((card, idx) => (
              <CardContainer
                key={card.title}
                className="inter-var w-full"
                containerClassName="py-4"
              >
                <CardBody className="glass-card group/card relative flex h-full min-h-[420px] w-full flex-col border-2 border-[var(--brand-pink)]/20 p-6 shadow-2xl transition-all duration-300 hover:border-[var(--brand-pink)]/40 hover:shadow-[0_20px_60px_rgba(228,90,146,0.3)] dark:border-[var(--brand-pink)]/30 dark:hover:border-[var(--brand-pink)]/50">
                  <CardItem
                    translateZ="100"
                    className="mb-4 w-full overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={card.image}
                      height={1000}
                      width={1000}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                      alt={card.title}
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="font-display text-2xl font-bold text-[var(--brand-purple)] dark:text-white"
                  >
                    {card.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="mt-2 flex-1 text-base text-foreground/80 dark:text-white/70"
                  >
                    {card.copy}
                  </CardItem>
                  <CardItem translateZ="40" className="mt-4">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-pink)]">
                      <span>0{idx + 1}</span>
                      <div className="h-px w-8 bg-[var(--brand-pink)]" />
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </PageSection>

        <PageSection
          align="center"
          eyebrow="Culture"
          title="What we stand for"
          description="We’re intentional about the energy in every room—how we collaborate, how we support each other, how we chase impact."
        >
          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 lg:gap-4">
            {culturePillars.map((pillar, idx) => {
              // Define grid areas for 3-column layout
              const gridAreas = [
                "md:[grid-area:1/1/2/5]",
                "md:[grid-area:1/5/2/9]",
                "md:[grid-area:1/9/2/13]",
              ];
              return (
                <li key={pillar.title} className={gridAreas[idx]}>
                  <GlowingCard animationDelay={idx * 0.12}>
                    <div className="space-y-3">
                      <GlowingCardNumber index={idx + 1} />
                      <GlowingCardTitle className="mt-3">{pillar.title}</GlowingCardTitle>
                      <GlowingCardDescription>
                        {pillar.copy}
                      </GlowingCardDescription>
                    </div>
                  </GlowingCard>
                </li>
              );
            })}
          </ul>
        </PageSection>
      </main>
    </>
  );
}
