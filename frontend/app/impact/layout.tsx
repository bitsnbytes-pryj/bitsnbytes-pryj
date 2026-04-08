import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Impact - 200+ Students, 15+ Projects Shipped",
  description:
    "See Bits&Bytes impact: 200+ active student members, 10+ schools represented, 15+ shipped projects. Discover how we're empowering teen developers across India.",
  keywords: [
    "bits and bytes impact",
    "teen coding statistics",
    "student developer community",
    "youth tech impact india",
    "coding club achievements",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/impact",
  },
  openGraph: {
    title: "Our Impact - 200+ Students Building the Future | Bits&Bytes",
    description: "200+ active members, 15+ shipped projects, 10+ schools. See how Bits&Bytes is empowering teen developers.",
    url: "https://gobitsnbytes.org/impact",
    type: "website",
  },
};

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
