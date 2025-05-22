import { NextResponse } from "next/server"
import { getPineconeClient } from "@/lib/pinecone-utils"

export async function GET() {
  try {
    const pinecone = await getPineconeClient()

    // Obter informações sobre o índice "agentesdeconversao"
    const indexStats = await pinecone.index("agentesdeconversao").describeIndexStats()

    return NextResponse.json({
      message: "Informações do índice obtidas com sucesso",
      indexName: "agentesdeconversao",
      stats: indexStats,
    })
  } catch (error: any) {
    console.error("Erro ao obter informações do índice:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
