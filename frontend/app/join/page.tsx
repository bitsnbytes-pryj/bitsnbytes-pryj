"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Rocket,
  Heart,
  Zap,
  Linkedin,
} from "lucide-react";

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

const NOTION_JOIN_FORM_URL =
  "https://perfect-dinghy-781.notion.site/33949ed2fc338035bd3bef46155035f5?pvs=105";

const founders = [
  {
    name: "Aadrika Maurya",
    image: "/team/aadrika.png",
    linkedin: "https://in.linkedin.com/in/aadrika-maurya",
  },
  {
    name: "Akshat Singh Kushwaha",
    image: "/team/akshat.webp",
    linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
  },
  {
    name: "Yash Singh",
    image: "/team/yash.jpeg",
    linkedin: "https://www.linkedin.com/in/yash-vardhan-singh-a41540270/",
  },
];

const benefits = [
  {
    icon: Users,
    title: "Join a tight-knit crew",
    description:
      "Connect with 200+ ambitious teen builders across India who share your passion for tech.",
  },
  {
    icon: Rocket,
    title: "Ship real projects",
    description:
      "Work on portfolio-ready projects with mentorship at every stage—from idea to deployment.",
  },
  {
    icon: Zap,
    title: "Attend exclusive events",
    description:
      "Get priority access to hackathons, workshops, and networking events with industry pros.",
  },
  {
    icon: Heart,
    title: "Grow together",
    description:
      "Pair programming, code reviews, and study groups help everyone level up faster.",
  },
];

const expectations = [
  "Be a student (ages 13-19) passionate about tech",
  "Commit 2-4 hours per week for activities",
  "Join our Discord and stay active in discussions",
  "Participate in at least one project or event per quarter",
  "Support fellow members and maintain a positive attitude",
];

const faqs = [
  {
    question: "Do I need coding experience to join?",
    answer:
      "Not at all! We welcome beginners and pair them with experienced mentors. What matters most is your enthusiasm to learn and build.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "We recommend 2-4 hours per week, but it's flexible. Some weeks you might attend a workshop, others you might work on a project async.",
  },
  {
    question: "Is there a membership fee?",
    answer:
      "Bits&Bytes is completely free to join. We believe tech education should be accessible to all students.",
  },
  {
    question: "I'm not from Prayagraj. Can I still join?",
    answer:
      "Absolutely. We are a city fork of Bits&Bytes (gobitsnbytes.org) and welcome ambitious teen builders across India. Most collaboration happens online.",
  },
];

import { GlassContainer } from "@/components/ui/glass-container";

