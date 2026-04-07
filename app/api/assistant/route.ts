import { NextRequest, NextResponse } from "next/server"
import OpenAI, { APIError } from "openai"
import { findExperts, recommendRoles } from "@/lib/team-data"
import { generateEmbedding, searchSiteContent } from "@/lib/rag"
import { detectFrustration } from "@/lib/sentiment"
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
})

const PRIMARY_MODEL = "moonshotai/kimi-k2-instruct-0905"
const FALLBACK_MODEL = "nvidia/llama-3.1-nemotron-70b-instruct"

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
}


type ClientMessage = {
  role: "user" | "assistant"
  content: string
}

type AssistantAction = { type: "navigate"; path: string } | { type: "highlight"; textSnippet: string }

type SemanticCacheEntry = {
  key: string
  embedding: number[]
  response: string
  action?: AssistantAction
}

const SEMANTIC_CACHE_LIMIT = 200
const SEMANTIC_CACHE_THRESHOLD = 0.92
const SESSION_SPECIFIC_REGEX = /\b(my|i|register|status)\b/i
const semanticCache = new Map<string, SemanticCacheEntry>()

type IntentBypassResult = {
  intent: "whatsapp_link" | "website_navigation" | "contact_form"
  response: string
  action?: AssistantAction
}

type TrieNode = {
  children: Map<string, TrieNode>
  terminal: boolean
}

class KeywordTrie {
  private root: TrieNode = { children: new Map(), terminal: false }

  insert(phrase: string) {
    const words = phrase
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
    if (!words.length) return

    let node = this.root
    for (const word of words) {
      if (!node.children.has(word)) {
        node.children.set(word, { children: new Map(), terminal: false })
      }
      node = node.children.get(word)!
    }
    node.terminal = true
  }

  matches(text: string): boolean {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s/]/g, " ")
      .split(/\s+/)
      .filter(Boolean)

    for (let i = 0; i < words.length; i++) {
      let node: TrieNode | undefined = this.root
      let j = i
      while (node && j < words.length) {
        node = node.children.get(words[j])
        if (!node) break
        if (node.terminal) return true
        j += 1
      }
    }
    return false
  }
}

const intentKeywordTrie = new KeywordTrie()
const intentKeywords: Record<IntentBypassResult["intent"], string[]> = {
  whatsapp_link: ["whatsapp", "community link", "join whatsapp", "whatsapp group", "invite link"],
  website_navigation: ["take me to", "go to", "open page", "navigate to", "show page", "move to"],
  contact_form: ["contact form", "send a message", "message the team", "reach out", "contact team"],
}

for (const phrases of Object.values(intentKeywords)) {
  for (const phrase of phrases) intentKeywordTrie.insert(phrase)
}

const intentPrototypes: Record<IntentBypassResult["intent"], string> = {
  whatsapp_link: "I want the WhatsApp community invite link",
  website_navigation: "Please navigate me to a specific page on the website",
  contact_form: "Help me open the contact form to message the team",
}

const intentPrototypeEmbeddings = new Map<string, number[]>()

