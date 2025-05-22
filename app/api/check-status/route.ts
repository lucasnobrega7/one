import { NextResponse } from "next/server"
import { OpenAI } from "openai"
import { CohereClient } from "cohere-ai"
import { db } from "@/lib/db"
import { getPineconeClient } from "@/lib/pinecone-utils"
import { sql } from "@vercel/postgres"

// Garantir que este código só é executado no servidor
export const runtime = "nodejs"

export async function GET() {
  const results = {
    openai: { status: false, message: "" },
    cohere: { status: false, message: "" },
    pinecone: { status: false, message: "" },
    neon: { status: false, message: "" },
  }

  // Verificar OpenAI
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("API key não configurada")
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    })

    results.openai.status = !!response.choices[0].message
    results.openai.message = "API funcionando corretamente"
  } catch (error: any) {
    results.openai.message = `Erro: ${error.message}`
    console.error("Erro ao verificar OpenAI:", error)
  }

  // Verificar Cohere
  try {
    if (!process.env.COHERE_API_KEY) {
      throw new Error("API key não configurada")
    }

    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    })

    const response = await cohere.embed({
      texts: ["Hello"],
      model: "embed-english-v3.0",
    })

    results.cohere.status = !!response.embeddings
    results.cohere.message = "API funcionando corretamente"
  } catch (error: any) {
    results.cohere.message = `Erro: ${error.message}`
    console.error("Erro ao verificar Cohere:", error)
  }

  // Verificar Pinecone
  try {
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) {
      throw new Error("API key ou ambiente não configurados")
    }

    const pinecone = await getPineconeClient()
    const indexes = await pinecone.listIndexes()

    results.pinecone.status = Array.isArray(indexes)
    results.pinecone.message = "API funcionando corretamente"
  } catch (error: any) {
    results.pinecone.message = `Erro: ${error.message}`
    console.error("Erro ao verificar Pinecone:", error)
  }

  // Verificar Neon
  try {
    if (!process.env.NEON_NEON_DATABASE_URL) {
      throw new Error("URL do banco de dados não configurada")
    }

    // Executar uma consulta simples para verificar a conexão
    const result = await db.execute(sql`SELECT 1 as check_connection`)

    results.neon.status = !!result
    results.neon.message = "Banco de dados conectado corretamente"
  } catch (error: any) {
    results.neon.message = `Erro: ${error.message}`
    console.error("Erro ao verificar Neon:", error)
  }

  return NextResponse.json(results)
}
