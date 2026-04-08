import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bits&Bytes - India's Teen-Led Code Club",
    short_name: "Bits&Bytes",
    description: "Join India's boldest teen-led code club. Build real projects, attend hackathons, and grow as a developer. 200+ active members, 15+ shipped projects.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#3E1E68",
    orientation: "portrait-primary",
    categories: ["education", "productivity", "social"],
    lang: "en-IN",
    dir: "ltr",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Join Bits&Bytes",
        short_name: "Join",
        description: "Become a member of our teen code club",
        url: "/join",
      },
      {
        name: "Upcoming Events",
        short_name: "Events",
        description: "View hackathons and workshops",
        url: "/events",
      },
      {
        name: "Our Projects",
        short_name: "Projects",
        description: "Explore teen-built projects",
        url: "/projects",
      },
    ],
  }
}
