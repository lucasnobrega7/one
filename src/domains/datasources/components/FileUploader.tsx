"use client"

import type React from "react"

import { useState } from "react"
import { fileUploadService } from "../services/fileUploadService"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

interface FileUploaderProps {
  knowledgeBaseId: string
  userId: string
  onUploadComplete?: (fileInfo: any) => void
}

export function FileUploader({ knowledgeBaseId, userId, onUploadComplete }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const file = files[0]

      // Track the upload attempt
      trackEvent("document_upload_started", {
        fileType: file.type,
        fileSize: file.size,
        knowledgeBaseId,
      })

      // Upload the file
      const fileInfo = await fileUploadService.uploadDocument(file, {
        documentType: file.type,
        knowledgeBaseId,
        userId,
      })

      // Track successful upload
      trackEvent("document_upload_completed", {
        fileType: file.type,
        fileSize: file.size,
        knowledgeBaseId,
      })

      if (onUploadComplete) {
        onUploadComplete(fileInfo)
      }
    } catch (err) {
      console.error("Upload failed:", err)
      setError("Failed to upload file. Please try again.")

      // Track upload failure
      trackEvent("document_upload_failed", {
        knowledgeBaseId,
        error: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
          accept=".pdf,.doc,.docx,.txt,.md"
        />
        <label
          htmlFor="file-upload"
          className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? "Uploading..." : "Select File"}
        </label>
        <Button type="button" disabled={isUploading} onClick={() => document.getElementById("file-upload")?.click()}>
          Upload Document
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
