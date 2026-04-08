import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Teen-Built Apps, Websites & AI Tools",
  description:
    "Explore 15+ real projects built by teen developers at Bits&Bytes. Web apps, mobile apps, AI tools & more. Open source student projects from India's top teen coders.",
  keywords: [
    "teen developer projects",
    "student built apps",
    "high school coding projects",
    "open source student projects",
    "teen programmers portfolio",
    "youth tech projects india",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/projects",
  },
  openGraph: {
    title: "Projects - Teen-Built Tech Showcase | Bits&Bytes",
    description: "Explore 15+ real projects built by teen developers. Web apps, AI tools & more from India's boldest builders.",
    url: "https://gobitsnbytes.org/projects",
    type: "website",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
