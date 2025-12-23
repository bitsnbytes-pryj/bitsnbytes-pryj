"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronDown, ArrowRight } from "lucide-react";

import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can I come with a pre-formed team? Do I need to?",
    answer:
      "You don't need to come with a team to CodeDay. In fact, most people don't come with a team! At the beginning of the event, everyone has the chance to pitch ideas for apps or games they want to make. You can find an idea to work on then. Teams can be made up of anyone you'd like, they don't need to attend your same school, be in your same grade, etc. Even volunteers can be on your team, if you can convince them!",
  },
  {
    question: "What if I want to come with a pre-formed team?",
    answer:
      'That\'s totally ok, too! We do encourage pre-formed teams to stay open to adding new teammates—welcoming others can bring fresh ideas and it might even make the experience more fun! Remember that, if you\'ve done any work in advance, you need to disclose that to the judges. Doing work in advance might disqualify you for the "Best in Show" and "Best in Class" prizes.',
  },
  {
    question: "What if I decide not to work with a team at all?",
    answer:
      "Also totally ok; many students work by themselves. We do find that students have more fun when participating as a team, however. Judges will do their best to take the size and experience of each team into account when deciding on prizes.",
  },
  {
    question: 'Is CodeDay a "hackathon"?',
    answer:
      "Kind of. Although it follows the usual format, CodeDay isn't a traditional hackathon. Some key differences: CodeDay has few prizes and little swag; you won't find or meet companies directly recruiting for internships; judging is done by attendees; no business plans or pitch decks (CodeDay is focused on creativity); lots of attendees are newer to coding. If that sounds like fun to you, they'd love to have you!",
  },
  {
    question: "How are projects judged?",
    answer:
      'Judges are asked to evaluate projects on the basis of, in order of importance: (1) Difficulty: given what you knew going in, how hard did you have to work to create your project? (2) Creativity: how original and fun is your project? (3) Polish: this is the "anything else" category, and includes things like having great UI, a tutorial level, etc. Judges do not consider: how technically difficult the project is in absolute terms; or business plans, marketing collateral, or a pitch deck (except as part of "polish").',
  },
  {
    question: "When does judging happen?",
    answer:
      "Judges walk around at 9am, before presentations. At least one judge will try each project, and talk to the team. Deliberation happens during presentations, so please don't create a presentation: it will only bore your friends and family.",
  },
  {
    question: "Can I volunteer for CodeDay?",
    answer:
      "Absolutely! They're almost always looking for help with the following: organizers, general day-of volunteers, workshops, mentors, and judges. You can learn more on their volunteer page.",
  },
  {
    question: "What kind of things can be made at CodeDay?",
    answer:
      "You can make anything at CodeDay. Anything at all. The only limit is yourself. Well, almost. You can't create anything that violates their Code of Conduct. This is usually a little less strict than \"school appropriate,\" but in general you can't create a project which uses offensive language referring to people's gender, race, sexual orientation, religion, or disabilities; uses sexualized language or imagery; harasses someone; or is unsafe or illegal.",
  },
  {
    question: "What do most people make?",
    answer:
      "Common projects vary from city to city, but in general, most CodeDay attendees create games, a sizable minority create mobile apps, and a small number create websites or electronics projects. You can technically even create non-coding projects at CodeDay; they've seen people present paintings and record albums before. If you're not sure what you want to make, you'll also have the opportunity to join an existing team.",
  },
  {
    question: "Can you work on existing projects at CodeDay?",
    answer:
      'Yes, but only if you\'re ok with not competing for "Best in Show" and "Best in Class" awards. You\'ll still be eligible for "Special Prize" awards.',
  },
  {
    question: "Can parents attend CodeDay?",
    answer:
      "For security reasons, parents are generally not allowed at CodeDay, except for the following two times: Kickoff (Saturday, 11am–12:30pm) and Presentations and Awards (Sunday, 10am–12pm). Parents may attend if they are accepted as a volunteer and pass a background check and training, or are a chaperone for a school group.",
  },
  {
    question: "Should we bring anything to CodeDay?",
    answer:
      "Yes. Generally, you need to bring a computer with you to CodeDay, unless you specifically requested a loaner computer or a Chromebook as part of your registration.",
  },
  {
    question: "For students staying overnight, what should they bring?",
    answer:
      "For students staying overnight, it's recommended to bring: a toothbrush and toothpaste, a sleeping bag, a pillow, and a camping pad if you have one.",
  },
  {
    question: "For students with desktop computers, what should they bring?",
    answer:
      "While desktop computers are welcome at CodeDay, they do not have any equipment available for students to use with their desktop computers. You will need to bring everything, including: a keyboard, mouse, and monitor; headphones (speakers are not allowed); a wifi adapter, since most CodeDay venues do not allow participants to connect to wired ethernet; and all necessary cables.",
  },
  {
    question: "Can students leave CodeDay and then come back?",
    answer:
      "Yes, however students who are minors will need to have a parent present to pick them up, or bring a signed note allowing them to leave early on their own. Students may not be able to return at all times of day. Venues are typically locked down overnight, and depending on building security they may not be able to let you back in until the morning.",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:min-h-[45vh] flex items-center justify-center overflow-hidden text-white">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-20">
          <div className="relative border-2 border-[var(--brand-pink)]/30 rounded-2xl sm:rounded-[32px] md:rounded-[40px] p-1 sm:p-1.5 md:p-2 backdrop-blur-sm bg-black/10">
            <div className="relative border-2 border-[var(--brand-pink)]/50 rounded-xl sm:rounded-[28px] md:rounded-[36px] py-6 sm:py-8 px-4 sm:px-10 overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[var(--brand-purple)]/20" />
              <div className="relative z-10 space-y-3 sm:space-y-4 text-center">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/70">
                  FAQ
                </p>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-extrabold text-white">
                  Frequently Asked Questions
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto">
                  Everything you need to know about CodeDay and how to
                  participate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* FAQ Accordion */}
        <PageSection>
          <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openItems.has(index);

              return (
                <div
                  key={index}
                  className="glass-card relative isolate overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[var(--glow-strong)]"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-start justify-between gap-3 sm:gap-4 p-4 sm:p-6 text-left"
                  >
                    <h3 className="font-display text-sm sm:text-base md:text-lg font-bold text-foreground dark:text-white pr-2">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-[var(--brand-pink)] transition-transform duration-300 mt-0.5",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PageSection>

        {/* Still have questions CTA */}
        <PageSection align="center">
          <div className="glass-card p-6 sm:p-8 md:p-12 text-center">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground dark:text-white">
              Still have questions?
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Can't find what you're looking for? Reach out to us directly and
              we'll get back to you as soon as possible.
            </p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                asChild
                className="rounded-full bg-[var(--brand-pink)] px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold text-white shadow-[var(--glow-strong)] w-full sm:w-auto"
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base hover:bg-white/20 w-full sm:w-auto"
              >
                <Link href="/join">Apply to Join</Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  );
}
