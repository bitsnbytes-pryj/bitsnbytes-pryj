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
      "You can come to our hackathon with a pre-formed team, or you can form a team once you're on the ground. At the beginning of the event, everyone has the chance to pitch ideas for apps or games they want to make. You can find an idea to work on then. Teams can be made up of anyone you'd like—they don't need to attend your same school or be in your same grade.",
  },
  {
    question: "What if I want to come with a pre-formed team?",
    answer:
      "That's totally ok! We do encourage pre-formed teams to stay open to adding new teammates—welcoming others can bring fresh ideas and it might even make the experience more fun!",
  },
  {
    question: "What if I decide not to work with a team at all?",
    answer:
      "Also totally ok; many students work by themselves. We do find that students have more fun when participating as a team, however.",
  },
  {
    question: "What is Bits and Bytes?",
    answer:
      "Bits and Bytes is a student-led tech club that runs hackathons and other events. Our hackathons follow the usual format but aren't traditional—we have some inspirations from Hack Club style hackathons. Our focus is on creativity; lots of attendees are newer to coding. If that sounds like fun to you, we'd love to have you!",
  },
  {
    question: "Can I volunteer for Bits and Bytes?",
    answer:
      "Absolutely! We're almost always looking for help with the following: organizers, general day-of volunteers, workshops, and mentors. Reach out to us through our contact page to learn more.",
  },
  {
    question: "What kind of things can be made at our hackathons?",
    answer:
      "You can make anything at our hackathons. Anything at all. The only limit is yourself. Well, almost. You can't create anything that violates our Code of Conduct. This is usually a little less strict than \"school appropriate,\" but in general you can't create a project which uses offensive language referring to people's gender, race, sexual orientation, religion, or disabilities; uses sexualized language or imagery; harasses someone; or is unsafe or illegal.",
  },
  {
    question: "What do most people make?",
    answer:
      "Common projects vary, but in general, most attendees create games, a sizable minority create mobile apps, and a small number create websites or electronics projects. You can technically even create non-coding projects; we've seen people present paintings and record albums before. If you're not sure what you want to make, you'll also have the opportunity to join an existing team.",
  },
  {
    question: "Can I show existing projects at Bits and Bytes?",
    answer:
      "No, you cannot show existing projects at our hackathons. All projects must be created during the event.",
  },
  {
    question: "Can parents attend Bits and Bytes?",
    answer:
      "For security reasons, parents are generally not allowed on the main premises. However, they can attend the kickoffs and presentation awards. Parents may also attend if they are accepted as a volunteer and pass a background check and training, or are a chaperone for a school group.",
  },
  {
    question: "Should we bring anything to the hackathon?",
    answer:
      "Yes. You can bring anything on your device. Generally, you need to bring a laptop with you to the hackathon.",
  },
  {
    question: "For students staying overnight, what should they bring?",
    answer:
      "For students staying overnight, it's recommended to bring: a toothbrush and toothpaste, a sleeping bag, a pillow, and a camping pad if you have one.",
  },
  {
    question: "For students with desktop computers, what should they bring?",
    answer:
      "While desktop computers are welcome, we recommend bringing a laptop instead. If you do bring a desktop, you will need to bring everything, including: a keyboard, mouse, and monitor; headphones (speakers are not allowed); a wifi adapter, since most venues do not allow participants to connect to wired ethernet; and all necessary cables.",
  },
  {
    question: "Can students leave the hackathon and then come back?",
    answer:
      "Yes, however students who are minors will need to have a parent present to pick them up, or bring a signed note allowing them to leave early on their own. Students may not be able to return at all times of day. Venues are typically locked down overnight, and depending on building security they may not be able to let you back in until the morning.",
  },
];

import { GlassContainer } from "@/components/ui/glass-container";

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
          <GlassContainer className="px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/70 font-bold">
                FAQ
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl">
                Frequently Asked <br className="hidden sm:block" /> Questions
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                Everything you need to know about Bits and Bytes and how to
                participate.
              </p>
            </div>
          </GlassContainer>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* FAQ Accordion */}
        <PageSection>
          <div className="mx-auto max-w-4xl space-y-4 md:space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openItems.has(index);

              return (
                <GlassContainer
                  key={index}
                  className="p-0"
                  glowColor="none"
                  containerClassName="rounded-[2rem]"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between gap-4 p-6 md:p-8 text-left transition-colors hover:bg-white/5"
                  >
                    <h3 className="font-display text-lg md:text-xl font-black text-white pr-4 leading-tight">
                      {faq.question}
                    </h3>
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-(--brand-pink) transition-all duration-300",
                      isOpen && "rotate-180 bg-(--brand-pink) text-white border-(--brand-pink)/50"
                    )}>
                      <ChevronDown className="h-6 w-6" />
                    </div>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/5 mt-2 pt-6">
                        <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassContainer>
              );
            })}
          </div>
        </PageSection>

        {/* Still have questions CTA */}
        <PageSection align="center">
          <GlassContainer className="p-10 md:p-20 text-center" glowColor="both">
            <h2 className="font-display text-3xl md:text-5xl font-black text-white tracking-tighter drop-shadow-2xl">
              Still have questions?
            </h2>
            <p className="mt-4 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Can't find what you're looking for? Reach out to us directly and
              we'll get back to you as soon as possible.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="group rounded-full bg-(--brand-pink) px-10 py-7 text-lg font-black text-white shadow-[0_0_30px_rgba(228,90,146,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(228,90,146,0.7)] w-full sm:w-auto"
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 px-10 py-7 text-lg font-bold text-white backdrop-blur-md hover:bg-white/10 w-full sm:w-auto transition-all"
              >
                <Link href="/join">Apply to Join</Link>
              </Button>
            </div>
          </GlassContainer>
        </PageSection>
      </main>
    </>
  );
}
