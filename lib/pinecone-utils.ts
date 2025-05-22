import { Pinecone } from "@pinecone-database/pinecone"
import { OpenAIEmbeddings } from "@langchain/openai"
import type { Document } from "langchain/document"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

// Função para obter o cliente Pinecone com tratamento de erros melhorado
export async function getPineconeClient() {
  try {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY não está configurada")
    }

    if (!process.env.PINECONE_ENVIRONMENT) {
      throw new Error("PINECONE_ENVIRONMENT não está configurada")
    }

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    })

    return pinecone
  } catch (error: any) {
    console.error("Erro ao inicializar cliente Pinecone:", error)
    throw new Error(`Falha ao inicializar Pinecone: ${error.message}`)
  }
}

// Função para consultar o índice Pinecone com tratamento de erros melhorado
export async function queryPineconeIndex(indexName: string, query: string, topK = 5) {
  try {
    const pinecone = await getPineconeClient()

    // Verificar se o índice existe
    const indexes = await pinecone.listIndexes()
    if (!indexes.includes(indexName)) {
      throw new Error(`Índice '${indexName}' não encontrado no Pinecone`)
    }

    const index = pinecone.index(indexName)

    // Criar embeddings para a consulta
    let embeddings
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY não está configurada para criar embeddings")
      }

      const embeddingModel = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
      })

      embeddings = await embeddingModel.embedQuery(query)
    } catch (error: any) {
      console.error("Erro ao criar embeddings:", error)
      throw new Error(`Falha ao criar embeddings: ${error.message}`)
    }

    // Consultar o índice
    const queryResult = await index.query({
      vector: embeddings,
      topK,
      includeMetadata: true,
    })

    return queryResult
  } catch (error: any) {
    console.error("Erro ao consultar índice Pinecone:", error)
    throw new Error(`Falha ao consultar Pinecone: ${error.message}`)
  }
}

// Função para processar documentos e armazená-los no Pinecone
export async function processDocumentsWithPinecone(indexName: string, documents: Document[]) {
  try {
    const pinecone = await getPineconeClient()

    // Verificar se o índice existe
    const indexes = await pinecone.listIndexes()
    if (!indexes.includes(indexName)) {
      throw new Error(`Índice '${indexName}' não encontrado no Pinecone`)
    }

    const index = pinecone.index(indexName)

    // Dividir documentos em chunks menores
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const chunks = await textSplitter.splitDocuments(documents)
    console.log(`Dividido em ${chunks.length} chunks`)

    // Criar embeddings para os chunks
    const vectors = []
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY não está configurada para criar embeddings")
      }

      const embeddingModel = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
      })

      for (const chunk of chunks) {
        const embedding = await embeddingModel.embedQuery(chunk.pageContent)
        vectors.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          values: embedding,
          metadata: {
            ...chunk.metadata,
            text: chunk.pageContent,
          },
        })
      }
    } catch (error: any) {
      console.error("Erro ao criar embeddings para documentos:", error)
      throw new Error(`Falha ao criar embeddings para documentos: ${error.message}`)
    }

    // Upsert vetores no índice
    if (vectors.length > 0) {
      await index.upsert(vectors)
      console.log(`${vectors.length} vetores inseridos no Pinecone`)
    }

    return { success: true, count: vectors.length }
  } catch (error: any) {
    console.error("Erro ao processar documentos com Pinecone:", error)
    throw new Error(`Falha ao processar documentos: ${error.message}`)
  }
}

// Função para criar embeddings com tratamento de erros melhorado
export async function createEmbeddingsWithPinecone(text: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY não está configurada para criar embeddings")
    }

    const embeddingModel = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
    })

    const embedding = await embeddingModel.embedQuery(text)
    return embedding
  } catch (error: any) {
    console.error("Erro ao criar embeddings:", error)
    throw new Error(`Falha ao criar embeddings: ${error.message}`)
  }
}
