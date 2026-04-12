"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { PageSection } from "@/components/page-section";
import { Linkedin } from "lucide-react";
import {
  GlowingCard,
  GlowingCardTitle,
  GlowingCardDescription,
} from "@/components/ui/glowing-card";

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

const aboutContent = {
  title: "About Bits&Bytes Prayagraj",
  description:
    "Rooted in Prayagraj, connected to the Bits&Bytes foundation. We're the city's teen-led tech community, empowering ambitious builders at the Sangam to ship production-grade technology.",
  sections: [
    {
      title: "Building at the Sangam",
      description:
        "Rooted in Prayagraj's historic convergence point, we bring together young minds from across the city to collaborate, learn, and create technology that matters.",
    },
    {
      title: "High Agency Only",
      description:
        "We move away from 'beginner-friendly' formats that treat participants like they need hand-holding. We build for exceptionally talented Prayagraj students who want to ship real products.",
    },
    {
      title: "Ship Real Products",
      description:
        "Workshops and hack nights must convert into tangible outcomes. We focus on premium hackathons, dev squads, and real-world launches that are fully student-led and Prayagraj-powered.",
    },
    {
      title: "Production Grade",
      description:
        "We prioritize performance and stability. Our technical infrastructure is built with professional standards, removing barriers for the next generation of Prayagraj builders.",
    },
  ],
};

const founders = [
  {
    id: 1,
    name: "Aadrika Maurya",
    image: "/team/aadrika.png",
    linkedin: "https://in.linkedin.com/in/aadrika-maurya",
  },
  {
    id: 2,
    name: "Akshat Singh Kushwaha",
    image: "/team/akshat.webp",
    linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
  },
  {
    id: 3,
    name: "Yash Singh",
    image: "/team/yash.jpeg",
    linkedin: "https://www.linkedin.com/in/yash-vardhan-singh-a41540270/",
  },
];

export default function About() {
  return (
    <>
      <WebGLShader />
      <main className="relative z-10 bg-transparent">
        <PageSection
          align="center"
          eyebrow="About"
          title={aboutContent.title}
          description={aboutContent.description}
          className="pt-24 md:pt-32"
        >
          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4">
            {aboutContent.sections.map((section, index) => {
              // Define grid areas for each card
              const gridAreas = [
                "md:[grid-area:1/1/2/7]",
                "md:[grid-area:1/7/2/13]",
                "md:[grid-area:2/1/3/7]",
                "md:[grid-area:2/7/3/13]",
              ];
              return (
                <li key={section.title} className={gridAreas[index]}>
                  <GlowingCard animationDelay={index * 0.05}>
                    <div className="space-y-3">
                      <GlowingCardTitle>{section.title}</GlowingCardTitle>
                      <GlowingCardDescription>
                        {section.description}
                      </GlowingCardDescription>
                    </div>
                  </GlowingCard>
                </li>
              );
            })}
          </ul>
        </PageSection>

        <PageSection
          align="center"
          eyebrow="Founders"
          title="The Founders of Bits&Bytes"
          description="Bits&Bytes was co-founded by Aadrika Maurya, Akshat Singh Kushwaha, and Yash Singh."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {founders.map((founder) => (
              <GlowingCard key={founder.id}>
                <div className="space-y-4 p-1">
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
              </GlowingCard>
            ))}
          </div>
        </PageSection>
      </main>
    </>
  );
}
