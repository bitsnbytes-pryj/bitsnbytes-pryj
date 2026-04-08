import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, messageId, feedback, messageText, model } = body

    if (!sessionId || !messageId || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Since we are inserting feedback, we might just append it to a JSONB array or create a new table.
    // The plan says: feedback JSONB DEFAULT '[]' in chat_sessions.
    // But updating a JSONB array requires reading it first or using a postgres function.
    // Alternatively, we can just fetch the current session, append to feedback, and update.
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("feedback")
      .eq("session_id", sessionId)
      .single()

    const currentFeedback = session?.feedback || []
    currentFeedback.push({
      messageId,
      feedback,
      messageText,
      model,
      timestamp: new Date().toISOString()
    })

    const { error } = await supabase
      .from("chat_sessions")
      .update({ feedback: currentFeedback })
      .eq("session_id", sessionId)

    if (error) {
      // If session doesn't exist yet, we can't add feedback, but that's fine.
      // E.g. session was cleared or not saved yet.
      console.warn("Could not save feedback to session:", error)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Feedback API error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
