import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = (body?.name ?? "").toString().trim()
    const email = (body?.email ?? "").toString().trim()
    const school = (body?.school ?? "").toString().trim()
    const experience = (body?.experience ?? "").toString().trim()
    const interests = (Array.isArray(body?.interests) ? body.interests : []).join(", ")
    const message = (body?.message ?? "").toString().trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("join_requests").insert({
      name,
      email,
      school: school || null,
      experience: experience || null,
      interests: interests || null,
      message,
    })

    if (error) {
      console.error("Supabase join insert error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to submit join form." },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Join API error:", error)
    return NextResponse.json(
      { error: "Something went wrong while submitting the join form." },
      { status: 500 },
    )
  }
}
