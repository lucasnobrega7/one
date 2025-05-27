import { createClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Datastore } from '@prisma/client'
import { AppDocument, ChunkMetadata, ChunkMetadataRetrieved } from '@/lib/types/document'
import { SearchRequestSchema } from '@/lib/types/dtos'
import { VectorStoreManager } from './base'
import { v4 as uuidv4 } from 'uuid'

type DatastoreType = Datastore & {
  config?: {
    tableName?: string
    queryName?: string
  }
}

export class SupabaseVectorManager extends VectorStoreManager<DatastoreType> {
  private client: any
  private embeddings: OpenAIEmbeddings
  private tableName: string
  private queryName: string

  constructor(datastore: DatastoreType) {
    super(datastore)
    
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      modelName: 'text-embedding-ada-002',
    })
    
    this.tableName = datastore.config?.tableName || 'document_chunks'
    this.queryName = datastore.config?.queryName || 'match_documents'
  }

  async initializeSchema() {
    // Create vector table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        metadata JSONB DEFAULT '{}',
        embedding VECTOR(1536),
        datastore_id UUID NOT NULL,
        datasource_id UUID NOT NULL,
        chunk_hash TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS ${this.tableName}_datastore_idx ON ${this.tableName}(datastore_id);
      CREATE INDEX IF NOT EXISTS ${this.tableName}_datasource_idx ON ${this.tableName}(datasource_id);
      CREATE INDEX IF NOT EXISTS ${this.tableName}_embedding_idx ON ${this.tableName} USING ivfflat (embedding vector_cosine_ops);
      
      CREATE OR REPLACE FUNCTION ${this.queryName}(
        query_embedding VECTOR(1536),
        match_threshold FLOAT DEFAULT 0.7,
        match_count INT DEFAULT 5,
        filter_datastore_id UUID DEFAULT NULL
      )
      RETURNS TABLE (
        id UUID,
        content TEXT,
        metadata JSONB,
        similarity FLOAT
      )
      LANGUAGE SQL STABLE
      AS $$
        SELECT
          id,
          content,
          metadata,
          1 - (embedding <=> query_embedding) AS similarity
        FROM ${this.tableName}
        WHERE 
          (filter_datastore_id IS NULL OR datastore_id = filter_datastore_id)
          AND 1 - (embedding <=> query_embedding) > match_threshold
        ORDER BY embedding <=> query_embedding
        LIMIT match_count;
      $$;
    `
    
    await this.client.rpc('exec', { sql: createTableSQL })
  }

  async uploadDatasourceDocs(
    datasourceId: string,
    documents: AppDocument<ChunkMetadata>[]
  ): Promise<AppDocument<ChunkMetadata>[]> {
    await this.initializeSchema()
    
    // Generate embeddings for all documents
    const texts = documents.map(doc => doc.pageContent)
    const embeddings = await this.embeddings.embedDocuments(texts)
    
    // Prepare data for insertion
    const insertData = documents.map((doc, index) => ({
      id: uuidv4(),
      content: doc.pageContent,
      metadata: doc.metadata,
      embedding: embeddings[index],
      datastore_id: this.datastore.id,
      datasource_id: datasourceId,
      chunk_hash: doc.metadata.chunk_hash,
    }))
    
    const { error } = await this.client
      .from(this.tableName)
      .insert(insertData)
    
    if (error) {
      throw new Error(`Failed to upload documents: ${error.message}`)
    }
    
    return documents
  }

  async remove(datasourceId: string): Promise<any> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('datastore_id', this.datastore.id)
      .eq('datasource_id', datasourceId)
    
    if (error) {
      throw new Error(`Failed to remove datasource: ${error.message}`)
    }
    
    return { success: true }
  }

  async removeBulk(datasourceIds: string[]): Promise<any> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('datastore_id', this.datastore.id)
      .in('datasource_id', datasourceIds)
    
    if (error) {
      throw new Error(`Failed to remove datasources: ${error.message}`)
    }
    
    return { success: true }
  }

  async delete(): Promise<any> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('datastore_id', this.datastore.id)
    
    if (error) {
      throw new Error(`Failed to delete datastore: ${error.message}`)
    }
    
    return { success: true }
  }

  async search(props: any): Promise<AppDocument<ChunkMetadataRetrieved>[]> {
    const { query, topK = 5, threshold = 0.7 } = props
    
    // Generate embedding for the query
    const queryEmbedding = await this.embeddings.embedQuery(query)
    
    // Perform similarity search
    const { data, error } = await this.client.rpc(this.queryName, {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: topK,
      filter_datastore_id: this.datastore.id,
    })
    
    if (error) {
      throw new Error(`Search failed: ${error.message}`)
    }
    
    return data.map((item: any) => ({
      pageContent: item.content,
      metadata: {
        ...item.metadata,
        chunk_id: item.id,
        similarity_score: item.similarity,
      },
    }))
  }

  async getChunk(chunkId: string): Promise<AppDocument<ChunkMetadataRetrieved>> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('id', chunkId)
      .eq('datastore_id', this.datastore.id)
      .single()
    
    if (error) {
      throw new Error(`Failed to get chunk: ${error.message}`)
    }
    
    return {
      pageContent: data.content,
      metadata: {
        ...data.metadata,
        chunk_id: data.id,
      },
    }
  }

  async updateDatasourceMetadata(props: {
    datasourceId: string
    metadata: Partial<ChunkMetadata>
  }): Promise<any> {
    const { datasourceId, metadata } = props
    
    const { error } = await this.client
      .from(this.tableName)
      .update({ metadata })
      .eq('datastore_id', this.datastore.id)
      .eq('datasource_id', datasourceId)
    
    if (error) {
      throw new Error(`Failed to update metadata: ${error.message}`)
    }
    
    return { success: true }
  }
}