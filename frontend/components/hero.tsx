import Link from "next/link";
import { ArrowRight, MapPin, Network, Sparkles, Wrench } from "lucide-react";

const builderSignals = [
  "hack nights",
  "real projects",
  "public demos",
  "small active teams",
];

const forkNotes = [
  { label: "location", value: "Prayagraj, Uttar Pradesh" },
  { label: "mode", value: "student-led, builder-first" },
  { label: "identity", value: "bits & bytes city fork" },
  { label: "tempo", value: "fast feedback, shipped work" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-[7.5rem] sm:px-6 sm:pb-20 lg:px-8 lg:pt-[8.5rem]">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#06131d_0%,#081722_45%,#091923_100%)]" />
      <div className="absolute inset-0 -z-20 city-fork-grid opacity-55" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(79,198,192,0.16),transparent_70%)]" />
      <div className="absolute -left-16 top-24 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(22,54,73,0.36),transparent_72%)] blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(212,154,58,0.16),transparent_72%)] blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/82 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[var(--brand-gold-soft)]" />
            bits & bytes city fork
          </div>

          <div className="space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--brand-aqua-soft)]">
              born in lucknow. built locally.
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              bits & bytes
              <span className="block text-[var(--brand-aqua-soft)]">prayagraj</span>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
              A local fork for teenagers who would rather build than spectate.
              Same bits & bytes standards, same public-output energy, tuned for
              our schools, our streets, and our own pace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-teal)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--brand-teal-light)]"
            >
              Join bits & bytes prayagraj
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/82 transition-colors duration-200 hover:bg-white/[0.08]"
            >
              Read the system
              <Network className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {builderSignals.map((signal) => (
              <span key={signal} className="city-fork-pill">
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="city-fork-panel p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--brand-gold-soft)]">
                fork notes
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                Built for people who build
              </h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[var(--brand-aqua-soft)]">
              <Wrench className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {forkNotes.map((note) => (
              <div
                key={note.label}
                className="flex items-start justify-between gap-4 border-b border-dashed border-white/8 pb-4 last:border-b-0 last:pb-0"
              >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-white/42">
                  {note.label}
                </p>
                <p className="max-w-[15rem] text-right text-sm font-medium text-white/82">
                  {note.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-[var(--brand-aqua-soft)]">
                <MapPin className="h-4 w-4" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.24em]">
                  local cue
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/68">
                River-ink, poster-wall texture, restrained marigold accents, and
                a layout that reads fast like a build board.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[rgba(212,154,58,0.08)] p-4 text-white">
              <div className="flex items-center gap-2 text-[var(--brand-gold-soft)]">
                <Sparkles className="h-4 w-4" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.24em]">
                  rule
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/78">
                Not a passive member list. Not a clone. A fork with its own
                events, aesthetic, and local momentum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
