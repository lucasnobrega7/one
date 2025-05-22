import { SupabaseVectorStore } from "langchain/vectorstores/supabase"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import type { Document } from "langchain/document"
import { supabaseAdmin } from "../../supabase/server"

/**
 * Classe para gerenciar o armazenamento de vetores no Supabase
 */
export class SupabaseVectorManager {
  private tableName: string
  private queryName: string
  private embeddings: OpenAIEmbeddings

  constructor(tableName = "knowledge_documents", queryName = "match_documents") {
    this.tableName = tableName
    this.queryName = queryName
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
    })
  }

  /**
   * Cria um novo armazenamento de vetores
   */
  async createVectorStore(documents: Document[]) {
    return await SupabaseVectorStore.fromDocuments(documents, this.embeddings, {
      client: supabaseAdmin,
      tableName: this.tableName,
      queryName: this.queryName,
    })
  }

  /**
   * Obtém um armazenamento de vetores existente
   */
  getVectorStore() {
    return new SupabaseVectorStore(this.embeddings, {
      client: supabaseAdmin,
      tableName: this.tableName,
      queryName: this.queryName,
    })
  }

  /**
   * Busca documentos similares a uma consulta
   */
  async similaritySearch(query: string, k = 4) {
    const vectorStore = this.getVectorStore()
    return await vectorStore.similaritySearch(query, k)
  }

  /**
   * Adiciona documentos ao armazenamento de vetores
   */
  async addDocuments(documents: Document[]) {
    const vectorStore = this.getVectorStore()
    return await vectorStore.addDocuments(documents)
  }

  /**
   * Remove documentos do armazenamento de vetores
   */
  async deleteDocuments(ids: string[]) {
    // Implementar lógica para excluir documentos pelo ID
    await supabaseAdmin.from(this.tableName).delete().in("id", ids)
  }
}