const SITE_CONTEXT = `
You are the official AI assistant for Bits&Bytes Prayagraj - the teen-led code club at the confluence of ideas.

You must follow these operating rules:
1. Your only source of factual truth is tool output and current page content. Do not rely on memory for facts.
2. For any factual question about events, founders, team, rules, dates, contact info, history, or club details, call search_site_content first.
3. For team/person matching, call find_team_expert and/or recommend_role. Do not guess.
4. For navigation requests, call suggest_navigation.
5. When the answer references text visible on the current page, call highlight_text with the exact snippet.
6. For contact submissions, call submit_contact_form only after collecting required fields: name, email, message.
7. Respond in English by default. Only use Hindi or Hinglish if the user explicitly asks for it (for example: "reply in Hindi"), and keep technical terms (hackathon, submission, GitHub, etc.) in English.
8. If someone mentions sponsorship, partnership, or funding, guide them through sponsor inquiry step by step, then call submit_sponsor_inquiry.
9. If a user asks if they're eligible for a hackathon, collect: (1) are you a student? (2) school/college name (3) grade or year. Then check eligibility rules via search_site_content and give a definitive yes/no with next steps.

Response style:
- Be concise, direct, and helpful.
- If tools do not return enough information, clearly say you could not verify the answer.
- The knowledge base is primarily in English. Preserve facts from tool output, and do not localize language unless explicitly requested by the user.
- Bits&Bytes Prayagraj is located in Prayagraj (formerly Allahabad), Uttar Pradesh, India - the sacred confluence (Sangam) of three rivers.

Safety:
- Refuse requests unrelated to Bits&Bytes, technology, coding, education, or local community support.
- Do not provide private personal details not present in tool output.

**UI Components you can use:**
- **Buttons / CTAs:** \`[Label](/path "cta")\`
- **Follow-up actions:** \`[Question](# "follow-up")\`
- **Charts:** Markdown code block with language \`chart\` containing JSON.
- **Countdown Card:** Markdown code block with language \`countdown\` containing JSON: {"event":"...","date":"ISO_DATE"}
- **Team Member Card:** Markdown code block with language \`member_card\` containing JSON: {"name":"...","role":"...","photo":"...","socials":{"github":"...","linkedin":"..."}}
- **Project Idea Card:** Markdown code block with language \`project_card\` containing JSON array of ideas.
- **Community Link:** Use this WhatsApp invite when users ask to join the community: https://chat.whatsapp.com/DvAIRLgEEBxISR8bsb9kVg
`

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "submit_contact_form",
      description:
        "Submit the Bits&Bytes contact form on behalf of the visitor once you have their name, email, a subject, and a clear message.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The visitor's full name" },
          email: { type: "string", description: "The visitor's email address" },
          subject: {
            type: "string",
            description: "Short subject line summarising why they are reaching out",
          },
          message: {
            type: "string",
            description: "The full message to send through the contact form",
          },
        },
        required: ["name", "email", "message"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggest_navigation",
      description:
        "Suggest navigating the visitor to a specific page of the Bits&Bytes site. Use when they ask to go somewhere (e.g. join, contact, impact).",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "The path to navigate to",
            enum: ["/", "/about", "/impact", "/join", "/contact", "/coc", "/events", "home", "about", "impact", "join", "contact", "coc", "events"],
          },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_site_content",
      description:
        "Search the Bits&Bytes website knowledge base. USE THIS OFTEN when asked about dates, events, rules, the club, or specific facts. It searches semantically across all pages.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query, e.g., 'who are the founders', 'when is Copilot Dev Days', 'what are the rules'",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "highlight_text",
      description:
        "Highlight a specific piece of text on the current page to draw the user's attention to it. Use this whenever quoting or pointing out specific information that is currently visible on the page.",
      parameters: {
        type: "object",
        properties: {
          textSnippet: {
            type: "string",
            description: "The exact or partial text snippet to highlight on the page.",
          },
        },
        required: ["textSnippet"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_team_expert",
      description:
        "Find team members. Pass a specific topic (e.g. 'React') or pass an empty string '' to list the Core Team.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The topic/skill to search for, or empty string for all members.",
          },
        },
        required: ["query"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "recommend_role",
      description:
        "Recommend a role or team within Bits&Bytes based on the user's skills and interests.",
      parameters: {
        type: "object",
        properties: {
          skills: {
            type: "array",
            items: { type: "string" },
            description: "List of skills the user has (e.g. ['Python', 'drawing']).",
          },
          interests: {
            type: "array",
            items: { type: "string" },
            description: "List of interests the user has (e.g. ['AI', 'community']).",
          },
        },
        required: ["skills", "interests"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "generate_project_ideas",
      description:
        "Generate 3 project ideas tailored to the user's interests, technical skills, and optional theme.",
      parameters: {
        type: "object",
        properties: {
          interests: {
            type: "array",
            items: { type: "string" },
            description: "The user's interests as keywords.",
          },
          tech_skills: {
            type: "array",
            items: { type: "string" },
            description: "The user's known technical skills.",
          },
          theme: {
            type: "string",
            description: "Optional hackathon theme to align ideas with.",
          },
        },
        required: ["interests", "tech_skills"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "submit_sponsor_inquiry",
      description:
        "Submit sponsor lead details once sponsor inquiry fields are fully collected.",
      parameters: {
        type: "object",
        properties: {
          company_name: { type: "string" },
          contact_name: { type: "string" },
          email: { type: "string" },
          sponsor_type: {
            type: "string",
            enum: ["title", "gold", "silver", "inkind"],
          },
          budget_range: { type: "string" },
          goals: { type: "string" },
        },
        required: ["company_name", "contact_name", "email", "sponsor_type", "goals"],
      },
    },
  },
]

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return -1
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return -1
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function addSemanticCacheEntry(entry: SemanticCacheEntry) {
  if (semanticCache.has(entry.key)) semanticCache.delete(entry.key)
  semanticCache.set(entry.key, entry)
  while (semanticCache.size > SEMANTIC_CACHE_LIMIT) {
    const oldestKey = semanticCache.keys().next().value as string | undefined
    if (!oldestKey) break
    semanticCache.delete(oldestKey)
  }
}

function findSemanticCacheHit(queryEmbedding: number[]): SemanticCacheEntry | null {
  let best: SemanticCacheEntry | null = null
  let bestScore = -1

  for (const entry of semanticCache.values()) {
    const score = cosineSimilarity(queryEmbedding, entry.embedding)
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }

  if (best && bestScore >= SEMANTIC_CACHE_THRESHOLD) {
    console.log(`[Cache HIT] similarity=${bestScore.toFixed(4)} key=${best.key}`)
    semanticCache.delete(best.key)
    semanticCache.set(best.key, best)
    return best
  }

  return null
}

function containsSessionSpecificWord(input: string): boolean {
  return SESSION_SPECIFIC_REGEX.test(input)
}

async function embedMiniLM(text: string): Promise<number[]> {
  // Use the existing embedding backend to avoid native ONNX runtime dependency in production.
  return generateEmbedding(text)
}

function extractNavigationPath(input: string): string | null {
  const lower = input.toLowerCase()
  if (lower.includes("home")) return "/"
  if (lower.includes("about")) return "/about"
  if (lower.includes("impact")) return "/impact"
  if (lower.includes("join")) return "/join"
  if (lower.includes("contact")) return "/contact"
  if (lower.includes("events") || lower.includes("event")) return "/events"
  if (lower.includes("code of conduct") || lower.includes("coc")) return "/coc"
  return null
}

async function classifyIntentBypass(userText: string): Promise<IntentBypassResult | null> {
  const lower = userText.toLowerCase()

  if (intentKeywordTrie.matches(lower)) {
    if (intentKeywords.whatsapp_link.some((k) => lower.includes(k))) {
      return {
        intent: "whatsapp_link",
        response: "Join the Bits&Bytes WhatsApp community here: https://chat.whatsapp.com/DvAIRLgEEBxISR8bsb9kVg",
      }
    }

    if (intentKeywords.contact_form.some((k) => lower.includes(k))) {
      return {
        intent: "contact_form",
        response: "Taking you to the contact page so you can send a message directly.",
        action: { type: "navigate", path: "/contact" },
      }
    }

    const maybePath = extractNavigationPath(lower)
    if (maybePath) {
      return {
        intent: "website_navigation",
        response: `Taking you to ${maybePath}.`,
        action: { type: "navigate", path: maybePath },
      }
    }
  }

  const embedding = await embedMiniLM(userText)
  let bestIntent: IntentBypassResult["intent"] | null = null
  let bestScore = -1

  for (const [intent, phrase] of Object.entries(intentPrototypes) as [IntentBypassResult["intent"], string][]) {
    let protoEmbedding = intentPrototypeEmbeddings.get(intent)
    if (!protoEmbedding) {
      protoEmbedding = await embedMiniLM(phrase)
      intentPrototypeEmbeddings.set(intent, protoEmbedding)
    }

    const score = cosineSimilarity(embedding, protoEmbedding)
    if (score > bestScore) {
      bestScore = score
      bestIntent = intent
    }
  }

  if (!bestIntent || bestScore < 0.86) return null

  if (bestIntent === "whatsapp_link") {
    return {
      intent: "whatsapp_link",
      response: "Join the Bits&Bytes WhatsApp community here: https://chat.whatsapp.com/DvAIRLgEEBxISR8bsb9kVg",
    }
  }

  if (bestIntent === "contact_form") {
    return {
      intent: "contact_form",
      response: "Taking you to the contact page so you can send a message directly.",
      action: { type: "navigate", path: "/contact" },
    }
  }

  const path = extractNavigationPath(lower)
  if (!path) return null
  return {
    intent: "website_navigation",
    response: `Taking you to ${path}.`,
    action: { type: "navigate", path },
  }
}

function mapClientMessagesToOpenAI(messages: ClientMessage[]): OpenAI.Chat.ChatCompletionMessageParam[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))
}

