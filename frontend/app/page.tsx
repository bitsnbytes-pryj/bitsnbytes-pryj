import Link from "next/link";
import {
  ArrowRight,
  Binary,
  Building2,
  Hammer,
  Layers3,
  MapPinned,
  Network,
  Radio,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import Hero from "@/components/hero";
import { FoundingLineage } from "@/components/founding-lineage";
import { PageSection } from "@/components/page-section";

const proofPoints = [
  {
    value: "100+",
    label: "builders",
    detail: "active across the city fork",
  },
  {
    value: "25+",
    label: "projects",
    detail: "shipped from prototypes to real tools",
  },
  {
    value: "12+",
    label: "events",
    detail: "run with public outcomes and visible work",
  },
];

const definitionCards = [
  {
    title: "What is Bits&Bytes?",
    icon: Binary,
    body: (
      <>
        <Link
          href="https://gobitsnbytes.org"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-[var(--brand-aqua-soft)]"
        >
          BitsnBytes
        </Link>{" "}
        is a teen-led nonprofit running national-scale hackathons and coding
        events across India. Born in Lucknow. Built by students, for students.
        It is designed to get teens building and to ship outcomes publicly.
      </>
    ),
  },
  {
    title: "What is a Fork?",
    icon: Network,
    body: (
      <>
        A fork is a city-local, student-led node of{" "}
        <Link
          href="https://gobitsnbytes.org"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-[var(--brand-aqua-soft)]"
        >
          BitsnBytes
        </Link>
        . It inherits the mission and the brand. Events, aesthetic, local
        partnerships, and the city&apos;s own vibe are meant to be defined
        locally.
      </>
    ),
  },
];

const operatingModel = [
  {
    title: "Builder-first",
    icon: Hammer,
    body:
      "Bits & bytes prayagraj is for people who make things. Work is visible, feedback is direct, and progress matters more than attendance theater.",
  },
  {
    title: "Local by default",
    icon: MapPinned,
    body:
      "This fork is tuned to local schools, local timing, local collaborators, and the city's own energy instead of importing a generic student-community template.",
  },
  {
    title: "Minimal structure",
    icon: Layers3,
    body:
      "The page stays light, the structure stays clear, and the system stays usable. No clutter, no overexplaining, no corporate filler.",
  },
];

const buildModes = [
  {
    title: "Hackathons and build sprints",
    icon: Radio,
    body:
      "National-scale energy, locally organized. Fast rooms, real deadlines, demo pressure, public output.",
  },
  {
    title: "Projects with consequence",
    icon: Building2,
    body:
      "Apps, sites, AI tools, infra, internal systems, and experiments that can survive outside a slide deck.",
  },
  {
    title: "Aesthetic with local signal",
    icon: ScanSearch,
    body:
      "Warm stone, river-ink, poster-board texture, sharper typography, and restrained marigold accents instead of the old generic glow-heavy palette.",
  },
];

export default function Home() {
  return (
    <div className="relative flex w-full max-w-full flex-col overflow-x-hidden">
      <Hero />

      <PageSection
        className="bg-[linear-gradient(180deg,rgba(8,17,26,0.4)_0%,rgba(8,17,26,0.12)_100%)]"
        eyebrow="Proof"
        title="Same system. Local signal."
        description="A bits & bytes fork should still feel like bits & bytes after the city name disappears. The difference is in the local texture, not in losing the core."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {proofPoints.map((point) => (
            <article key={point.label} className="city-fork-panel p-6">
              <p className="font-display text-4xl font-black tracking-[-0.05em] text-white">
                {point.value}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold text-white">
                {point.label}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/62">
                {point.detail}
              </p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Definitions"
        title="Keep the mission. Fork the expression."
        description="The homepage now states the system clearly before it starts styling it."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {definitionCards.map((card) => (
            <article key={card.title} className="city-fork-panel p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[var(--brand-aqua-soft)]">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                  {card.title}
                </h3>
              </div>
              <p className="mt-5 text-base leading-7 text-white/68">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        className="bg-[linear-gradient(180deg,rgba(15,58,73,0.98)_0%,rgba(10,38,48,0.98)_100%)]"
        eyebrow="Operating Model"
        title={<span className="text-white">How bits & bytes prayagraj should run</span>}
        description={
          <span className="text-white/70">
            Not a franchise. Not a clone. A fork. The landing page should say
            that in both structure and tone.
          </span>
        }
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {operatingModel.map((item) => (
            <article
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 text-[#f0c36e]">
                <item.icon className="h-5 w-5" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em]">
                  principle
                </p>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/72">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Build Modes"
        title="Designed for people who build, not passive members"
        description="The landing page now scans like a field board: what this is, how it works, what happens here, and why it feels local."
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="grid gap-4">
            {buildModes.map((mode) => (
              <article key={mode.title} className="city-fork-panel p-6">
                <div className="flex items-center gap-3 text-[var(--brand-aqua-soft)]">
                  <mode.icon className="h-5 w-5" />
                  <h3 className="font-display text-xl font-bold text-white">
                    {mode.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  {mode.body}
                </p>
              </article>
            ))}
          </div>

          <aside className="city-fork-panel flex flex-col justify-between p-7">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--brand-gold-soft)]">
                design checkpoint
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
                If the city name disappears, the system should still read as bits
                & bytes.
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/68">
                The redesign keeps the brand spine intact and lets the city show
                up through material, rhythm, and tone instead of turning the
                page into a generic community club site.
              </p>
            </div>

            <div className="mt-7 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-[var(--brand-gold-soft)]">
                <Sparkles className="h-4 w-4" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.24em]">
                  palette shift
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/68">
                River-ink, sandstone paper, oxidized teal, and marigold accents
                replace the older purple-heavy startup palette.
              </p>
            </div>
          </aside>
        </div>
      </PageSection>

      <section className="px-4 pb-4 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,22,31,0.95)_0%,rgba(9,19,29,0.98)_55%,rgba(7,15,23,0.98)_100%)] p-8 shadow-[0_35px_90px_rgba(0,8,14,0.28)] sm:p-10">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--brand-gold-soft)]">
            next move
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                bits & bytes prayagraj is the local fork. The page should feel
                like it.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/68">
                Sharp structure, local signal, and a color system that feels
                native instead of borrowed. Everything important stays clear in
                one fast pass.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-teal)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--brand-teal-light)]"
              >
                Join the fork
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/coc"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/82 transition-colors duration-200 hover:bg-white/8"
              >
                Read the code of conduct
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FoundingLineage />
    </div>
  );
}
