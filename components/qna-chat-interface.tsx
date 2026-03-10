"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import type { KeyboardEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts"

import { Mic, Send, Info, Bot, Trash, MapPin } from "lucide-react"

interface ChatMessage {
    id: number
    role: "user" | "assistant"
    content: string
}

const MAX_CHARS = 2000
const MAX_HISTORY = 20
const STORAGE_KEY = "bb-qna-assistant-state-v1"
const QUICK_PROMPTS = [
    "Tell me about GitHub Copilot Dev Days.",
    "How do I join the Copilot event?",
    "Tell me about India Innovates 2026.",
    "What are the domains for India Innovates?",
    "What is the Bits&Bytes club?",
    "How can I join Bits&Bytes?",
]

type StreamPayload =
    | { type: "meta"; model: string }
    | { type: "token"; content: string }
    | { type: "done"; action?: { type: string; path?: string; textSnippet?: string } | null }
    | { type: "error"; message?: string }

type StoredAssistantState = {
    messages?: ChatMessage[]
    draft?: string
}


import { PromptBox } from "@/components/ui/chatgpt-prompt-input"

export function QnAChatInterface() {
    const [message, setMessage] = useState("")
    const [charCount, setCharCount] = useState(0)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [modelName, setModelName] = useState("gpt-5-mini-2025-08-07")
    const [hasHydrated, setHasHydrated] = useState(false)

    // Using `any` ref to bridge custom PromptBoxRef since it exposes .focus()
    const promptBoxRef = useRef<{ focus: () => void, setValue: (val: string) => void } | null>(null)
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const nextIdRef = useRef(1)
    const streamControllerRef = useRef<AbortController | null>(null)
    const router = useRouter()

    const appendMessage = useCallback((newMessage: ChatMessage) => {
        setMessages((prev) => {
            const updated = [...prev, newMessage]
            return updated.length > MAX_HISTORY ? updated.slice(updated.length - MAX_HISTORY) : updated
        })
    }, [])

    const updateMessageContent = useCallback((messageId: number, updater: (prev: string) => string) => {
        setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, content: updater(m.content) } : m))
        )
    }, [])

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    useEffect(() => {
        if (typeof window === "undefined") return
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored) as StoredAssistantState
                if (Array.isArray(parsed.messages)) {
                    const sanitized = parsed.messages
                        .filter(
                            (m): m is ChatMessage =>
                                m != null &&
                                (m.role === "user" || m.role === "assistant") &&
                                typeof m.content === "string"
                        )
                        .map((m, index) => ({
                            ...m,
                            id: typeof m.id === "number" ? m.id : index + 1,
                        }))
                    setMessages(sanitized.slice(-MAX_HISTORY))
                    const maxId = sanitized.reduce((acc, m) => (m.id > acc ? m.id : acc), 0)
                    nextIdRef.current = Math.max(maxId + 1, nextIdRef.current)
                }
                if (typeof parsed.draft === "string") {
                    setMessage(parsed.draft)
                    setCharCount(parsed.draft.length)
                }
            }
        } catch (err) {
            console.error("Failed to restore assistant history:", err)
        } finally {
            setHasHydrated(true)
        }
    }, [])

    useEffect(() => {
        if (!hasHydrated || typeof window === "undefined") return
        const payload: StoredAssistantState = {
            messages,
            draft: message,
        }
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        } catch (err) {
            console.error("Failed to persist assistant history:", err)
        }
    }, [messages, message, hasHydrated])

    useEffect(() => {
        return () => {
            streamControllerRef.current?.abort()
        }
    }, [])

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length > MAX_CHARS) return
        setMessage(value)
        setCharCount(value.length)
    }

    const handleQuickPrompt = (prompt: string) => {
        setMessage(prompt)
        setCharCount(prompt.length)
        setTimeout(() => {
            promptBoxRef.current?.focus()
        }, 0)
    }

    const handleSend = async (manualMessagePayload?: string) => {
        const textToUse = (typeof manualMessagePayload === "string" ? manualMessagePayload : message);
        const trimmed = textToUse.trim();
        if (!trimmed || isLoading) return

        const payloadMessages = [
            ...messages.map((m) => ({
                role: m.role,
                content: m.content,
            })),
            {
                role: "user" as const,
                content: trimmed,
            },
        ]

        const userMessage: ChatMessage = {
            id: nextIdRef.current++,
            role: "user",
            content: trimmed,
        }

        appendMessage(userMessage)
        setMessage("")
        setCharCount(0)
        setIsLoading(true)
        setError(null)

        const assistantMessageId = nextIdRef.current++
        appendMessage({
            id: assistantMessageId,
            role: "assistant",
            content: "",
        })

        streamControllerRef.current?.abort()
        const controller = new AbortController()
        streamControllerRef.current = controller

        try {
            const res = await fetch("/api/assistant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: payloadMessages }),
                signal: controller.signal,
            })

            const contentType = res.headers.get("content-type") ?? ""
            if (!res.ok || !contentType.includes("text/event-stream") || !res.body) {
                const data = await res.json().catch(() => ({}))
                throw new Error((data as { error?: string }).error ?? "Failed to reach assistant")
            }

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ""
            let navigatePath: string | null = null

            while (true) {
                const { value, done } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })
                const events = buffer.split("\n\n")
                buffer = events.pop() ?? ""

                for (const event of events) {
                    const dataLine = event
                        .split("\n")
                        .filter((line) => line.startsWith("data:"))
                        .map((line) => line.replace(/^data:\s*/, ""))
                        .join("")
                    if (!dataLine) continue

                    let payload: StreamPayload
                    try {
                        payload = JSON.parse(dataLine) as StreamPayload
                    } catch {
                        continue
                    }

                    if (payload.type === "meta" && "model" in payload) {
                        setModelName(payload.model)
                    } else if (payload.type === "token" && "content" in payload) {
                        const chunk = payload.content
                        updateMessageContent(assistantMessageId, (prev) => prev + chunk)
                    } else if (payload.type === "error") {
                        setError(payload.message ?? "Assistant stream error.")
                    } else if (payload.type === "done") {
                        const actionData = payload.action
                        if (actionData?.type === "navigate" && typeof actionData.path === "string") {
                            navigatePath = actionData.path
                        }
                    }
                }
            }

            updateMessageContent(assistantMessageId, (prev) => {
                if (prev && prev.trim().length > 0) return prev
                if (navigatePath) return "Taking you there! 🚀"
                return "I'm not sure about that based on the information publicly available on this site."
            })

            if (navigatePath) {
                router.push(navigatePath)
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") {
                return
            }
            console.error(err)
            setError("Something went wrong while contacting the assistant.")
            updateMessageContent(assistantMessageId, (prev) => prev || "Sorry, I couldn't answer that right now.")
        } finally {
            streamControllerRef.current = null
            setIsLoading(false)
        }
    }


    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto rounded-none sm:rounded-3xl overflow-hidden border-0 sm:border border-zinc-700/60 bg-zinc-950/70 shadow-2xl backdrop-blur-3xl relative">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-zinc-800/80 bg-zinc-900/50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[var(--brand-pink)] shadow-lg shadow-[#e45a92]/40">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">Bits&Bytes Assistant <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span></h1>
                        <span className="text-xs text-zinc-400">
                            Official Code Club QnA Bot
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {messages.length > 0 && (
                        <span className="hidden sm:inline-block rounded-full bg-zinc-800/80 px-3 py-1 text-[10px] font-medium text-zinc-300">
                            {modelName}
                        </span>
                    )}
                    <button
                        onClick={() => {
                            setMessages([])
                            setCharCount(0)
                            setMessage("")
                            window.localStorage.removeItem(STORAGE_KEY)
                        }}
                        className={`flex h-9 items-center justify-center gap-2 rounded-xl bg-zinc-800/60 px-3 text-xs font-medium border transition-all ${messages.length === 0 ? "opacity-0 invisible" : "text-zinc-400 hover:bg-zinc-800 hover:text-red-400 border-transparent hover:border-red-900/50"}`}
                        aria-label="Clear chat session"
                        title="Clear chat session"
                    >
                        <Trash className="h-4 w-4" />
                        <span className="hidden sm:inline">Clear Chat</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 relative text-zinc-100 scroll-smooth">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-2xl mx-auto space-y-6">
                        <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 text-sm text-zinc-300 shadow-lg">
                            <p className="mb-2 font-medium text-white text-base">Hello! I'm the Bits&Bytes AI Assistant.</p>
                            <p>Ask me anything about our mission, team structure, events like GitHub Copilot Dev Days and India Innovates 2026, impact stats, or how to get involved. I derive my answers purely from the public knowledge available in this project.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {QUICK_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => handleQuickPrompt(prompt)}
                                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-300 text-left transition hover:border-[#e45a92]/60 hover:bg-zinc-800 hover:text-white group flex items-start gap-3"
                                >
                                    <span className="text-[#e45a92] opacity-70 group-hover:opacity-100 mt-0.5">↳</span>
                                    <span>{prompt}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="space-y-6 flex flex-col pb-4">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            {m.role === "assistant" && (
                                <div className="hidden sm:flex self-end mr-3 mb-1 w-8 h-8 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700/50 flex-shrink-0">
                                    <Bot className="w-4 h-4 text-[#e45a92]" />
                                </div>
                            )}
                            <div
                                className={`w-fit max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 text-[0.9rem] leading-relaxed shadow-sm ${m.role === "user"
                                    ? "bg-[#e45a92] text-white rounded-br-sm"
                                    : "border border-zinc-700/60 bg-zinc-900/90 text-zinc-100 rounded-bl-sm prose prose-invert prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-li:my-1 max-w-none"
                                    }`}
                            >
                                {m.role === "user" ? (
                                    m.content
                                ) : (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                                            a: ({ href, title, children, ...props }) => {
                                                if (title === "button" || title === "cta") {
                                                    return (
                                                        <a
                                                            href={href}
                                                            className="inline-flex my-2 w-full sm:w-auto items-center justify-center rounded-xl bg-[var(--brand-pink)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#e45a92]/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#e45a92]/40"
                                                            {...props}
                                                        >
                                                            {children}
                                                        </a>
                                                    )
                                                }
                                                if (title === "follow-up") {
                                                    return (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                const promptText = Array.isArray(children) ? children.join("") : String(children)
                                                                handleQuickPrompt(promptText)
                                                            }}
                                                            className="block w-full mt-3 text-left rounded-xl border border-zinc-700/80 bg-zinc-800/60 px-4 py-3 text-sm text-zinc-200 transition-all hover:border-[#e45a92] hover:bg-zinc-800 hover:text-white"
                                                        >
                                                            ↳ {children}
                                                        </button>
                                                    )
                                                }
                                                if (href?.startsWith("#")) {
                                                    return (
                                                        <a href={href} className="text-[#e45a92] font-medium hover:underline underline-offset-4" {...props}>
                                                            {children}
                                                        </a>
                                                    )
                                                }
                                                if (href?.includes("google.com/maps") || href?.includes("maps.app.goo.gl")) {
                                                    return (
                                                        <a
                                                            href={href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-4 mb-2 flex flex-col gap-2 rounded-2xl border border-zinc-700/50 bg-zinc-900/50 p-4 transition-all hover:bg-zinc-800/80 hover:border-emerald-500/50 group no-underline"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                                                    <MapPin className="h-5 w-5 text-emerald-400" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-zinc-100 m-0">View Venue on Map</h4>
                                                                    <p className="text-xs text-zinc-400 m-0 mt-0.5 group-hover:text-zinc-300 transition-colors">Opens in Google Maps</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    )
                                                }
                                                return (
                                                    <a href={href} className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline underline-offset-4" target="_blank" rel="noreferrer" {...props}>
                                                        {children}
                                                    </a>
                                                )
                                            },
                                            code: ({ className, children, ...props }) => {
                                                const match = /language-([\w-]+)/.exec(className || "")
                                                const isChart = match && match[1] === "chart"
                                                const isDiscordWidget = match && match[1] === "discord-widget"

                                                if (isDiscordWidget) {
                                                    const serverId = String(children).trim()
                                                    return (
                                                        <div className="my-4 rounded-2xl overflow-hidden border border-[#5865F2]/30 bg-zinc-900/60">
                                                            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#5865F2]/10 border-b border-[#5865F2]/20">
                                                                <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.034.048a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                                                                <span className="text-sm font-semibold text-[#5865F2]">India Innovates · Discord</span>
                                                            </div>
                                                            <iframe
                                                                src={`https://discord.com/widget?id=${serverId}&theme=dark`}
                                                                width="100%"
                                                                height="400"
                                                                allowTransparency={true}
                                                                frameBorder="0"
                                                                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                                                                className="block"
                                                            />
                                                        </div>
                                                    )
                                                }

                                                if (isChart) {
                                                    try {
                                                        const rawData = String(children).replace(/\n$/, "")
                                                        const data = JSON.parse(rawData)
                                                        if (Array.isArray(data)) {
                                                            return (
                                                                <div className="my-6 h-64 w-full rounded-2xl bg-zinc-950 p-4 border border-zinc-800 px-2 sm:px-4">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#a1a1aa" />
                                                                            <Tooltip
                                                                                cursor={{ fill: "#27272a", opacity: 0.4 }}
                                                                                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#f4f4f5" }}
                                                                                itemStyle={{ color: "#e45a92" }}
                                                                            />
                                                                            <Bar dataKey="value" fill="#e45a92" radius={[6, 6, 0, 0]} maxBarSize={50} />
                                                                        </BarChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                            )
                                                        }
                                                    } catch (e) {
                                                        return <div className="my-2 p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 text-sm">Error visualizing chart data</div>
                                                    }
                                                }

                                                const isInline = !match
                                                return (
                                                    <code
                                                        className={`${isInline
                                                            ? "rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[0.85em] font-medium"
                                                            : "block rounded-2xl bg-[#0d0d0f] p-4 text-[0.85em] overflow-x-auto border border-zinc-800 text-zinc-300 my-4 shadow-inner custom-scrollbar"
                                                            } ${className || ""}`}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                )
                                            },
                                        }}
                                    >
                                        {m.content || "..."}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="hidden sm:flex self-end mr-3 mb-1 w-8 h-8 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700/50 flex-shrink-0">
                                <Bot className="w-4 h-4 text-[#e45a92]" />
                            </div>
                            <div className="rounded-2xl border border-zinc-700/60 bg-zinc-900/90 rounded-bl-sm px-6 py-4 flex items-center gap-2 text-sm text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#e45a92] animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#e45a92] animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#e45a92] animate-bounce" style={{ animationDelay: "300ms" }} />
                                </span>
                            </div>
                        </div>
                    )}
                    {error && <div className="p-3 mx-auto w-full max-w-sm text-center rounded-xl bg-red-950/50 border border-red-900/50 text-sm text-red-400">{error}</div>}
                </div>
            </div>

            <div className="p-4 w-full bg-zinc-950/95 shrink-0 relative z-20">
                <PromptBox
                    ref={promptBoxRef}
                    value={message}
                    onChange={handleInputChange}
                    onSubmitMessage={(msg: string) => handleSend(msg)}
                />
            </div>
        </div>
    )
}

