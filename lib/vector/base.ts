import { SearchRequestSchema } from '@/lib/types/dtos'
import { AppDocument, ChunkMetadata, ChunkMetadataRetrieved } from '@/lib/types/document'
import type { Datastore } from '@prisma/client'

export const INDEX_NAME = 'agentes_conversao'

export abstract class VectorStoreManager<T extends Datastore> {
  datastore: T

  constructor(datastore: T) {
    this.datastore = datastore
  }

  abstract uploadDatasourceDocs(
    datasourceId: string,
    documents: AppDocument<ChunkMetadata>[]
  ): Promise<AppDocument<ChunkMetadata>[]>

  abstract remove(datasourceId: string): Promise<any>

  abstract removeBulk(datasourceIds: string[]): Promise<any>

  abstract delete(): Promise<any>

  abstract search(
    props: SearchRequestSchema
  ): Promise<AppDocument<ChunkMetadataRetrieved>[]>

  abstract getChunk(
    chunkId: string
  ): Promise<AppDocument<ChunkMetadataRetrieved>>

  abstract updateDatasourceMetadata(props: {
    datasourceId: string
    metadata: Partial<ChunkMetadata>
  }): Promise<any>
}