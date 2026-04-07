import { NextRequest, NextResponse } from "next/server"

// Lazy initialize OpenAI only when needed
async function getOpenAI() {
  if (!process.env.HACKCLUB_PROXY_API_KEY) {
    return null
  }
  
  try {
    const { OpenAI } = await import("openai")
    return new OpenAI({
      apiKey: process.env.HACKCLUB_PROXY_API_KEY,
      baseURL: "https://ai.hackclub.com/proxy/v1",
    })
  } catch (error) {
    console.warn("Failed to initialize OpenAI:", error)
    return null
  }
}

export async function POST(req: NextRequest) {
  const openai = await getOpenAI()
  
  if (!openai) {
    return NextResponse.json(
      { error: "Voice transcription is not configured. You can still use text chat normally." },
      { status: 200 }
    )
  }
  
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio")

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 })
    }

    try {
      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFile,
      })

      return NextResponse.json({ text: transcription.text })
    } catch (err: any) {
      const apiError = err
      const code = apiError?.code ?? apiError?.error?.code
      const status = apiError?.status

      // Project doesn't have access to whisper-1 – gracefully degrade.
      if (code === "model_not_found" || status === 403) {
        console.warn("Whisper model not available for this project; disabling voice transcription.")
        return NextResponse.json(
          {
            error:
              "Voice transcription model is not enabled for this project. You can still use text chat normally.",
          },
          { status: 200 }
        )
      }

      throw err
    }
  } catch (error) {
    console.error("Assistant voice API error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio." }, { status: 500 })
  }
}