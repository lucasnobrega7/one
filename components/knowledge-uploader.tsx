"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Upload, FileText, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function KnowledgeUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/knowledge/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Falha ao fazer upload do arquivo")
      }

      const data = await response.json()

      toast({
        title: "Upload concluído",
        description: "O documento foi adicionado à base de conhecimento com sucesso.",
      })

      setUploadStatus("success")
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível adicionar o documento à base de conhecimento.",
        variant: "destructive",
      })

      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Faça upload de documentos para enriquecer a base de conhecimento do assistente. Formatos suportados: PDF, DOCX,
        TXT.
      </div>

      <div className="grid gap-4">
        <Card className="p-4 border-dashed border-2 flex flex-col items-center justify-center text-center">
          {file ? (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</span>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
              <Upload className="h-8 w-8 mb-2" />
              <p>Arraste um arquivo ou clique para selecionar</p>
            </div>
          )}
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className={file ? "hidden" : "absolute inset-0 opacity-0 cursor-pointer"}
          />
        </Card>

        <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : uploadStatus === "success" ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Enviado com sucesso
            </>
          ) : uploadStatus === "error" ? (
            <>
              <AlertCircle className="h-4 w-4 mr-2" />
              Tentar novamente
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Enviar documento
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
