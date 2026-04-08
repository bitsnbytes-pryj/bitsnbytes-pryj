import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "QnA Assistant - Ask Bits&Bytes AI Bot Questions",
  description:
    "Chat with the official Bits&Bytes AI assistant. Ask questions about our events, team, projects, and teen coding community in India.",
  keywords: [
    "bits and bytes assistant",
    "QnA chatbot",
    "teen coding questions",
    "AI assistant",
    "bits and bytes support",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/qna",
  },
  openGraph: {
    title: "QnA Assistant | Bits&Bytes AI Bot",
    description: "Chat with the official Bits&Bytes AI assistant. Ask anything about our club, events, and tech community.",
    url: "https://gobitsnbytes.org/qna",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bits&Bytes QnA Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QnA Assistant | Bits&Bytes AI",
    description: "Chat with the official Bits&Bytes AI assistant powered by advanced language models.",
    images: ["/og-image.png"],
    creator: "@bitsnbytes_lko",
  },
};

// Breadcrumb schema for inner page SEO
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://gobitsnbytes.org",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "QnA Assistant",
      item: "https://gobitsnbytes.org/qna",
    },
  ],
};

export default function QnALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
