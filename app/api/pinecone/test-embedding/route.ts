import { NextResponse } from "next/server"
import { createEmbeddingsWithPinecone } from "@/lib/pinecone-utils"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Texto não fornecido" }, { status: 400 })
    }

    // Criar embedding usando a API de inferência do Pinecone
    const embeddings = await createEmbeddingsWithPinecone([text])

    return NextResponse.json({
      message: "Embedding criado com sucesso",
      dimensions: embeddings[0].length,
      embedding: embeddings[0].slice(0, 10) + "...", // Mostrar apenas os primeiros 10 valores para legibilidade
    })
  } catch (error: any) {
    console.error("Erro ao criar embedding:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
