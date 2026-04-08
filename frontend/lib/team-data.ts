export interface TeamMember {
  name: string
  role: string
  badge: "Prayagraj Lead" | "Prayagraj Core" | "Original Foundation" | "Community Builder"
  superpowers: string[]
  achievements: string[]
  talkToMeWhen: string[]
  department: "Leadership" | "Engineering" | "Design" | "Community" | "Content" | "Operations"
  isPrayagrajChapter?: boolean
  image?: string
}

// Prayagraj Chapter Team - Active and Leading
export const PRAYAGRAJ_TEAM: TeamMember[] = [
  {
    name: "Akshat Kushwaha",
    role: "Technical Lead",
    badge: "Prayagraj Lead",
    superpowers: ["Production-Grade Engineering", "LLMOps & RAG Architecture", "Agentic Workflows", "Next.js 16 / React 19", "System Design"],
    achievements: [
      "Lead architect for the entire Bits&Bytes Prayagraj tech infrastructure",
      "Chapter Lead @ STEMist Education, founding builder-focused STEM culture at Boys High School, Prayagraj",
      "Designed high-performance retrieval systems for complex AI workflows",
      "Developed reliable autonomous execution stacks for complex tool orchestration",
      "Project Lead for the Bits&Bytes Platform, turning community operations into durable infrastructure"
    ],
    talkToMeWhen: [
      "You care about the edge cases where AI systems usually break and want to build for real constraints",
      "You're building complex agentic workflows, LLMOps pipelines, or local-first AI software",
      "You want to discuss how technical execution and systems thinking overlap to ship meaningful product",
      "You want to close the gap between ambition and the first build for young developers"
    ],
    department: "Engineering",
    isPrayagrajChapter: true,
    image: "/team/akshat.webp"
  }
]

// Original Bits&Bytes Foundation Team
export const FOUNDATION_TEAM: TeamMember[] = [
  {
    name: "Yash Singh",
    role: "Founder",
    badge: "Original Foundation",
    superpowers: ["Full-Stack Engineering", "Mathematics (IOQM)", "AI / LLM Intelligence", "Game Dev (GoDOT)", "Three.js & Creative Coding"],
    achievements: [
      "Founder of Bits&Bytes (gobitsnbytes.org), leading 100+ active members in student-led tech culture",
      "Created Codiva: A 5-star rated VS Code extension that gamifies coding for thousands of users",
      "National Qualifier for the Indian Mathematics Olympiad (IOQM)",
      "Built Alem (AI notes app <25MB) and MailAF (AI cold outreach automation)",
      "Educator at STEMist Lucknow, teaching Computer Science to underprivileged students with talent",
      "Lead Organizer for Scrapyard Lucknow and Galactic Local Mentor at NASA Space Apps Challenge"
    ],
    talkToMeWhen: [
      "You want to discuss community building or scaling high-agency movements",
      "You need help with VS Code extensions, Three.js, or AI-powered outreach workflows",
      "You want to talk about deep mathematical problem solving or competitive programming",
      "You're interested in hardware experiments like LiDAR-based fitness apps or Flipper Zero clones"
    ],
    department: "Leadership",
    isPrayagrajChapter: false,
    image: "/team/yash.jpeg"
  },
  {
    name: "Aadrika Maurya",
    role: "Co-Founder & Chief Creative Strategist",
    badge: "Original Foundation",
    superpowers: ["Neuroscience Research", "Creative Strategy", "Brand Development", "Regional Management", "Design Direction"],
    achievements: [
      "RSI India Alumni who conducted neuroscience research on EEG signals and attention pattern modeling",
      "Regional Manager for CodeDay Kanpur, empowering local student developers",
      "Building 'The Nerdy Network' to foster intellectual collaboration among teens",
      "Designed the complete visual identity and campaign strategy for India-wide movements"
    ],
    talkToMeWhen: [
      "You need input on complex design systems or branding strategy",
      "You want to discuss neuroscience, cognitive modeling, or research-driven design",
      "You are looking for insights on regional event management and scaling communities"
    ],
    department: "Design",
    isPrayagrajChapter: false,
    image: "/team/aadrika.png"
  },
  {
    name: "Devaansh Pathak",
    role: "Founding Member & Backend Lead",
    badge: "Original Foundation",
    superpowers: ["Backend Architecture", "Database Systems", "Partnership Economics"],
    achievements: [
      "Co-Architected the high-performance backend systems for the Bits&Bytes platform",
      "Executed partnerships that delivered genuine ROI for sponsors across multiple cities"
    ],
    talkToMeWhen: [
      "You are designing scalable database schemas or backend APIs",
      "You want to talk about how we treat participants like high-agency builders",
      "You're interested in the economics of sustainable tech communities"
    ],
    department: "Engineering",
    isPrayagrajChapter: false,
    image: "/team/devansh.jpeg"
  },
  {
    name: "Maryam Fatima",
    role: "Social Media & Promotions Head",
    badge: "Original Foundation",
    superpowers: ["Visual Communication", "Brand Consistency", "Impact Storytelling", "Social Strategy"],
    achievements: [
      "Generating 10k+ impressions for club events through strategic storytelling",
      "Maintains the premium Bits&Bytes brand identity across all social channels",
      "Orchestrated promotions for GitHub Copilot Dev Days and multiple CodeDay hackathons"
    ],
    talkToMeWhen: [
      "You need high-impact visuals for a campaign or real-world product launch",
      "You want to ensure visual consistency for a student-led project",
      "You have questions regarding premium social media presence"
    ],
    department: "Design",
    isPrayagrajChapter: false,
    image: "/team/maryam.jpeg"
  },
  {
    name: "Sristhi Singh",
    role: "Operations & Communications Head",
    badge: "Original Foundation",
    superpowers: ["Process Optimization", "Resource Coordination", "Logistics Management", "Internal Communication"],
    achievements: [
      "Engineered the internal communication workflows for our 100+ active members",
      "Coordinated logistics for NASA Space Apps and multiple city-wide transitions",
      "Optimized the project lifecycle from workshop to tangible product launch"
    ],
    talkToMeWhen: [
      "You need help navigating internal operations or resource allocation",
      "You want to optimize the transition from idea to shipped product",
      "You need assistance coordinating cross-department city-wide hackathons"
    ],
    department: "Operations",
    isPrayagrajChapter: false,
    image: "/team/srishti.jpeg"
  }
]

