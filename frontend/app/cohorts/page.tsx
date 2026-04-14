"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { PageSection } from "@/components/page-section";
import {
  GlowingCard,
  GlowingCardTitle,
  GlowingCardDescription,
} from "@/components/ui/glowing-card";
import {
  ArrowRight,
  ClipboardCheck,
  Users,
  UserCheck,
  Code2,
  Rocket,
  CheckCircle2,
  Heart,
  Shield,
  DollarSign,
  MessageSquare,
  Sparkles,
  Clock,
} from "lucide-react";

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

// How it works steps - improved with shorter descriptions
const workflowSteps = [
  {
    step: 1,
    title: "Submit",
    description: "Share your project idea, requirements, and timeline.",
    icon: ClipboardCheck,
  },
  {
    step: 2,
    title: "Review",
    description: "We evaluate feasibility and confirm scope.",
    icon: Shield,
  },
  {
    step: 3,
    title: "Manager Assigned",
    description: "A dedicated manager handles all communication.",
    icon: UserCheck,
  },
  {
    step: 4,
    title: "Development",
    description: "Our team builds your solution with regular updates.",
    icon: Code2,
  },
  {
    step: 5,
    title: "Delivery",
    description: "Final product delivered and refined to your satisfaction.",
    icon: Rocket,
  },
];

// Why this works better - small cards
const whyBetterCards = [
  {
    title: "Simpler Process",
    description: "One team, one workflow, no confusion.",
    icon: MessageSquare,
  },
  {
    title: "Reliable Execution",
    description: "Vetted developers who deliver on commitments.",
    icon: Shield,
  },
  {
    title: "Transparent Progress",
    description: "Regular updates and clear milestones.",
    icon: CheckCircle2,
  },
  {
    title: "Better Pricing",
    description: "Competitive rates without the overhead.",
    icon: DollarSign,
  },
];

// Why choose cohorts - value propositions
const valuePropositions = [
  {
    title: "Simplicity",
    description: "One point of contact, one team, one clear process. No need to juggle multiple freelancers or agencies.",
    icon: MessageSquare,
  },
  {
    title: "Reliability",
    description: "Our developers are vetted, committed, and accountable. No risk of abandonment mid-project.",
    icon: Shield,
  },
  {
    title: "Cost Efficiency",
    description: "Competitive pricing that works for both clients and developers — quality work without the premium markup.",
    icon: DollarSign,
  },
  {
    title: "Managed Experience",
    description: "Your dedicated manager handles all coordination, updates, and communication. You focus on decisions, not logistics.",
    icon: Users,
  },
  {
    title: "Transparent Workflow",
    description: "Clear milestones, regular updates, and full visibility into progress. You're never left guessing.",
    icon: CheckCircle2,
  },
  {
    title: "Quality Focus",
    description: "Sustainable timelines mean developers can do their best work. No rushed jobs, no burnout-induced bugs.",
    icon: Sparkles,
  },
];

// Work culture highlights
const workCulturePoints = [
  "Sustainable workloads for our developers",
  "No crunch culture or overnight deadlines",
  "Quality over speed — every time",
  "Healthy team = better output",
  "Realistic timelines, honest communication",
];

