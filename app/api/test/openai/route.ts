import { type NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"

export async function POST(request: NextRequest) {
  try {
    // Verificar se a API key está configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "API key da OpenAI não configurada" }, { status: 500 })
    }

    // Obter o prompt do corpo da requisição
    const { prompt } = await request.json()

    // Inicializar o cliente da OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Fazer a requisição para a API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    })

    // Retornar o resultado
    return NextResponse.json({
      result: response.choices[0].message.content,
      model: response.model,
      usage: response.usage,
    })
  } catch (error: any) {
    console.error("Erro ao testar OpenAI:", error)
    return NextResponse.json({ error: error.message || "Erro ao conectar com a API da OpenAI" }, { status: 500 })
  }
}
