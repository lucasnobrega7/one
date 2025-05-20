import { uploadToBlob, deleteFromBlob } from "@/lib/blob"

/**
 * Service for handling file uploads for datasources
 */
export const fileUploadService = {
  /**
   * Upload a document file to blob storage
   * @param file The file to upload
   * @param metadata Additional metadata about the file
   * @returns The uploaded file information
   */
  async uploadDocument(
    file: File,
    metadata: {
      documentType: string
      knowledgeBaseId: string
      userId: string
    },
  ) {
    // Create a path for the file in the format: kb_{knowledgeBaseId}/{userId}/{timestamp}_{filename}
    const timestamp = Date.now()
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const pathname = `kb_${metadata.knowledgeBaseId}/${metadata.userId}/${timestamp}_${safeFilename}`

    // Upload to Vercel Blob
    const blob = await uploadToBlob(file, {
      pathname,
      access: "private", // Documents should be private by default
    })

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
      size: file.size,
      filename: file.name,
      ...metadata,
    }
  },

  /**
   * Delete a document from blob storage
   * @param url The URL of the document to delete
   * @returns Success status
   */
  async deleteDocument(url: string) {
    return await deleteFromBlob(url)
  },
}