export default function Cohorts() {
  return (
    <>
      <WebGLShader />
      <main className="relative z-10 bg-transparent">
        {/* Hero Section */}
        <PageSection
          align="center"
          eyebrow="Cohorts"
          title="Structured Project Execution, Simplified"
          description="Submit your software project. Get a dedicated manager, a vetted development team, and professional delivery — all in one place."
          className="pt-24 md:pt-32"
        >
          {/* Coming Soon Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/10 px-4 py-2 backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5 text-[var(--brand-gold-soft)]" />
              <span className="text-xs font-semibold text-[var(--brand-gold-soft)]">Coming Soon</span>
            </div>
          </div>
          <p className="text-sm text-white/60 text-center max-w-md mx-auto mb-8">
            Cohorts is currently in development and will be available shortly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/82 transition-colors duration-200 hover:bg-white/[0.08]"
            >
              Learn How It Works
            </Link>
          </div>
        </PageSection>

        {/* What Are Cohorts - 2 Column Layout */}
        <PageSection
          eyebrow="The Concept"
          title="What Are Cohorts?"
        >
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto items-start">
            {/* Left Column - Title and Description */}
            <div className="space-y-4">
              <p className="text-lg sm:text-xl text-white/85 font-medium leading-relaxed">
                Cohorts are structured, end-to-end project engagements where you submit your idea and we handle execution — from planning to delivery.
              </p>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                No juggling freelancers. No micromanaging developers. Just one organized team that takes your project from concept to completion.
              </p>
            </div>

            {/* Right Column - Glass Container with Key Points */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="h-4 w-4 text-[var(--brand-aqua-soft)]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Key Benefits</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[var(--brand-teal-light)]" />
                  <span className="text-sm sm:text-base text-white/80">Work with <strong className="text-white">one organized team</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[var(--brand-teal-light)]" />
                  <span className="text-sm sm:text-base text-white/80"><strong className="text-white">Dedicated manager</strong> for communication</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[var(--brand-teal-light)]" />
                  <span className="text-sm sm:text-base text-white/80">Tech team focused purely on <strong className="text-white">development</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[var(--brand-teal-light)]" />
                  <span className="text-sm sm:text-base text-white/80">Structured workflow for <strong className="text-white">clarity and reliability</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Why This Works Better - Small Cards */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-center text-lg font-semibold text-white/90 mb-6">Why this works better</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {whyBetterCards.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-200 hover:bg-white/[0.08] hover:border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-[var(--brand-teal)]/20 p-1.5">
                      <item.icon className="h-4 w-4 text-[var(--brand-aqua-soft)]" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </PageSection>

        {/* How It Works - Improved Horizontal Layout */}
        <div id="how-it-works">
          <PageSection
            eyebrow="Process"
            title="How It Works"
            description="A clear, step-by-step process from submission to delivery."
          >
          {/* Desktop: Horizontal with connector lines */}
          <div className="hidden md:block max-w-5xl mx-auto">
            <div className="flex items-stretch justify-between gap-2">
              {workflowSteps.map((step, index) => (
                <div key={step.step} className="flex-1 flex items-stretch">
                  {/* Step Card */}
                  <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-200 hover:bg-white/[0.08] hover:border-white/20 flex flex-col">
                    {/* Icon and Step Number */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-full bg-[var(--brand-teal)]/20 p-2">
                        <step.icon className="h-4 w-4 text-[var(--brand-aqua-soft)]" />
                      </div>
                      <span className="text-xs font-bold text-white/40">0{step.step}</span>
                    </div>
                    {/* Title */}
                    <h4 className="text-base font-bold text-white mb-1.5">{step.title}</h4>
                    {/* Description */}
                    <p className="text-xs text-white/60 leading-relaxed flex-1">{step.description}</p>
                  </div>
                  {/* Connector Line */}
                  {index < workflowSteps.length - 1 && (
                    <div className="flex items-center px-1">
                      <div className="w-6 h-px bg-gradient-to-r from-white/20 to-white/10" />
                      <ArrowRight className="h-3 w-3 text-white/20 shrink-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Stack */}
          <div className="md:hidden space-y-3">
            {workflowSteps.map((step, index) => (
              <div
                key={step.step}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-200 hover:bg-white/[0.08]"
              >
                {/* Step Number Circle */}
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-[var(--brand-teal)]/20 p-2">
                    <step.icon className="h-4 w-4 text-[var(--brand-aqua-soft)]" />
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="w-px h-4 bg-white/10 mt-2" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white">{step.title}</h4>
                    <span className="text-[10px] font-bold text-white/30">0{step.step}</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
        </div>

        {/* Why Choose Cohorts */}
        <PageSection
          eyebrow="Why Cohorts"
          title="Why Choose Cohorts?"
          description="Everything you need for successful project delivery — without the usual headaches."
        >
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {valuePropositions.map((item, index) => (
              <GlowingCard key={item.title} animationDelay={index * 0.03}>
                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[var(--brand-aqua-soft)]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </GlowingCard>
            ))}
          </div>
        </PageSection>

        {/* Work Culture Section */}
        <PageSection
          className="bg-[linear-gradient(180deg,rgba(15,58,73,0.98)_0%,rgba(10,38,48,0.98)_100%)]"
          eyebrow="Our Approach"
          title={<span className="text-white">Built on Healthy Work Culture</span>}
          description={
            <span className="text-white/70">
              We believe sustainable practices lead to better outcomes. Our developers work with balanced workloads — because quality work comes from healthy teams.
            </span>
          }
        >
          <div className="grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Left side - Culture points */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-sm">
              <div className="flex items-center gap-3 text-[var(--brand-gold-soft)] mb-6">
                <Heart className="h-5 w-5" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em]">
                  Our Commitment
                </p>
              </div>
              <ul className="space-y-4">
                {workCulturePoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-white/80"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[var(--brand-teal-light)]" />
                    <span className="text-sm sm:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side - Impact card */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[var(--brand-aqua-soft)] mb-4">
                  <Clock className="h-5 w-5" />
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em]">
                    The Result
                  </p>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                  Better quality work, delivered on realistic timelines.
                </h3>
                <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
                  No overpromising. No burnout. Just honest, professional execution from a team that cares about both the product and the people building it.
                </p>
              </div>
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/60 italic">
                  "Happy developers write better code. It's that simple."
                </p>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Call to Action - Coming Soon State */}
        <div id="submit">
          <PageSection
            align="center"
            eyebrow="Coming Soon"
            title="Get Ready for Cohorts"
            description="This feature is currently in development. Stay tuned for updates."
          >
            <div className="max-w-2xl mx-auto">
              <div className="city-fork-panel p-8 sm:p-10 text-center">
                {/* Coming Soon Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/10 px-4 py-2 mb-6">
                  <Clock className="h-3.5 w-3.5 text-[var(--brand-gold-soft)]" />
                  <span className="text-xs font-semibold text-[var(--brand-gold-soft)]">Feature In Development</span>
                </div>
                <p className="text-white/80 mb-6">
                  We're preparing this feature. Once launched, you'll be able to submit your project and work with our managed development team.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Disabled Coming Soon Button */}
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 text-sm font-bold text-white/40 cursor-not-allowed w-full sm:w-auto"
                  >
                    Coming Soon
                    <Clock className="h-4 w-4" />
                  </button>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white/80 transition-colors duration-200 hover:bg-white/[0.08] w-full sm:w-auto"
                  >
                    Questions? Contact Us
                  </Link>
                </div>
                <p className="mt-6 text-xs text-white/50">
                  We're preparing this feature. Stay tuned.
                </p>
              </div>
            </div>
          </PageSection>
        </div>
      </main>
    </>
  );
}