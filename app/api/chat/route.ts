import type { NextRequest } from "next/server"

const ZEABUR_API_URL = "https://hnd1.aihub.zeabur.ai/v1/chat/completions"
const DEFAULT_MODEL = "gemini-2.5-flash"

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json()

    const selectedModel = model || DEFAULT_MODEL

    const response = await fetch(ZEABUR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZEABUR_API_KEY}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Zeabur API Error:", errorData)
      return new Response(
        JSON.stringify({
          error: errorData?.error?.message || `API returned status ${response.status}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate response",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
