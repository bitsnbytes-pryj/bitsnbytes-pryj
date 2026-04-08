"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageSection } from "@/components/page-section";
import { GlassContainer } from "@/components/ui/glass-container";
import { Gallery4 } from "@/components/ui/gallery4";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Clock,
  Building2,
  Activity,
  Eye,
  Check,
  ExternalLink,
} from "lucide-react";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((m) => ({ default: m.WebGLShader })),
  { loading: () => null, ssr: false },
);

// ── Component ─────────────────────────────────────────────────────────────

export default function Events() {
  const [activeEvent, setActiveEvent] = useState<"all" | "copilot" | "india-innovates">("all");

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32"
        aria-labelledby="events-hero-title"
      >
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6">
          <GlassContainer className="px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--brand-pink) opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-(--brand-pink)" />
                </span>
                Events
              </span>
              <h1 id="events-hero-title" className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold text-white tracking-tighter drop-shadow-2xl">
                Where code meets <br className="hidden sm:block" /> every boundary
              </h1>
              <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/85 font-medium leading-relaxed">
                Join thousands of student innovators at hackathons, summits, and workshops that
                turn teen builders into tomorrow&apos;s founders and policymakers.
              </p>
            </div>
          </GlassContainer>
        </div>
      </section>

      <main className="bg-transparent flex flex-col pt-12">
        {/* ── Event Toggle Tabs ────────────────────────────────────────── */}
        <div
          className="mx-auto flex w-fit max-w-[95vw] flex-wrap items-center justify-center gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-1.5 backdrop-blur-md mb-8"
          role="tablist"
          aria-label="Filter events"
        >
          <button
            type="button"
            onClick={() => setActiveEvent("all")}
            aria-selected={activeEvent === "all"}
            role="tab"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${activeEvent === "all"
              ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
              : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
          >
            All Events
          </button>
          <button
            type="button"
            onClick={() => setActiveEvent("copilot")}
            aria-selected={activeEvent === "copilot"}
            role="tab"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${activeEvent === "copilot"
              ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
              : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
          >
            GitHub Copilot Dev Days
          </button>
          <button
            type="button"
            onClick={() => setActiveEvent("india-innovates")}
            aria-selected={activeEvent === "india-innovates"}
            role="tab"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${activeEvent === "india-innovates"
              ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
              : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
          >
            Archived: India Innovates
          </button>
        </div>

        {/* ── GitHub Copilot Dev Days — Featured Spotlight ──────────────── */}
        {(activeEvent === "all" || activeEvent === "copilot") && (
          <PageSection
            eyebrow="Upcoming · Apr 19"
            title="GitHub Copilot Dev Days | Lucknow"
            description="AI-Assisted Coding with GitHub Copilot — A Community Developer Event."
          >
            <GlassContainer glowColor="pink" animated={false} className="overflow-hidden">

              {/* ── Banner image header ── */}
              <div className="relative w-full overflow-hidden rounded-t-[2.25rem] bg-white/5">
                <Image
                  src="/images/copilot-dev-day.png"
                  alt="GitHub Copilot Dev Days | Lucknow"
                  width={1920}
                  height={640}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* ── Details grid ── */}
              <div className="p-6 sm:p-8 md:p-10">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                    Workshop / Developer Event
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Registration Open
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                    Hosted by Bits&amp;Bytes
                  </span>
                </div>

                {/* Stats + details two-column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Left — key stats */}
                  <div className="space-y-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    {[
                      { icon: <Calendar className="h-4 w-4 text-(--brand-pink)" />, label: "Date", value: "Sunday, April 19, 2026" },
                      { icon: <Clock className="h-4 w-4 text-(--brand-pink)" />, label: "Time", value: "10:00 AM – 2:00 PM IST" },
                      { icon: <MapPin className="h-4 w-4 text-(--brand-pink)" />, label: "Venue", value: <Link href="https://www.google.com/maps/search/?api=1&query=26.9109169%2C80.9464606&query_place_id=ChIJSydGKnNXmTkRj475BfUXmeA" target="_blank" className="hover:text-(--brand-pink) hover:underline underline-offset-2">Cubispace, Lucknow</Link> },
                      { icon: <Users className="h-4 w-4 text-(--brand-pink)" />, label: "Format", value: "In-Person · Approval Required" },
                      { icon: <Building2 className="h-4 w-4 text-(--brand-pink)" />, label: "Host", value: "Bits&Bytes" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {s.icon}
                          <span className="text-sm text-white/60 font-medium">{s.label}</span>
                        </div>
                        <span className="text-sm font-black text-white text-right">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right — description, what you'll learn, CTA */}
                  <div className="flex flex-col gap-5">

                    {/* Community Partners */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-2.5">Community Partners</p>
                      <div className="flex flex-wrap gap-2">
                        {["Coding Connoisseurs", "Aryan Singh", "Notion Lucknow"].map((d) => (
                          <span key={d} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* What You Will Learn */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-2.5">What You Will Learn</p>
                      <ul className="space-y-1.5">
                        {[
                          "How GitHub Copilot works inside modern dev environments",
                          "Integrating AI-assisted coding into real workflows",
                          "Prompt techniques for better code suggestions",
                          "Responsible and efficient use of AI in development",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-white/65">
                            <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-(--brand-pink)" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* About */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/50 leading-relaxed space-y-1">
                      <p className="font-semibold text-white/70 text-[11px] uppercase tracking-wider mb-1">About</p>
                      <p>Artificial intelligence is rapidly changing the way developers write and think about code. This community developer event in Lucknow brings together students, developers, and technology enthusiasts to explore how AI-assisted development works in real projects.</p>
                      <p className="mt-2">All participants are expected to follow the <Link href="https://www.microsoft.com/en-us/events/code-of-conduct" target="_blank" rel="noopener noreferrer" className="text-(--brand-pink) hover:underline underline-offset-2">GitHub Event Code of Conduct</Link>.</p>
                    </div>

                    {/* CTA */}
                    <Button
                      asChild
                      className="w-full rounded-2xl bg-(--brand-pink) py-5 text-sm font-bold text-white shadow-[0_0_24px_rgba(228,90,146,0.35)] hover:opacity-90 mt-auto"
                    >
                      <Link
                        href="https://luma.com/xtxua1jl"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Request to Join on Luma
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </GlassContainer>
          </PageSection>
        )}

        {/* ── India Innovates 2026 ──────────────────────────────────────── */}
        {(activeEvent === "all" || activeEvent === "india-innovates") && (
          <>
            <PageSection
              eyebrow="Archived · Mar 28, 2026"
              title="India Innovates 2026"
              description="World's Largest Civic Tech Hackathon."
            >
              <GlassContainer glowColor="pink" animated={false} className="overflow-hidden">

                {/* ── Banner image header ── */}
                <div className="relative w-full overflow-hidden rounded-t-[2.25rem] bg-white/5">
                  <Image
                    src="/images/banner.jpeg"
                    alt="India Innovates 2026 — Bharat Mandapam, New Delhi"
                    width={1920}
                    height={640}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                {/* ── Details ── */}
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                      Archived Event
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                      <Trophy className="h-3 w-3 text-(--brand-pink)" />
                      Official Executive Partner: Bits&Bytes
                    </span>
                  </div>

                  <div className="prose prose-invert max-w-none text-white/80 space-y-6">
                    <p className="text-lg text-white font-medium">
                      <strong>India Innovates 2026</strong> is now archived. <strong>Bits&Bytes (GobitsnBytes)</strong> was listed as the <strong>Official Executive Partner</strong> for the finale.
                    </p>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">Event Summary</h2>
                      <p>
                        India Innovates 2026 was presented as the <strong>World's Largest Civic Tech Hackathon</strong>, held on <strong>March 28, 2026</strong> at <strong>Bharat Mandapam, Pragati Maidan, New Delhi</strong> (9 AM - 7 PM). Organizers included <strong>HN Group</strong> and <strong>MCD</strong>, with partner institutions such as <strong>IIT Kharagpur, NSUT, GGSIPU, and DDU</strong>. <Link href="https://indiainnovates.org" target="_blank" className="text-(--brand-pink) hover:underline">[indiainnovates]</Link>
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">Scale</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>1.26 crore+</strong> total applicants nationwide. <Link href="https://www.tribuneindia.com/news/j-k/ju-team-among-top-15-at-india-innovates-2026/" target="_blank" className="text-(--brand-pink) hover:underline">[tribuneindia]</Link></li>
                        <li><strong>28,000+ to 5,000+ to 15 teams</strong> across three elimination rounds. <Link href="https://www.dailyexcelsior.com/ju-students-outshine-at-india-innovates-2026/" target="_blank" className="text-(--brand-pink) hover:underline">[dailyexcelsior]</Link></li>
                        <li><strong>₹10 lakh+</strong> prize pool, including <strong>₹1L, ₹75K, ₹50K, and ₹25K per domain</strong>. <Link href="https://indiainnovates.org" target="_blank" className="text-(--brand-pink) hover:underline">[indiainnovates]</Link></li>
                        <li>Domains: <strong>Urban Solutions, Digital Democracy, and Open Innovation</strong>. <Link href="https://indiainnovates.org" target="_blank" className="text-(--brand-pink) hover:underline">[indiainnovates]</Link></li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">Finale Format</h2>
                      <p>
                        It was not a build-on-site round. Teams developed in advance, and the final day focused on <strong>live product demonstrations</strong> reviewed by investors, officials, diplomats, and founders. <Link href="https://indiainnovates.org" target="_blank" className="text-(--brand-pink) hover:underline">[indiainnovates]</Link>
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">Dignitaries and Finalists</h2>
                      <p>
                        Confirmed attendees included <strong>Delhi CM Rekha Gupta</strong>, the <strong>Bihar Assembly Speaker</strong>, and <strong>MP Manoj Tiwari (North East Delhi)</strong>. <Link href="https://www.newdelhitimes.com/delhi-cm-rekha-gupta-attends-india-innovates-2026-hackathon-highlights-youth-driven-innovation/" target="_blank" className="text-(--brand-pink) hover:underline">[newdelhitimes]</Link>
                      </p>
                      <p>
                        <strong>Team Dupahar</strong> from the University of Jammu reached the Top 15 and was reported as the only finalist team from J&K. <Link href="https://www.tribuneindia.com/news/j-k/ju-team-among-top-15-at-india-innovates-2026/" target="_blank" className="text-(--brand-pink) hover:underline">[tribuneindia]</Link>
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">Post-Event Pathway</h2>
                      <p>
                        Following the finale, selected teams entered a <strong>ministry-level presentation stage</strong> for post-event review and exposure. <Link href="https://indiainnovates.org" target="_blank" className="text-(--brand-pink) hover:underline">[indiainnovates]</Link>
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">Media and Social Coverage</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><code>#IndiaInnovates2026</code> was trending on X (Twitter) on event day. <Link href="https://x.com/search?q=%23IndiaInnovates2026" target="_blank" className="text-(--brand-pink) hover:underline">[x]</Link></li>
                        <li>Event updates were also posted by Delhi CM via official channels. <Link href="https://www.newdelhitimes.com/delhi-cm-rekha-gupta-attends-india-innovates-2026-hackathon-highlights-youth-driven-innovation/" target="_blank" className="text-(--brand-pink) hover:underline">[newdelhitimes]</Link></li>
                        <li>Coverage includes Tribune India, Daily Excelsior, and New Delhi Times. <Link href="https://www.dailyexcelsior.com/ju-students-outshine-at-india-innovates-2026/" target="_blank" className="text-(--brand-pink) hover:underline">[dailyexcelsior]</Link></li>
                        <li>The @hn.india account described it as a historic moment involving 5,000 innovators. <Link href="https://www.instagram.com/p/DWMfnECE8Eu/" target="_blank" className="text-(--brand-pink) hover:underline">[instagram]</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassContainer>
            </PageSection>

            {/* ── Event Video ─────────────────────────────────────────────── */}
            <PageSection
              align="left"
              className="pb-0"
            >
              <GlassContainer glowColor="pink" animated={false} className="p-4 sm:p-6 md:p-8">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white">Event Video</h3>
                      <p className="text-sm text-white/65">Stage highlights and on-floor moments from the finale.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                        Archive Footage
                      </span>
                      <span className="inline-flex items-center rounded-full border border-(--brand-pink)/40 bg-(--brand-pink)/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-(--brand-pink)">
                        March 2026
                      </span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[1.4rem] border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.03] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(228,90,146,0.18),transparent_45%)]" />
                    <video
                      className="relative z-10 w-full rounded-[1rem] border border-white/10 bg-black/50"
                      controls
                      playsInline
                      preload="metadata"
                      poster="/event_pictures/HEe923ub0AE-92F.jpg"
                    >
                      <source src="/event_pictures/india-innovates-2026-stage-address.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </GlassContainer>
            </PageSection>

            {/* ── Past Events Gallery ─────────────────────────────────────────────── */}
            <PageSection
              align="left"
              className="pb-0"
            >
              <Gallery4
                title="In Pictures"
                description=""
                items={[
                  {
                    id: "img-1",
                    title: "Opening Address",
                    description: "Main stage opening session at India Innovates 2026.",
                    href: "#",
                    image: "/event_pictures/HEe93oOakAAi2Mi.jpg",
                  },
                  {
                    id: "img-2",
                    title: "Plenary Session",
                    description: "Live address from the central stage at Bharat Mandapam.",
                    href: "#",
                    image: "/event_pictures/HEe923ub0AE-92F.jpg",
                  },
                  {
                    id: "img-3",
                    title: "Jury Interaction",
                    description: "On-floor demo review with students and evaluators.",
                    href: "#",
                    image: "/event_pictures/866d62697f3d42819e2007714047a3a80001af45.jpg",
                  },
                  {
                    id: "img-4",
                    title: "Participant Teams",
                    description: "Student teams preparing for demonstrations in the main hall.",
                    href: "#",
                    image: "/event_pictures/3d53b4900bb7c0176eadb242c495cbfb3634ffb3.jpg",
                  },
                  {
                    id: "img-5",
                    title: "Build Table",
                    description: "Final-stage hardware and prototype iteration under evaluation windows.",
                    href: "#",
                    image: "/event_pictures/1ae8b9183c456f721ab4a04a7cbd0268ce3b2e97.jpg",
                  },
                  {
                    id: "img-6",
                    title: "Hall View",
                    description: "Full auditorium turnout during keynote and showcase rounds.",
                    href: "#",
                    image: "/event_pictures/HEe923uagAATqvy.jpg",
                  },
                ]}
              />
            </PageSection>

          </>
        )}

      </main>
    </>
  );
}
