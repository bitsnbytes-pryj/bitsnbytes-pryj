import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - India Innovates 2026 & More | Bits&Bytes",
  description:
    "Bits&Bytes is the Executive Partner for India Innovates 2026 at Bharat Mandapam, New Delhi — ₹10,05,000 prize pool. Plus hackathons, coding workshops & tech events open to all students across India.",
  keywords: [
    "India Innovates 2026",
    "Bharat Mandapam hackathon",
    "teen hackathons india",
    "student innovation summit India",
    "coding workshops for students",
    "tech events lucknow",
    "high school hackathon india",
    "student tech meetups",
    "bits and bytes executive partner",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/events",
  },
  openGraph: {
    title: "India Innovates 2026 & Events | Bits&Bytes",
    description: "Bits&Bytes is the Executive Partner for India Innovates 2026 at Bharat Mandapam — ₹10,05,000 prize pool. Register now on Unstop.",
    url: "https://gobitsnbytes.org/events",
    type: "website",
  },
};

// Events structured data for Google rich results
const eventsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bits&Bytes Events",
  description: "Hackathons, workshops, and tech events for teen developers in India",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Event",
        name: "India Innovates 2026",
        description:
          "India's Biggest Tech Innovation Summit — Where Code Meets Constitution. Bits&Bytes is the Executive Partner. ₹10,05,000 prize pool across Politics & Civic Tech, Data Mining, and Cyber Security domains.",
        startDate: "2026-03-28",
        endDate: "2026-03-29",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        url: "https://unstop.com/conferences/india-innovates-2026-municipal-corporation-of-delhi-1625920",
        location: {
          "@type": "Place",
          name: "Bharat Mandapam",
          address: {
            "@type": "PostalAddress",
            addressLocality: "New Delhi",
            addressRegion: "Delhi",
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "Municipal Corporation of Delhi",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Event",
        name: "Scrapyard Lucknow 2025",
        description: "Our debut hackathon united 40+ coders, designers, filmmakers, and builders.",
        startDate: "2025-12-01",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventPostponed",
        location: {
          "@type": "Place",
          name: "Lucknow",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lucknow",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "Bits&Bytes",
          url: "https://gobitsnbytes.org",
        },
      },
    },
  ],
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      {children}
    </>
  );
}