export default function Join() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32"
        aria-labelledby="join-hero-title"
      >
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-24">
          <GlassContainer className="px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--brand-pink) opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-(--brand-pink)" />
                </span>
                Applications Open
              </span>
              <h1 id="join-hero-title" className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl">
                Join the crew
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                A city fork of Bits&Bytes (gobitsnbytes.org). Build with founder-led squads, mentors, and live projects.
              </p>
            </div>
          </GlassContainer>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* Main CTA Section */}
        <PageSection align="center">
          <div className="mx-auto w-full max-w-3xl space-y-6 sm:space-y-8">
            <GlassContainer className="p-8 md:p-12 text-center" glowColor="both">
              <div className="flex flex-col items-center gap-6">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 font-bold uppercase tracking-widest">
                  <Clock className="h-4 w-4 text-(--brand-pink)" />
                  <span>Takes less than 2 minutes</span>
                </div>

                <Button
                  asChild
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-(--brand-pink) px-10 py-4 text-lg md:text-xl font-black text-white shadow-lg shadow-[#e45a92]/20 hover:shadow-xl hover:shadow-[#e45a92]/40 transition-all hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 w-full sm:w-auto max-w-xs"
                >
                  <a
                    href={NOTION_JOIN_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Bits&Bytes join form in Notion"
                  >
                    Apply to Join
                    <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>

                <p className="text-sm text-white/50 font-medium">
                  We review applications weekly · You&apos;ll hear back within 7 days
                </p>
              </div>
            </GlassContainer>

          </div>
        </PageSection>

        <PageSection
          align="center"
          eyebrow="Founders"
          title="The Founders of Bits&Bytes"
          description="Co-founded by Aadrika Maurya, Akshat Singh Kushwaha, and Yash Singh."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {founders.map((founder, index) => (
              <GlassContainer
                key={founder.name}
                className="p-5 md:p-6"
                glowColor={index % 2 === 0 ? "pink" : "purple"}
              >
                <div className="space-y-4">
                  <div className="relative mx-auto h-52 w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/15">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 260px"
                      className="object-cover object-top"
                    />
                  </div>
                  <h3 className="text-center font-display text-lg font-bold text-white">
                    {founder.name}
                  </h3>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20"
                    aria-label={`${founder.name} LinkedIn profile`}
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </div>
              </GlassContainer>
            ))}
          </div>
        </PageSection>

        {/* Benefits Section */}
        <PageSection
          align="center"
          eyebrow="Why Join"
          title="What you'll get as a member"
          description="Being part of Bits&Bytes means more than just a Discord invite. Here's what awaits you."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <GlassContainer
                key={benefit.title}
                className="p-6 md:p-8"
                glowColor={index % 2 === 0 ? "pink" : "purple"}
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-(--brand-pink) shadow-inner">
                    <benefit.icon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl md:text-2xl font-black text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-base text-white/70 font-medium leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </GlassContainer>
            ))}
          </div>
        </PageSection>

        {/* Expectations Section */}
        <PageSection
          align="center"
          eyebrow="Expectations"
          title="What we look for"
          description="We want to make sure Bits&Bytes is the right fit for you."
        >
          <div className="mx-auto max-w-2xl">
            <GlassContainer className="p-8 md:p-10" glowColor="purple">
              <ul className="space-y-4 md:space-y-6">
                {expectations.map((expectation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 text-base md:text-lg text-white font-medium"
                  >
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-(--brand-pink) mt-0.5" />
                    <span>{expectation}</span>
                  </li>
                ))}
              </ul>
            </GlassContainer>
          </div>
        </PageSection>

        {/* FAQ Section */}
        <PageSection
          align="center"
          eyebrow="FAQ"
          title="Common questions"
          description="Everything you need to know before applying."
        >
          <div className="mx-auto max-w-3xl space-y-4 md:space-y-6">
            {faqs.map((faq, index) => (
              <GlassContainer
                key={index}
                className="p-6 md:p-8"
                glowColor="none"
              >
                <h3 className="font-display text-lg md:text-xl font-black text-white">
                  {faq.question}
                </h3>
                <p className="mt-3 text-base text-white/60 font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </GlassContainer>
            ))}
          </div>
        </PageSection>

        {/* Final CTA */}
        <PageSection align="center">
          <div className="mx-auto max-w-2xl text-center space-y-4 sm:space-y-6">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Ready to start building?
            </h2>
            <p className="text-sm sm:text-base text-white/70 px-4 sm:px-0">
              Join the city fork community and ship real products with ambitious teen builders.
            </p>
            <Button
              asChild
              className="group rounded-full bg-[var(--brand-pink)] px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#e45a92]/20 hover:shadow-xl hover:shadow-[#e45a92]/40 transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 w-full sm:w-auto"
            >
              <a
                href={NOTION_JOIN_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Bits&Bytes join form in Notion"
              >
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <p className="text-xs sm:text-sm text-white/60">
              Questions? Reach us at{" "}
              <a
                href="mailto:hello@gobitsnbytes.org"
                className="font-bold text-[var(--brand-pink)] hover:underline"
              >
                hello@gobitsnbytes.org
              </a>
            </p>
          </div>
        </PageSection>
      </main>
    </>
  );
}