function sectionToPath(section: string): string {
  const normalized = normalizePath(section)
  return normalized
}

function normalizePath(value?: string): string {
  const input = (value ?? "/").toString().trim().toLowerCase()
  if (input === "/" || input === "home") return "/"
  if (input === "/about" || input === "about") return "/about"
  if (input === "/impact" || input === "impact") return "/impact"
  if (input === "/join" || input === "join") return "/join"
  if (input === "/contact" || input === "contact") return "/contact"
  if (input === "/coc" || input === "coc") return "/coc"
  if (input === "/events" || input === "events") return "/events"
  return "/"
}

async function handleSubmitContactTool(args: any) {
  const name = (args?.name ?? "").toString().trim()
  const email = (args?.email ?? "").toString().trim()
  const subject = (args?.subject ?? "").toString().trim()
  const message = (args?.message ?? "").toString().trim()

  if (!name || !email || !message) {
    return {
      success: false,
      message: "Name, email, and message are required to submit the contact form.",
    }
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from("contacts").insert({
      name,
      email,
      subject: subject || "Contact via Bits&Bytes assistant",
      message,
      source: "assistant",
    })

    if (error) {
      console.error("Supabase contact insert error (assistant):", error)
      return {
        success: false,
        message: "Failed to submit the contact form. Please try again.",
      }
    }

    return {
      success: true,
      message: `Contact form submitted successfully for ${name} (${email}). The team will get back soon!`,
    }
  } catch (err) {
    console.error("Supabase contact insert exception (assistant):", err)
    return {
      success: false,
      message: "Something went wrong while submitting the contact form.",
    }
  }
}

