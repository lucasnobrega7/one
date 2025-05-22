import { NextResponse } from "next/server"

export async function GET() {
  const variables = [
    {
      name: "OpenAI API",
      status: process.env.OPENAI_API_KEY ? "success" : "error",
      message: process.env.OPENAI_API_KEY ? "API Key da OpenAI configurada" : "API Key da OpenAI não encontrada",
    },
    {
      name: "Cohere API",
      status: process.env.COHERE_API_KEY ? "success" : "error",
      message: process.env.COHERE_API_KEY ? "API Key da Cohere configurada" : "API Key da Cohere não encontrada",
    },
    {
      name: "Pinecone API",
      status: process.env.PINECONE_API_KEY && process.env.PINECONE_ENVIRONMENT ? "success" : "error",
      message:
        process.env.PINECONE_API_KEY && process.env.PINECONE_ENVIRONMENT
          ? "Configuração do Pinecone completa"
          : "Configuração do Pinecone incompleta",
    },
  ]
  return NextResponse.json({ variables })
}
