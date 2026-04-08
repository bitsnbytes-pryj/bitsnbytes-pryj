import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Bits&Bytes - Free Teen Code Club Membership",
  description:
    "Join India's boldest teen code club for FREE! Connect with 200+ student developers, build real projects, attend hackathons & grow your skills. Ages 13-19 welcome.",
  keywords: [
    "join bits and bytes",
    "teen coding club membership",
    "free coding club india",
    "how to join hackathon club",
    "student developer community",
    "teen programmers india join",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/join",
  },
  openGraph: {
    title: "Join Bits&Bytes - Free Membership | India's Teen Code Club",
    description: "Join for FREE! Connect with 200+ teen developers, build projects, attend hackathons. Ages 13-19 welcome.",
    url: "https://gobitsnbytes.org/join",
    type: "website",
  },
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
