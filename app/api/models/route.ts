import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const response = await fetch("https://hnd1.aihub.zeabur.ai/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.ZEABUR_API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Models API Error:", errorText)
      return new Response(JSON.stringify({ error: errorText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    const data = await response.json()
    console.log("[v0] Available models:", JSON.stringify(data, null, 2))

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] Models API Error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch models" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
