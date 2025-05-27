import { Datastore, DatastoreType } from '@prisma/client'
import { SupabaseVectorManager } from './supabase-vector-store'
import { VectorStoreManager } from './base'

export function createVectorStoreManager(datastore: Datastore): VectorStoreManager<Datastore> {
  switch (datastore.type) {
    case DatastoreType.supabase_vector:
      return new SupabaseVectorManager(datastore)
    case DatastoreType.qdrant:
      // TODO: Implement QdrantManager
      throw new Error('Qdrant vector store not implemented yet')
    case DatastoreType.pinecone:
      // TODO: Implement PineconeManager  
      throw new Error('Pinecone vector store not implemented yet')
    default:
      throw new Error(`Unsupported datastore type: ${datastore.type}`)
  }
}

export { VectorStoreManager } from './base'
export { SupabaseVectorManager } from './supabase-vector-store'
export * from '../types/document'
export * from '../types/dtos'