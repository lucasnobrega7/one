import { type NextRequest, NextResponse } from "next/server"
import { queryPineconeIndex } from "@/lib/pinecone-utils"

export async function POST(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) {
      return NextResponse.json({ error: "Variáveis de ambiente do Pinecone não configuradas" }, { status: 500 })
    }

    // Obter a consulta do corpo da requisição
    const { query } = await request.json()

    // Consultar o índice do Pinecone
    const matches = await queryPineconeIndex(query, 5)

    // Retornar o resultado
    return NextResponse.json({ matches })
  } catch (error: any) {
    console.error("Erro ao testar Pinecone:", error)
    return NextResponse.json({ error: error.message || "Erro ao conectar com a API do Pinecone" }, { status: 500 })
  }
}
