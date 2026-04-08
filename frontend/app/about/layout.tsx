import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Meet India's Teen-Led Code Club",
  description:
    "Learn about Bits&Bytes - India's boldest teen-led code club based in Lucknow. Meet our team, our mission to empower young developers, and our open source culture.",
  keywords: [
    "about bits and bytes",
    "teen code club india",
    "lucknow coding club",
    "student developers team",
    "youth tech organization india",
    "teen programmers community",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/about",
  },
  openGraph: {
    title: "About Us - Meet India's Teen-Led Code Club | Bits&Bytes",
    description: "Learn about Bits&Bytes, our mission, and the teen developers building India's boldest code club.",
    url: "https://gobitsnbytes.org/about",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