async function handleGenerateProjectIdeasTool(args: any) {
  const interests = Array.isArray(args?.interests) ? args.interests.map((v: unknown) => String(v)).filter(Boolean) : []
  const techSkills = Array.isArray(args?.tech_skills) ? args.tech_skills.map((v: unknown) => String(v)).filter(Boolean) : []
  const theme = (args?.theme ?? "").toString().trim()

  if (!interests.length || !techSkills.length) {
    return {
      success: false,
      message: "interests and tech_skills are required.",
    }
  }

  const prompt = [
    "Generate exactly 3 practical hackathon project ideas as JSON.",
    "Output ONLY valid JSON with this schema:",
    "{\"ideas\":[{\"title\":\"\",\"description\":\"\",\"tech_stack\":[\"\"],\"difficulty\":\"beginner|intermediate|advanced\",\"why_it_fits_theme\":\"\"}]}",
    `Interests: ${interests.join(", ")}`,
    `Tech skills: ${techSkills.join(", ")}`,
    `Theme: ${theme || "not specified"}`,
    "Keep ideas feasible for student builders and include clear problem statements.",
  ].join("\n")

  try {
    const completion = await openai.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a strict JSON generator for hackathon project ideation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 700,
    })

    const raw = completion.choices[0]?.message?.content ?? ""
    const parsed = JSON.parse(raw)
    const ideas = Array.isArray(parsed?.ideas) ? parsed.ideas.slice(0, 3) : []
    return { success: true, ideas }
  } catch (error) {
    console.error("generate_project_ideas failed:", error)
    return {
      success: false,
      message: "Could not generate project ideas right now.",
    }
  }
}

