import { z } from 'zod'

export const BaseDocumentMetadataSchema = z.object({
  datastore_id: z.string(),
  datasource_id: z.string(),
  datasource_name: z.string().optional(),
  datasource_type: z.string().optional(),
  source_url: z.string().optional(),
  custom_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  chunk_hash: z.string().optional(),
  chunk_offset: z.number().optional(),
  page_number: z.number().optional(),
  total_pages: z.number().optional(),
})

export const FileMetadataSchema = BaseDocumentMetadataSchema.extend({
  file_name: z.string(),
  file_type: z.string(),
  file_size: z.number().optional(),
  mime_type: z.string().optional(),
})

export type ChunkMetadata = z.infer<typeof BaseDocumentMetadataSchema>
export type FileMetadata = z.infer<typeof FileMetadataSchema>

export type ChunkMetadataRetrieved = ChunkMetadata & {
  chunk_id: string
  similarity_score?: number
}

export interface AppDocument<T = ChunkMetadata> {
  pageContent: string
  metadata: T
}

export interface Source {
  datasource_id: string
  datasource_name?: string
  datasource_type?: string
  source_url?: string
  page_number?: number
  chunk_id?: string
}

export const DocumentSchema = z.object({
  pageContent: z.string(),
  metadata: BaseDocumentMetadataSchema,
})