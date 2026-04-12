import type React from "react";
import type { Metadata, Viewport } from "next";
import { Poppins, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PageBackground } from "@/components/page-background";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { FloatingAiAssistant } from "@/components/client-only-components";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// SEO-optimized viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d9488" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1628" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gobitsnbytes.org"),
  title: {
    default: "Bits&Bytes Prayagraj - Teen-Led Tech Community | Where Rivers Confluence, Code Flows",
    template: "%s | Bits&Bytes Prayagraj",
  },
  description:
    "Join Prayagraj's boldest teen-led tech community at the sacred Sangam. Build real projects, attend hackathons, and grow as a developer. 200+ active members, 15+ shipped projects. Free to join!",
  keywords: [
    "Bits and Bytes Prayagraj",
    "bits&bytes",
    "teen code club prayagraj",
    "allahabad tech community",
    "student developers prayagraj",
    "coding club sangam city",
    "tech events prayagraj",
    "learn coding for teens",
    "teen programmers community",
    "hackathons in prayagraj 2026",
    "coding classes for teens prayagraj",
    "high school coding club",
    "teen tech community",
    "youth coding programs prayagraj",
    "student hackathon prayagraj",
    "free coding club prayagraj",
  ],
  authors: [{ name: "Bits&Bytes Team", url: "https://gobitsnbytes.org/about" }],
  creator: "Bits&Bytes",
  publisher: "Bits&Bytes",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://gobitsnbytes.org",
    languages: {
      "en-IN": "https://gobitsnbytes.org",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gobitsnbytes.org",
    siteName: "Bits&Bytes Prayagraj",
    title: "Bits&Bytes Prayagraj - Teen-Led Tech Community | Where Rivers Confluence, Code Flows",
    description:
      "Join Prayagraj's boldest teen-led tech community at the sacred Sangam. Build real projects, attend hackathons, and grow as a developer. 200+ active members building future.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bits&Bytes Prayagraj - Teen-Led Tech Community",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bits&Bytes Prayagraj - Teen-Led Tech Community",
    description:
      "Join Prayagraj's boldest teen-led tech community. Build real projects, attend hackathons, and grow as a developer.",
    images: ["/og-image.png"],
    creator: "@bitsnbytes_prj",
    site: "@bitsnbytes_prj",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "google-site-verification-code",
  },
  category: "education",
  classification: "Nonprofit Teen Tech Community",
  other: {
    "msapplication-TileColor": "#0d9488",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/logo.svg",
    apple: [
      { url: "/logo.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization structured data for Google Knowledge Panel
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://gobitsnbytes.org/#organization",
    name: "Bits&Bytes Prayagraj",
    alternateName: ["Bits and Bytes Prayagraj", "BitsNBytes Prayagraj", "Bits & Bytes Prayagraj"],
    url: "https://gobitsnbytes.org",
    logo: {
      "@type": "ImageObject",
      url: "https://gobitsnbytes.org/logo.svg",
      width: 512,
      height: 512,
    },
    image: "https://gobitsnbytes.org/og-image.png",
    description:
      "Prayagraj's boldest teen-led tech community at the sacred Sangam. We run hackathons, workshops, and build real projects. Join 200+ student developers building the future.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Prayagraj",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    sameAs: [
      "https://www.linkedin.com/company/gobitsbytes/",
      "https://github.com/bitsnbytes-pryj",
      "https://twitter.com/bitsnbytes_prj",
      "https://www.instagram.com/bitsnbytes-prayagraj",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://gobitsnbytes.org/contact",
      availableLanguage: ["English", "Hindi"],
    },
    memberOf: {
      "@type": "Organization",
      name: "Hack Club",
    },
    knowsAbout: [
      "Web Development",
      "Mobile App Development",
      "Artificial Intelligence",
      "Machine Learning",
      "Hackathons",
      "Youth Coding Education",
    ],
  };

  // WebSite structured data for sitelinks search box
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://gobitsnbytes.org/#website",
    url: "https://gobitsnbytes.org",
    name: "Bits&Bytes Prayagraj",
    description: "Prayagraj's teen-led tech community for hackathons, workshops, and building real projects",
    publisher: {
      "@id": "https://gobitsnbytes.org/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://gobitsnbytes.org/?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-IN",
  };

  // Breadcrumb for homepage
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
    ],
  };

  // Navigation/Sitelinks structured data
  const siteNavigationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    url: "https://gobitsnbytes.org",
    hasPart: [
      {
        "@type": "WebPage",
        name: "About Us",
        description: "Learn about Bits&Bytes Prayagraj - the city's teen-led tech community",
        url: "https://gobitsnbytes.org/about",
      },
      {
        "@type": "WebPage",
        name: "Events",
        description: "Hackathons, workshops, and tech events for students in Prayagraj",
        url: "https://gobitsnbytes.org/events",
      },
      {
        "@type": "WebPage",
        name: "Join Us",
        description: "Join Prayagraj's boldest teen tech community - free membership",
        url: "https://gobitsnbytes.org/join",
      },
      {
        "@type": "WebPage",
        name: "Impact",
        description: "See our community impact - 200+ students, 15+ projects",
        url: "https://gobitsnbytes.org/impact",
      },
      {
        "@type": "WebPage",
        name: "Contact",
        description: "Get in touch with Bits&Bytes Prayagraj team",
        url: "https://gobitsnbytes.org/contact",
      },
      {
        "@type": "WebPage",
        name: "FAQ",
        description: "Frequently asked questions about Bits&Bytes Prayagraj",
        url: "https://gobitsnbytes.org/faq",
      },
    ],
  };

  return (
    <html
      lang="en-IN"
      className={`${poppins.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-accent/30 selection:text-primary overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
        />
        <ThemeProvider>
          <PageBackground />
          <div className="relative z-10 flex min-h-screen flex-col overflow-x-hidden">
            <Navigation />
            <main className="flex-1 w-full overflow-x-hidden">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <FloatingAiAssistant />
            </Suspense>
          </div>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