async function handleSubmitSponsorInquiryTool(args: any) {
  const companyName = (args?.company_name ?? "").toString().trim()
  const contactName = (args?.contact_name ?? "").toString().trim()
  const email = (args?.email ?? "").toString().trim()
  const sponsorType = (args?.sponsor_type ?? "").toString().trim().toLowerCase()
  const budgetRange = (args?.budget_range ?? "").toString().trim()
  const goals = (args?.goals ?? "").toString().trim()

  if (!companyName || !contactName || !email || !sponsorType || !goals) {
    return { success: false, message: "Missing required sponsor inquiry fields." }
  }

  if (!["title", "gold", "silver", "inkind"].includes(sponsorType)) {
    return { success: false, message: "Invalid sponsor_type. Use title, gold, silver, or inkind." }
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from("sponsor_leads").insert({
      company_name: companyName,
      contact_name: contactName,
      email,
      sponsor_type: sponsorType,
      budget_range: budgetRange || null,
      goals,
      source: "assistant",
    })

    if (error) {
      console.error("sponsor_leads insert failed:", error)
      return { success: false, message: "Failed to submit sponsor inquiry." }
    }

    return { success: true, message: "Sponsor inquiry submitted successfully." }
  } catch (err) {
    console.error("submit_sponsor_inquiry exception:", err)
    return { success: false, message: "Something went wrong while submitting sponsor inquiry." }
  }
}

function createImmediateSseResponse(content: string, action?: AssistantAction, model = "bypass") {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }
      send({ type: "meta", model })
      if (content) send({ type: "token", content })
      send({ type: "done", action: action ?? null })
      controller.close()
    },
  })

  return new Response(stream, { headers: SSE_HEADERS })
}

// get_site_section removed in favor of semantic RAG search

