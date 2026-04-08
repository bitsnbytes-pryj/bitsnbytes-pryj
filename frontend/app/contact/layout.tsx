import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Bits&Bytes",
  description:
    "Contact Bits&Bytes team for partnerships, volunteering, questions or collaboration. Reach India's teen-led code club based in Lucknow, Uttar Pradesh.",
  keywords: [
    "contact bits and bytes",
    "teen code club contact",
    "lucknow coding club email",
    "bits and bytes support",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/contact",
  },
  openGraph: {
    title: "Contact Us | Bits&Bytes",
    description: "Get in touch with Bits&Bytes team for partnerships, volunteering, or questions.",
    url: "https://gobitsnbytes.org/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
