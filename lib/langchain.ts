import { ChatOpenAI } from "@langchain/openai"
import { ConversationalRetrievalQAChain } from "langchain/chains"
import { queryPineconeIndex } from "./pinecone-utils"
import { Document } from "langchain/document"

// Classe personalizada para recuperar documentos do Pinecone
class PineconeRetriever {
  indexName: string

  constructor(indexName: string) {
    this.indexName = indexName
  }

  async getRelevantDocuments(query: string) {
    const matches = await queryPineconeIndex(query, 5)

    // Converter os resultados para o formato Document do LangChain
    return matches.map(
      (match) =>
        new Document({
          pageContent: match.metadata?.text || "",
          metadata: {
            source: match.metadata?.source || "",
            score: match.score,
          },
        }),
    )
  }
}

export async function createConversationalChain(indexName: string) {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  // Criar um retriever personalizado
  const retriever = new PineconeRetriever(indexName)

  return ConversationalRetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: true,
    questionGeneratorChainOptions: {
      llm: model,
    },
  })
}
