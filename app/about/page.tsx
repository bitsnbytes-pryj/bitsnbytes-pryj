"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PageSection } from "@/components/page-section";
import { LoadingInline } from "@/components/loading-wrapper";
import {
  GlowingCard,
  GlowingCardTitle,
  GlowingCardDescription,
} from "@/components/ui/glowing-card";

// Lazy load heavy components
const TeamCaseStudy = dynamic(() => import("@/components/team-case-study"), {
  loading: () => <LoadingInline />,
  ssr: true,
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

const aboutContent = {
  title: "About Bits&Bytes Prayagraj",
  description:
    "We are Prayagraj's teen-led tech community, empowering ambitious builders at the Sangam to ship production-grade technology through premium hackathons, design squads, and real-world product launches.",
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

// Core Team - Top tier
const coreTeam = [
  {
    id: 1,
    name: "Yash Singh",
    role: "Founder & Local Lead",
    image: "/team/yash.jpeg",
    bio: "High school student who builds things that matter—from VS Code extensions with thousands of users to hackathons with 400+ participants. IOQM National Qualifier and Educator at STEMist Lucknow, teaching underrepresented talent.",
    expertise: [
      "Mathematics (IOQM)",
      "Full-Stack Dev",
      "Three.js / Three.js",
      "AI / ML Scaling",
      "GoDOT Game Dev",
    ],
    linkedin: "https://www.linkedin.com/in/yash-vardhan-singh-a41540270/",
    accentColor: "#3E1E68", // Deep Purple
    isFounder: true,
  },
  {
    id: 2,
    name: "Aadrika Maurya",
    role: "Co-Founder & Chief Creative Strategist",
    image: "/team/aadrika.png",
    isFeatured: true,
    bio: "RSI India Alumni who conducted neuroscience research on EEG signals and attention pattern modeling. Regional Manager for CodeDay Kanpur and building 'The Nerdy Network'.",
    expertise: [
      "Neuroscience (EEG)",
      "Creative Strategy",
      "Regional Management",
      "Brand Development",
    ],
    linkedin: "https://in.linkedin.com/in/aadrika-maurya",
    accentColor: "#E45A92", // Vibrant Pink
    isFounder: true,
  },
  {
    id: 3,
    name: "Akshat Kushwaha",
    role: "Co-Founder & Technical Lead",
    image: "/team/akshat.webp",
    bio: "AI-native systems engineer who asks what happens when software fails—building production workflows and retrieval architectures that survive real constraints. Lead at STEMist Prayagraj, defining high-performance engineering culture.",
    expertise: [
      "LLMOps / RAG",
      "Agentic Frameworks",
      "Next.js 16 / React 19",
      "FastAPI / Python",
      "System Design",
    ],
    linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
    accentColor: "#5D2F77", // Rich Plum
    isFounder: true,
  },
  {
    id: 4,
    name: "Devaansh Pathak",
    role: "Founding Member & Backend Lead",
    image: "/team/devansh.jpeg",
    bio: "Manages high-performance backend development and partnership economics.",
    expertise: [
      "Backend Architecture",
      "Database Systems",
      "Partnership Building",
      "Community Outreach",
    ],
    linkedin: "https://www.linkedin.com/in/devaanshpa/",
  },
  {
    id: 5,
    name: "Maryam Fatima",
    role: "Social Media & Promotions Head",
    image: "/team/maryam.jpeg",
    bio: "Leading social strategy and impact storytelling. Generated 10k+ impressions for club events. Spearheads visual campaigns for major independent hackathons.",
    expertise: [
      "Impact Storytelling",
      "Visual Design",
      "Campaign Planning",
      "Brand Identity",
    ],
    linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
  },
  {
    id: 6,
    name: "Sristhi Singh",
    role: "Operations & Communications Head",
    image: "/team/srishti.jpeg",
    bio: "Optimizing internal communication for 100+ members. Ensures smooth collaboration across design/dev squads and city-wide event transitions.",
    expertise: [
      "Process Optimization",
      "Resource Logistics",
      "Team Communications",
      "Project Coordination",
    ],
    linkedin: "https://www.linkedin.com/in/srishti-singh-ab6a1b391",
  },
];

// Volunteers - smaller cards section
const volunteers = [
  {
    id: 11,
    name: "Jaagruti",
    image: "/team/jaagruti.jpeg",
  },
  {
    id: 14,
    name: "Adithya",
    image: "/team/adhitya.png", // Corrected image path and extension
    linkedin: "https://www.linkedin.com/in/adithya---k/",
  },
  {
    id: 5,
    name: "Saksham",
    image: "/team/saksham.jpeg",
    linkedin: "https://www.linkedin.com/in/sakshm/",
  },
  {
    id: 10,
    name: "Kaustubh",
    image: "/team/kaustubh.jpeg",
    linkedin: "https://www.linkedin.com/in/kaustubh-shaw-905ab3381/",
  },
  {
    id: 7,
    name: "Areeb",
    image: "/team/areeb.png",
    linkedin: "https://www.linkedin.com/in/areeb-ahmad-066547315/",
  },
  {
    id: 8,
    name: "Atharva",
    image: "/team/atharva.jpg",
    linkedin: "https://www.linkedin.com/in/atharvaupadhyay/",
  },
  {
    id: 9,
    name: "Kavan",
    image: "/team/kavan.jpg",
  },

  {
    id: 13,
    name: "Aishwary",
    image: "/team/aishwary.jpeg",
    linkedin: "https://www.linkedin.com/in/ashlovesnoodle",
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
          eyebrow="Team"
          title="Meet the Agents"
          description="A tight crew of designers, engineers, and club leads powering Prayagraj's teen-led tech movement."
        >
          <Suspense fallback={<LoadingInline />}>
            <TeamCaseStudy coreTeam={coreTeam} volunteers={volunteers} />
          </Suspense>
          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground px-4 sm:px-0">
            *Roles stay flexible as our team and club grow.
          </p>
        </PageSection>
      </main>
    </>
  );
}