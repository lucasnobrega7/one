import { NextResponse } from "next/server"
import { getPineconeClient } from "@/lib/pinecone-utils"

export async function GET() {
  try {
    const pinecone = await getPineconeClient()

    // Listar índices para verificar a conexão
    const indexes = await pinecone.listIndexes()

    return NextResponse.json({
      message: "Conexão com o Pinecone estabelecida com sucesso",
      indexes: indexes,
    })
  } catch (error: any) {
    console.error("Erro ao conectar ao Pinecone:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