export async function POST(req: NextRequest) {
  // ─── Rate limiting (10 requests per minute per IP) ───
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "anonymous"

  const { rateLimit } = await import("@/lib/rate-limit")
  const rl = rateLimit(ip, { maxRequests: 10, windowMs: 60_000 })

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }

  if (!process.env.HACKCLUB_PROXY_API_KEY) {
    return NextResponse.json(
      { error: "HACKCLUB_PROXY_API_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const clientMessages = (body?.messages ?? []) as ClientMessage[]
    const clientPathname = (body?.pathname ?? "/").toString()
    const sessionId = (body?.sessionId ?? "").toString()

    if (!Array.isArray(clientMessages) || clientMessages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 })
    }

    // Build page-aware system context
    const PAGE_LABELS: Record<string, string> = {
      "/": "Home",
      "/about": "About",
      "/impact": "Impact",
      "/join": "Join",
      "/contact": "Contact",
      "/coc": "Code of Conduct",
      "/events": "Events",
    }
    const currentPageLabel = PAGE_LABELS[clientPathname] ?? clientPathname
    const pageContext = `\n\n**Current Page:** The user is currently viewing the "${currentPageLabel}" page (${clientPathname}). Tailor your answers to be relevant to the content on this page when appropriate. If they ask "what's on this page" or similar, describe what this page contains.`

    const lastUserMsg = clientMessages.filter(m => m.role === "user").pop()

    if (lastUserMsg?.content) {
      const bypass = await classifyIntentBypass(lastUserMsg.content)
      if (bypass) {
        console.log(`[Intent Bypass] ${bypass.intent}`)
        return createImmediateSseResponse(bypass.response, bypass.action, "intent-bypass")
      }
    }

    const isFrustrated = lastUserMsg ? detectFrustration(lastUserMsg.content) : false
    const frustrationHint = isFrustrated 
      ? "\n\n**CRITICAL OP NOTE:** The user seems frustrated or confused based on their recent message. Be extra empathetic, concise, and helpful. If their issue is technical or blocked, proactively offer to connect them with the team or ask if they'd like to use the contact form."
      : ""

    const timeContext = `\n\n**Current Date & Time:** ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long",
    })} (IST)`

    const baseMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SITE_CONTEXT + timeContext + pageContext + frustrationHint,
      },
      ...mapClientMessagesToOpenAI(clientMessages),
    ]

    let latestUserEmbedding: number[] | null = null
    if (lastUserMsg?.content && !containsSessionSpecificWord(lastUserMsg.content)) {
      try {
        latestUserEmbedding = await embedMiniLM(lastUserMsg.content)
        const hit = findSemanticCacheHit(latestUserEmbedding)
        if (hit) {
          return createImmediateSseResponse(hit.response, hit.action, "semantic-cache")
        }
      } catch (cacheErr) {
        console.error("Semantic cache check failed:", cacheErr)
      }
    }

    const runCompletion = async (model: string, messages: OpenAI.Chat.ChatCompletionMessageParam[]) => {
      return openai.chat.completions.create({
        model,
        messages,
        tools,
        tool_choice: "auto",
        max_tokens: 1024,
      })
    }

    let modelUsed = PRIMARY_MODEL
    let currentMessages = [...baseMessages]
    let actionToClient: AssistantAction | undefined

    for (let i = 0; i < 5; i++) {
      let completion
      try {
        completion = await runCompletion(PRIMARY_MODEL, currentMessages)
      } catch (err) {
        const apiError = err as APIError
        const code = (apiError as any)?.code ?? (apiError as any)?.error?.code
        const status = (apiError as any)?.status
        const shouldFallback =
          code === "model_not_found" ||
          code === "unsupported_parameter" ||
          code === "unsupported_value" ||
          status === 403

        if (shouldFallback) {
          modelUsed = FALLBACK_MODEL
          completion = await runCompletion(FALLBACK_MODEL, currentMessages)
        } else {
          throw err
        }
      }

      const choice = completion.choices[0]
      const message = choice?.message
      const finishReason = choice?.finish_reason

      // If the model's output was truncated (hit token limit), skip tool parsing
      // and ask the model to answer directly without tools
      if (finishReason === "length" && message?.tool_calls && message.tool_calls.length > 0) {
        console.warn("[Assistant] Tool call truncated (finish_reason=length). Retrying without tools.")
        // Push a system hint to avoid tools and answer directly
        currentMessages.push({
          role: "system" as const,
          content: "Your previous response was truncated. Please answer the user's question directly and concisely WITHOUT using any tools.",
        })
        continue
      }

      if (!message?.tool_calls || message.tool_calls.length === 0) {
        break // No more tool calls required
      }

      // HackClub API requires content to be a string (not null).
      // When the model makes tool calls, the SDK sets content to null.
      currentMessages.push({
        ...message,
        content: message.content ?? "",
      })

      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name
        let toolArgs: any = {}
        try {
          toolArgs = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {}
        } catch (parseErr) {
          console.error(`[Assistant] Failed to parse tool args for "${toolName}":`, toolCall.function.arguments)
          // Attempt basic recovery: try to extract JSON from partial output
          const rawArgs = toolCall.function.arguments ?? ""
          try {
            // Try to close any unclosed braces and parse
            const repaired = rawArgs.replace(/,\s*$/, "") + (rawArgs.includes("{") && !rawArgs.endsWith("}") ? "}" : "")
            toolArgs = JSON.parse(repaired)
            console.log(`[Assistant] Recovered partial tool args for "${toolName}"`)
          } catch {
            toolArgs = {}
            // Tell the model the tool call failed so it can recover
            currentMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ success: false, error: `Tool arguments were malformed and could not be parsed. Please try answering the user directly without this tool, or retry with simpler arguments.` }),
            } as OpenAI.Chat.ChatCompletionToolMessageParam)
            continue
          }
        }

        let toolResult: any = null

        if (toolName === "submit_contact_form") {
          toolResult = await handleSubmitContactTool(toolArgs)
        } else if (toolName === "suggest_navigation") {
          const path = normalizePath(toolArgs?.path)
          toolResult = { success: true, path }
          actionToClient = { type: "navigate" as const, path }
        } else if (toolName === "search_site_content") {
          const results = await searchSiteContent(toolArgs?.query ?? "")
          toolResult = { success: true, results }
        } else if (toolName === "find_team_expert") {
          const query = (toolArgs?.query ?? "").toString()
          const experts = findExperts(query)
          toolResult = { query, experts }
        } else if (toolName === "recommend_role") {
          const skills = Array.isArray(toolArgs?.skills) ? toolArgs.skills : []
          const interests = Array.isArray(toolArgs?.interests) ? toolArgs.interests : []
          const recommendation = recommendRoles(skills, interests)
          toolResult = { skills, interests, recommendation }
        } else if (toolName === "highlight_text") {
          const textSnippet = (toolArgs?.textSnippet ?? "").toString()
          toolResult = { success: true, textSnippet }
          actionToClient = { type: "highlight" as const, textSnippet }
        } else if (toolName === "generate_image") {
          const res = await handleImageGenTool(toolArgs)
          toolResult = res.result
          if (res.action) actionToClient = res.action as any
        } else if (toolName === "generate_project_ideas") {
          toolResult = await handleGenerateProjectIdeasTool(toolArgs)
        } else if (toolName === "submit_sponsor_inquiry") {
          toolResult = await handleSubmitSponsorInquiryTool(toolArgs)
        } else {
          toolResult = { success: false, message: `Unknown tool: ${toolName}` }
        }

        currentMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        } as OpenAI.Chat.ChatCompletionToolMessageParam)
      }
    }

    try {
      return await streamAssistantResponse(modelUsed, currentMessages, actionToClient, {
        sessionId,
        pathname: clientPathname,
        ip,
      }, latestUserEmbedding, lastUserMsg?.content)
    } catch (streamErr) {
      console.error("Assistant stream error after tool call:", streamErr)
      return NextResponse.json(
        { error: "Failed to stream the assistant response." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Assistant API error:", error)
    return NextResponse.json(
      { error: "Failed to generate a response from the assistant." },
      { status: 500 }
    )
  }
}

async function streamAssistantResponse(
  model: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  action?: AssistantAction,
  sessionMeta?: { sessionId: string; pathname: string; ip: string },
  latestUserEmbedding?: number[] | null,
  latestUserText?: string
) {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 600,
    stream: true,
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      send({ type: "meta", model })

      try {
        let fullAssistantContent = ""

        for await (const part of completion) {
          const delta = part.choices[0]?.delta

          if (delta?.content) {
            fullAssistantContent += delta.content
            send({ type: "token", content: delta.content })
          }
        }

        send({ type: "done", action: action ?? null })

        // Save session after stream done
        if (sessionMeta?.sessionId) {
          try {
            const { createClient } = await import("@supabase/supabase-js")
            const supabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const finalMessages = [...messages, { role: "assistant", content: fullAssistantContent }]

            // Insert/update chat session asynchronously
            supabase.from("chat_sessions").upsert({
              session_id: sessionMeta.sessionId,
              messages: finalMessages,
              pathname: sessionMeta.pathname,
              model: model,
              ip_hash: sessionMeta.ip,
              updated_at: new Date().toISOString()
            }, { onConflict: "session_id" }).then(({ error }) => {
              if (error) console.error("Failed to save chat_session:", error)
            })
          } catch (err) {
            console.error("Supabase import or upsert failed in stream:", err)
          }
        }

        if (
          latestUserEmbedding &&
          latestUserText &&
          !containsSessionSpecificWord(latestUserText) &&
          fullAssistantContent.trim().length > 0
        ) {
          addSemanticCacheEntry({
            key: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            embedding: latestUserEmbedding,
            response: fullAssistantContent,
            action,
          })
        }

      } catch (error) {
        console.error("Streaming error:", error)
        send({ type: "error", message: "Failed to stream assistant response." })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: SSE_HEADERS,
  })
}
