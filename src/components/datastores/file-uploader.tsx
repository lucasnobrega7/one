"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, File, Check, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

interface FileUploaderProps {
  datastoreId: string
  onUploadComplete?: () => void
}

interface FileStatus {
  id: string
  name: string
  size: number
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

export function FileUploader({ datastoreId, onUploadComplete }: FileUploaderProps) {
  const [files, setFiles] = useState<FileStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        progress: 0,
        status: "pending" as const,
        file,
      }))

      setFiles((prev) => [...prev, ...newFiles])
    }

    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        progress: 0,
        status: "pending" as const,
        file,
      }))

      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const uploadFiles = async () => {
    if (files.length === 0 || isUploading) return

    setIsUploading(true)

    const pendingFiles = files.filter((file) => file.status === "pending")

    for (const fileStatus of pendingFiles) {
      try {
        // Update status to uploading
        setFiles((prev) => prev.map((f) => (f.id === fileStatus.id ? { ...f, status: "uploading" } : f)))

        // Create FormData
        const formData = new FormData()
        formData.append("file", fileStatus.file)

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id === fileStatus.id && f.progress < 90) {
                return { ...f, progress: f.progress + 10 }
              }
              return f
            }),
          )
        }, 300)

        // Upload file
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/datastores/${datastoreId}/upload`, {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        // Update status to success
        setFiles((prev) => prev.map((f) => (f.id === fileStatus.id ? { ...f, progress: 100, status: "success" } : f)))

        toast({
          title: "File uploaded",
          description: `${fileStatus.name} has been uploaded successfully.`,
        })
      } catch (error) {
        console.error(`Error uploading ${fileStatus.name}:`, error)

        // Update status to error
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileStatus.id
              ? {
                  ...f,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : f,
          ),
        )

        toast({
          title: "Upload failed",
          description: `Failed to upload ${fileStatus.name}. Please try again.`,
          variant: "destructive",
        })
      }
    }

    setIsUploading(false)

    if (onUploadComplete) {
      onUploadComplete()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.csv,.md,.json"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="rounded-full bg-muted p-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Drag and drop files</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Drag and drop files here, or click to browse. Supported formats: PDF, DOC, DOCX, TXT, CSV, MD, JSON.
          </p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
            Browse Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-muted p-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      {file.status === "pending" && (
                        <span className="text-xs text-muted-foreground">Ready to upload</span>
                      )}
                      {file.status === "uploading" && (
                        <span className="text-xs text-muted-foreground">Uploading... {file.progress}%</span>
                      )}
                      {file.status === "success" && (
                        <span className="text-xs text-green-500 flex items-center">
                          <Check className="h-3 w-3 mr-1" /> Uploaded
                        </span>
                      )}
                      {file.status === "error" && (
                        <span className="text-xs text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" /> {file.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === "uploading" && (
                    <div className="w-24">
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}

                  {file.status !== "uploading" && (
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} disabled={isUploading}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setFiles([])} disabled={isUploading}>
              Clear All
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={files.length === 0 || isUploading || files.every((f) => f.status !== "pending")}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
