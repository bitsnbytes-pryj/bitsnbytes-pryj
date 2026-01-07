"use client"

import { Mail, MapPin, Clock, Loader2, Github, Linkedin, Instagram } from "lucide-react"
import { useState, FormEvent, Suspense } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

import { PageSection } from "@/components/page-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { LoadingInline } from "@/components/loading-wrapper"

// Lazy load heavy components
const ContactCard = dynamic(() => import("@/components/ui/contact-card").then(mod => ({ default: mod.ContactCard })), {
  loading: () => <LoadingInline />,
  ssr: true
})

const WebGLShader = dynamic(() => import("@/components/ui/web-gl-shader").then(mod => ({ default: mod.WebGLShader })), {
  loading: () => null,
  ssr: false
})

const fieldClass =
  "w-full rounded-2xl border border-white/20 bg-card/90 px-4 py-3 text-base text-foreground shadow-inner shadow-black/5 transition focus:border-[var(--brand-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/30 dark:border-white/15 dark:bg-white/5 dark:text-white"

import { GlassContainer } from "@/components/ui/glass-container"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = (formData.get("name") as string) || ""
    const email = (formData.get("email") as string) || ""
    const subject = (formData.get("subject") as string) || ""
    const message = (formData.get("message") as string) || ""

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to send message.")
      }

      setStatus({ type: "success", message: "Message sent successfully. We’ll get back to you soon." })
      form.reset()
    } catch (err) {
      console.error(err)
      setStatus({
        type: "error",
        message: "Something went wrong while sending your message. Please try again in a moment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden text-white">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-24">
          <GlassContainer className="px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                Contact
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl">
                Let's co-create <br className="hidden sm:block" /> the next big sprint
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                Partner with us on hackathons, workshops, or custom experiences for schools across Lucknow.
              </p>
            </div>
          </GlassContainer>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        <PageSection
          align="center"
          eyebrow="Contact"
          title="Reach the team"
          description="We love partnering with schools, sponsors, mentors, and students. Drop a note and we'll get back within a couple days."
        >
          <div className="mx-auto w-full max-w-5xl">
            <GlassContainer className="p-0 overflow-hidden" glowColor="both">
              <div className="grid md:grid-cols-5 h-full">
                {/* Info Sidebar */}
                <div className="md:col-span-2 bg-white/5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10">
                  <h3 className="font-display text-2xl font-black text-white mb-6">Get in Touch</h3>
                  <div className="space-y-8">
                    {[
                      { icon: Mail, label: "Email", value: "hello@gobitsnbytes.org", color: "text-(--brand-pink)" },
                      { icon: MapPin, label: "Location", value: "Lucknow, India", color: "text-(--brand-purple)" },
                      { icon: Clock, label: "Established", value: "Teen-led since 2025", color: "text-blue-400" },
                    ].map((info) => (
                      <div key={info.label} className="flex items-start gap-4">
                        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10", info.color)}>
                          <info.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-white/50">{info.label}</p>
                          <p className="text-base font-black text-white mt-0.5">{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Section */}
                <div className="md:col-span-3 p-8 md:p-12 bg-black/20">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-white/70">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-(--brand-pink) focus:ring-(--brand-pink)/20 text-white placeholder:text-white/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-white/70">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@email.com"
                          className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-(--brand-pink) focus:ring-(--brand-pink)/20 text-white placeholder:text-white/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-bold uppercase tracking-widest text-white/70">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Reason for reaching out"
                        className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-(--brand-pink) focus:ring-(--brand-pink)/20 text-white placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-white/70">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us what's on your mind..."
                        className="bg-white/5 border-white/10 rounded-2xl focus:border-(--brand-pink) focus:ring-(--brand-pink)/20 text-white placeholder:text-white/20 min-h-[150px] resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full h-16 rounded-full bg-(--brand-pink) text-lg font-black text-white shadow-[0_0_30px_rgba(228,90,146,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(228,90,146,0.7)] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>

                    {status && (
                      <p className={cn(
                        "text-sm font-bold text-center p-4 rounded-2xl",
                        status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}>
                        {status.message}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </GlassContainer>

            {/* Social Links Section */}
            <div className="mt-20">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-white/50 mb-8">Connect with us</p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {[
                  { icon: Github, label: "GitHub", href: "https://github.com/gobitsnbytes" },
                  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/gobitsbytes" },
                  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/bitsnbytes.lko" },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <GlassContainer className="px-8 py-4 flex items-center gap-3 transition-transform group-hover:scale-105" glowColor="none">
                      <social.icon className="h-5 w-5 text-(--brand-pink) transition-transform group-hover:rotate-12" />
                      <span className="font-black text-white uppercase tracking-widest text-xs">{social.label}</span>
                    </GlassContainer>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  )
}
