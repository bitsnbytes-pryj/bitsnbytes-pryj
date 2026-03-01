import { NextRequest, NextResponse } from "next/server"
import OpenAI, { APIError } from "openai"
import { findExperts, recommendRoles } from "@/lib/team-data"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const PRIMARY_MODEL = "gpt-5-mini-2025-08-07"
const FALLBACK_MODEL = "gpt-4.1"

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

type ClientMessage = {
  role: "user" | "assistant"
  content: string
}

type AssistantAction = { type: "navigate"; path: string } | { type: "highlight"; textSnippet: string } | { type: "submit_form"; formData: any }

const SITE_CONTEXT = `
You are the official AI assistant for Bits&Bytes, a teen-led code club based in Lucknow.

**Your Goal:** Help visitors learn about the club, find the right team members to talk to, and get involved.

**Core Identity (Do not hallucinate these):**
- **Mission:** Innovation, collaboration, and real-world impact through technology.
- **Activities:** Hackathons (e.g., Scrapyard Lucknow), workshops, and student mentorship.
- **Contact:** hello@gobitsnbytes.org
- **Contact:** contact@indiainnovates.org
- **GitHub:** https://github.com/gobitsnbytes

**How to get answers:**
1. **For Team/Roles:** DO NOT guess. Always use the 'find_team_expert' or 'recommend_role' tools. The team structure is dynamic.
2. **For Specific Page Content:** Use 'get_site_section' to "read" the website (Home, About, Impact, Join, Contact, Code of Conduct, Events) if the user asks for details you don't know (like specific project stats, upcoming event dates, or recent news).
3. **For Code of Conduct Questions:** Use 'get_site_section' with section 'coc' to read the community guidelines and answer questions about behavior expectations, reporting, or community values.
4. **For Navigation:** Use 'suggest_navigation' to guide them.
5. **For Pointing out Info:** When you find relevant information on the current page to answer a user's question, prominently use the 'highlight_text' tool to highlight that exact snippet of text on the website for the user.

**Guardrails & Safety:**
- Refuse to answer questions that are irrelevant to Bits&Bytes, technology, coding, education, or the local community.
- If a user asks about general knowledge (e.g. "Who won the World Cup?", "How to bake a cake?"), politely redirect them:
  "I can only help with questions about Bits&Bytes, our events, or technology topics."
- Do not engage in roleplay scenarios unrelated to the club.
- Do not generate code for malicious purposes.
- If asked for personal information about members beyond what is available via tools (superpowers/roles), refuse.

Rules:
- Always stay truthful to Bits&Bytes.
- Be extremely concise, conversational, and direct. Avoid long, multi-paragraph summaries or filler text. Get straight to the point.
- Do not use 'suggest_navigation' and 'highlight_text' in the exact same response. If you navigate the user to a new page, wait for them to see it; do not highlight right away since the page will be loading.
- If you can't find the answer in the tools or page content, admit it:
  "I’m not sure about that based on the information publicly available on this site."

**UI Components you can use:**
- **Buttons / CTAs:** Use markdown links with the title "button" or "cta". Example: \`[Join Now](/join "cta")\`
- **Follow-up actions:** Use markdown links with the title "follow-up". This creates a clickable bubble for the user to quickly ask a follow up question. Example: \`[How do I register?](# "follow-up")\`
- **Section Hyperlinks:** Use markdown links starting with '#' to jump to sections on the page. Example: \`[Go to Rules](#rules)\`
- **Charts:** To show stats, output a markdown code block with the language \`chart\` containing a valid JSON array of objects with 'name' and 'value' properties. Example:
\`\`\`chart
[{"name": "2024", "value": 100}, {"name": "2025", "value": 300}]
\`\`\`

**India Innovates 2026 Event Details:**
- **What is it:** World's Largest Civic Tech Hackathon hosted by Municipal Corporation of Delhi where policy meets innovation. Hosted at Bharat Mandapam, New Delhi. Exhibition-focused, not a classic overnight hackathon. Bits&Bytes is the Executive Partner for this event. 16,000+ registrations received so far.
- **Participation:** Open to India’s brightest student innovators to bring working products, prototypes.
- **Team Size:** Must have 3-6 Members.
- **Domains:** 
  1. Urban Solutions (Flooding engine, AQI dashboard, AI waste tracking, AI Traffic Flow).
  2. Digital Democracy (Global Ontology Engine, AI Booth Management, Secure E-Voting, AI Avatars, AI Calling Agents, Smart CRM, AI Co-Pilot).
  3. Cyber Security (Threat detection, secure access, encryption, phishing prevention).
  4. Open Innovation (Healthcare, Robotics, Agriculture, Fintech, etc.).
- **Product State:** Fully polished not required, but need a working product/prototype/breakthrough idea. Teams must submit PPT describing their idea, approach, and expected impact. All development must be completed before the Finale which is on 28 March 2026. No development/coding time on Final Presentation Day.
- **Logistics:** Offline at Bharat Mandapam, New Delhi. 28 March 2026, 9:00 AM – 7:00 PM. Travel & accommodation not provided.
- **Key Dates:** Registration Deadline: 05 Mar 2026, 10:59 PM IST. PPT Submission Phase: 24 Jan - 10 Mar 2026, 11:59 PM IST. Evaluation Phase: 11 Mar - 15 Mar 2026. Grand Finale: 28 Mar 2026, 9:00 AM.
- **Format:** Initial shortlist from PPTs. Best solutions provided exhibition space to display product to investors, founders, policymakers. Live on-the-spot judging.
- **Judging & Prizes:** Prize pool of INR 10 Lakh+. Prizes per domain: 1st ₹1,50,000 | 2nd ₹1,00,000 | 3rd ₹50,000 | Runner-Up ₹35,000. Participation certificates provided.
- **Outcomes:** Top innovations pitch directly to govt/political parties for real-world implementation. Best ideas get a Paid Govt Apprenticeship + Full-Time Opportunity.
- **Rules:** Projects must be original, no previously deployed projects. Open-source tools allowed. Plagiarism = disqualification. Volunteers cannot participate, and participants cannot volunteer at the event. If a participant hasn't submitted a GitHub link, provide this form: https://tally.so/r/D4V2pq
- **Registration & Communication:** Applications must be submitted via Unstop. Join the Official WhatsApp Community: https://chat.whatsapp.com/DOs79yuKXAB4jm76wNJsNc
- **Volunteering:** To volunteer at Bits&Bytes club or its general events, take users to \`/join\`. To volunteer specifically for India Innovates 2026 Hackathon, give them: https://tally.so/r/b57gp6
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
      name: "get_site_section",
      description:
        "Fetch live HTML for a section of the Bits&Bytes site. USE THIS OFTEN to read the latest content about projects, impact, about page details, or Code of Conduct guidelines.",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["home", "about", "impact", "join", "contact", "coc", "events"],
          },
        },
        required: ["section"],
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
]

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

  // Passing back only the necessary data to the client so it can run the fetch client-side securely
  return {
    success: true,
    message: "Valid details received! I am preparing the form submission from your browser right now.",
    formData: {
      name,
      email,
      subject: subject || "New contact from Bits&Bytes assistant",
      message,
    }
  }
}

async function handleGetSiteSectionTool(section: string, req: NextRequest) {
  const path = sectionToPath(section)
  const origin = new URL(req.url).origin

  const res = await fetch(`${origin}${path}`, {
    // Always fetch fresh content while keeping this reasonably fast.
    cache: "no-store",
  })

  const html = await res.text()

  // Avoid sending extremely large payloads back into the model
  const maxLength = 4000
  const snippet = html.length > maxLength ? html.slice(0, maxLength) : html

  return {
    section,
    path,
    htmlSnippet: snippet,
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const clientMessages = (body?.messages ?? []) as ClientMessage[]

    if (!Array.isArray(clientMessages) || clientMessages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 })
    }

    const baseMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SITE_CONTEXT,
      },
      ...mapClientMessagesToOpenAI(clientMessages),
    ]

    const runCompletion = async (model: string, messages: OpenAI.Chat.ChatCompletionMessageParam[]) => {
      return openai.chat.completions.create({
        model,
        messages,
        tools,
        tool_choice: "auto",
        max_tokens: 400,
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

      if (!message?.tool_calls || message.tool_calls.length === 0) {
        break // No more tool calls required
      }

      currentMessages.push(message)

      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name
        let toolArgs: any = {}
        try {
          toolArgs = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {}
        } catch {
          toolArgs = {}
        }

        let toolResult: any = null

        if (toolName === "submit_contact_form") {
          toolResult = await handleSubmitContactTool(toolArgs)
          if (toolResult.success && toolResult.formData) {
            actionToClient = { type: "submit_form" as const, formData: toolResult.formData }
          }
        } else if (toolName === "suggest_navigation") {
          const path = normalizePath(toolArgs?.path)
          toolResult = { success: true, path }
          actionToClient = { type: "navigate" as const, path }
        } else if (toolName === "get_site_section") {
          toolResult = await handleGetSiteSectionTool(toolArgs?.section ?? "home", req)
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
      return await streamAssistantResponse(modelUsed, currentMessages, actionToClient)
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
  action?: AssistantAction
) {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 400,
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
        for await (const part of completion) {
          const delta = part.choices[0]?.delta

          if (delta?.content) {
            send({ type: "token", content: delta.content })
          }
        }

        send({ type: "done", action: action ?? null })
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
