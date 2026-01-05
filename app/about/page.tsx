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
  title: "About Bits&Bytes",
  description:
    "We're a teen-led code club dedicated to fostering innovation, collaboration, and real-world impact through technology.",
  sections: [
    {
      title: "Host Hackathons",
      description:
        "We organize competitive hackathons where teens can showcase their coding skills and build innovative projects under time pressure, fostering creativity and teamwork.",
    },
    {
      title: "Workshops & Learning",
      description:
        "Regular workshops cover everything from web development to AI/ML, helping teens master cutting-edge technologies and industry best practices.",
    },
    {
      title: "Connect & Collaborate",
      description:
        "We bring together like-minded individuals from different schools, creating a supportive club where teens can learn from each other and build lasting connections.",
    },
    {
      title: "Inspire & Build",
      description:
        "We inspire the next generation of developers and innovators to turn their ideas into reality and create solutions that make a real difference.",
    },
  ],
};

// Core Team - Top tier
const coreTeam = [
  {
    id: 1,
    name: "Yash",
    role: "Founder",
    image: "/team/yash.jpeg",
    bio: "Leads the entire organization, coordinating between all teams, organizing events, setting timelines, and ensuring that work gets executed efficiently.",
    expertise: [
      "Leadership",
      "Event Management",
      "Team Coordination",
      "Strategic Planning",
    ],
    linkedin: "https://www.linkedin.com/in/yash-singh-a41540270/",
    accentColor: "#3E1E68", // Deep Purple
    isFounder: true,
  },
  {
    id: 2,
    name: "Aadrika",
    role: "Co-Founder & Chief Creative Strategist",
    image: "/team/aadrika.png",
    bio: "Leads branding, design decisions, idea generation, and promotional campaign planning. Handles basic tech work and guides the overall direction of the organization.",
    expertise: [
      "Creative Strategy",
      "Brand Development",
      "Campaign Planning",
      "Design Direction",
    ],
    linkedin: "https://in.linkedin.com/in/aadrika-maurya",
    accentColor: "#E45A92", // Vibrant Pink
    isFounder: true,
  },
  {
    id: 3,
    name: "Akshat",
    role: "Co-Founder & Technical Lead",
    image: "/team/akshat.png",
    bio: "Builds and maintains the website, leads programming projects, evaluates tech stacks, and ensures the technical stability of all projects.",
    expertise: [
      "AI & LLMOps",
      "Cloud Infrastructure",
      "Full-Stack Development",
    ],
    linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
    accentColor: "#5D2F77", // Rich Plum
    isFounder: true,
  },
  {
    id: 4,
    name: "Devansh",
    role: "Founding Member & Backend Lead",
    image: "/team/devaansh.jpeg",
    bio: "Manages backend development, collaborates on technical features, and builds relationships with schools, students, and external communities for participation and support.",
    expertise: [
      "Backend Development",
      "Database Architecture",
      "Community Outreach",
      "Partnership Building",
    ],
    linkedin: "https://www.linkedin.com/in/devaanshpa/",
  },
  {
    id: 6,
    name: "Maryam",
    role: "Social Media & Promotions Head",
    image: "/team/maryam.jpeg",
    bio: "Designs visuals for posts, events, and campaigns while maintaining branding consistency. Coordinates closely with the social media and content teams.",
    expertise: [
      "Social Media",
      "Brand Identity",
      "Visual Communication",
      "Design Systems",
    ],
    linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
  },
];

// Volunteers - smaller cards section
const volunteers = [
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
    id: 11,
    name: "Oviyaa",
    image: "/team/oviyaa.jpeg",
    linkedin: "https://www.linkedin.com/in/oviyaa-singh-3a183a370/",
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
          description="A tight crew of designers, engineers, club leads, and storytellers powering India-wide teen-led tech movements."
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
