import { put, list, del } from "@vercel/blob"

/**
 * Uploads a file to Vercel Blob storage
 * @param file The file to upload
 * @param options Upload options including pathname and access policy
 * @returns The blob URL and other metadata
 */
export async function uploadToBlob(
  file: File | Buffer,
  options?: { pathname?: string; access?: "public" | "private" },
) {
  try {
    const blob = await put(options?.pathname || `${crypto.randomUUID()}`, file, {
      access: options?.access || "private",
    })

    return blob
  } catch (error) {
    console.error("Error uploading to Blob:", error)
    throw new Error("Failed to upload file to storage")
  }
}

/**
 * Lists files in Vercel Blob storage
 * @param options Listing options including prefix and limit
 * @returns List of blobs matching the criteria
 */
export async function listBlobFiles(options?: { prefix?: string; limit?: number }) {
  try {
    const blobs = await list({
      prefix: options?.prefix,
      limit: options?.limit || 100,
    })

    return blobs
  } catch (error) {
    console.error("Error listing Blob files:", error)
    throw new Error("Failed to list files from storage")
  }
}

/**
 * Deletes a file from Vercel Blob storage
 * @param url The URL of the blob to delete
 * @returns Success status
 */
export async function deleteFromBlob(url: string) {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("Error deleting from Blob:", error)
    throw new Error("Failed to delete file from storage")
  }
}