// Combined team for backward compatibility - Prayagraj first
export const TEAM_MEMBERS: TeamMember[] = [...PRAYAGRAJ_TEAM, ...FOUNDATION_TEAM]

// Badge styling helper
export function getBadgeStyles(badge: TeamMember["badge"]): { bg: string; text: string; border: string } {
  switch (badge) {
    case "Prayagraj Lead":
      return { bg: "bg-teal-500/20", text: "text-teal-400", border: "border-teal-500/30" }
    case "Prayagraj Core":
      return { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" }
    case "Community Builder":
      return { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" }
    case "Original Foundation":
      return { bg: "bg-white/10", text: "text-white/60", border: "border-white/20" }
    default:
      return { bg: "bg-white/10", text: "text-white/60", border: "border-white/20" }
  }
}

export function findExperts(query: string): TeamMember[] {
  const lowerQuery = query.toLowerCase()
  if (!lowerQuery) return TEAM_MEMBERS

  return TEAM_MEMBERS.filter(
    (member) =>
      member.name.toLowerCase().includes(lowerQuery) ||
      member.role.toLowerCase().includes(lowerQuery) ||
      member.superpowers.some((s) => s.toLowerCase().includes(lowerQuery)) ||
      member.achievements.some((a) => a.toLowerCase().includes(lowerQuery)) ||
      member.talkToMeWhen.some((t) => t.toLowerCase().includes(lowerQuery))
  )
}

export function recommendRoles(skills: string[], interests: string[]): string {
  const userKeywords = [...skills, ...interests].map((k) => k.toLowerCase())
  const recommendations: string[] = []

  if (userKeywords.some((k) => k.includes("design") || k.includes("ui") || k.includes("art") || k.includes("drawing") || k.includes("brand"))) {
    recommendations.push("Design & Content Team (Talk to Aadrika or Maryam)")
  }
  if (
    userKeywords.some(
      (k) => k.includes("code") || k.includes("dev") || k.includes("web") || k.includes("python") || k.includes("js") || k.includes("ai") || k.includes("cloud")
    )
  ) {
    recommendations.push("Engineering Team (Talk to Akshat Kushwaha or Devansh)")
  }
  if (
    userKeywords.some(
      (k) => k.includes("people") || k.includes("event") || k.includes("manage") || k.includes("lead") || k.includes("operations")
    )
  ) {
    recommendations.push("Community, Operations & Leadership (Talk to Yash or Srishti)")
  }

  if (recommendations.length === 0) {
    return "General Member - join our Discord to explore different tracks!"
  }

  return recommendations.join(", ")
}