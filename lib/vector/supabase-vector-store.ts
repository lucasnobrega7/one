import { createClient } from '@/lib/supabase/server'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'

export interface VectorDocument {
  id: string
  content: string
  metadata: Record<string, any>
  embedding?: number[]
}

export class SupabaseVectorStoreService {
  private client: any
  private embeddings: OpenAIEmbeddings
  private tableName: string = 'documents'
  private queryName: string = 'match_documents'

  constructor() {
    this.client = createClient()
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-ada-002',
    })
  }

  async createVectorStore(datastoreId: string) {
    const vectorStore = await SupabaseVectorStore.fromTexts(
      [],
      [],
      this.embeddings,
      {
        client: this.client,
        tableName: this.tableName,
        queryName: this.queryName,
        filter: { datastore_id: datastoreId }
      }
    )
    return vectorStore
  }

  async addDocuments(
    datastoreId: string, 
    documents: { content: string; metadata?: Record<string, any> }[]
  ) {
    const vectorStore = await this.createVectorStore(datastoreId)
    
    const texts = documents.map(doc => doc.content)
    const metadatas = documents.map(doc => ({
      ...doc.metadata,
      datastore_id: datastoreId,
      created_at: new Date().toISOString()
    }))

    await vectorStore.addDocuments(
      documents.map((doc, i) => ({
        pageContent: doc.content,
        metadata: metadatas[i]
      }))
    )

    return { success: true, count: documents.length }
  }

  async similaritySearch(
    datastoreId: string,
    query: string,
    k: number = 5,
    filter?: Record<string, any>
  ) {
    const vectorStore = await this.createVectorStore(datastoreId)
    
    const searchFilter = {
      datastore_id: datastoreId,
      ...filter
    }

    const results = await vectorStore.similaritySearch(query, k, searchFilter)
    
    return results.map(doc => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      score: doc.metadata.similarity || 0
    }))
  }

  async deleteDocuments(datastoreId: string, documentIds: string[]) {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('datastore_id', datastoreId)
      .in('id', documentIds)

    if (error) {
      throw new Error(`Failed to delete documents: ${error.message}`)
    }

    return { success: true, deletedCount: documentIds.length }
  }

  async getDocumentCount(datastoreId: string) {
    const { count, error } = await this.client
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('datastore_id', datastoreId)

    if (error) {
      throw new Error(`Failed to get document count: ${error.message}`)
    }

    return count || 0
  }
}

export const vectorStoreService = new SupabaseVectorStoreService()