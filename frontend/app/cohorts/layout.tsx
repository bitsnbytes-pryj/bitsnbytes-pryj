import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cohorts | Bits&Bytes",
  description:
    "Submit your software project to Bits&Bytes Cohorts. Get a dedicated manager, vetted developers, and professional delivery — all at competitive pricing.",
  keywords: [
    "software development cohorts",
    "managed project development",
    "vetted developers",
    "dedicated project manager",
    "affordable software development",
    "Bits&Bytes cohorts",
    "project submission",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/cohorts",
  },
  openGraph: {
    title: "Cohorts | Bits&Bytes",
    description: "Submit your software project to Bits&Bytes Cohorts. Managed execution, vetted team, transparent workflow.",
    url: "https://gobitsnbytes.org/cohorts",
    type: "website",
  },
};

// Cohorts service structured data
const cohortsJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Bits&Bytes Cohorts",
  description: "Structured software project execution with dedicated managers and vetted developers",
  provider: {
    "@type": "Organization",
    name: "Bits&Bytes Prayagraj",
    url: "https://gobitsnbytes.org",
  },
  serviceType: "Software Development",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cohort Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Project Management",
          description: "Dedicated manager for client communication",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Development Team",
          description: "Vetted developers for project execution",
        },
      },
    ],
  },
};

export default function CohortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cohortsJsonLd) }}
      />
      {children}
    </>
  );
}