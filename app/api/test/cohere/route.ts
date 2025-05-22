import { NextResponse } from "next/server"
import { CohereClient } from "cohere-ai"

export async function POST(req: Request) {
  try {
    // Verificar se a API key está configurada
    if (!process.env.COHERE_API_KEY) {
      console.error("COHERE_API_KEY não está configurada")
      return NextResponse.json({ error: "Configuração da API Cohere não encontrada" }, { status: 500 })
    }

    const { text } = await req.json()

    // Validar o formato dos dados
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Texto inválido ou não fornecido" }, { status: 400 })
    }

    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    })

    console.log("Enviando requisição para Cohere:", text)

    const response = await cohere.embed({
      texts: [text],
      model: "embed-english-v3.0",
    })

    console.log("Resposta recebida da Cohere:", response.statusCode)

    return NextResponse.json({
      embedding: response.embeddings[0],
      dimensions: response.embeddings[0].length,
    })
  } catch (error: any) {
    console.error("Erro na rota /api/test/cohere:", error)

    // Tratamento específico para erros da Cohere
    if (error.response) {
      console.error("Erro da API Cohere:", error.response.data)
      return NextResponse.json(
        { error: `Erro da API Cohere: ${error.response.data.message || "Erro desconhecido"}` },
        { status: error.response.status || 500 },
      )
    }

    return NextResponse.json(
      { error: `Erro ao obter resposta: ${error.message || "Erro desconhecido"}` },
      { status: 500 },
    )
  }
}
