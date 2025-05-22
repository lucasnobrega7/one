"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react"

export function DocumentUploader({ knowledgeBaseId }: { knowledgeBaseId?: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Read text file content
      if (selectedFile.type === "text/plain") {
        const reader = new FileReader()
        reader.onload = (e) => {
          setText((e.target?.result as string) || "")
        }
        reader.readAsText(selectedFile)
      } else {
        setText("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      setResult({
        success: false,
        message: "Por favor, forneça algum texto para processar.",
      })
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      const response = await fetch("/api/knowledge/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          knowledgeBaseId,
          filename: file?.name || "documento-manual.txt",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar documento")
      }

      setResult({
        success: true,
        message: `Documento processado com sucesso! ${data.chunks} fragmentos criados.`,
      })

      // Clear form on success
      setFile(null)
      setText("")
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Ocorreu um erro ao processar o documento.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="file" className="text-sm font-medium">
          Arquivo (opcional)
        </label>
        <Input
          id="file"
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          disabled={isUploading}
          className="border-white/20 bg-white/5 text-white"
        />
        <p className="text-xs text-white/50">
          Atualmente suportamos apenas arquivos .txt. Suporte para PDF e DOCX em breve.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="text" className="text-sm font-medium">
          Texto
        </label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole ou digite o texto aqui..."
          rows={10}
          disabled={isUploading}
          className="resize-none border-white/20 bg-white/5 text-white placeholder:text-white/30"
        />
      </div>

      {result && (
        <div
          className={`p-4 ${
            result.success ? "bg-white/10 border border-white/20" : "bg-red-500/20 border border-red-500/50"
          }`}
        >
          <div className="flex items-start">
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            )}
            <div>
              <h4 className="text-sm font-bold">{result.success ? "Sucesso" : "Erro"}</h4>
              <p className="text-sm">{result.message}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isUploading || !text.trim()}
        className={`w-full border border-white py-2 px-4 flex items-center justify-center ${
          isUploading || !text.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:text-black"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Processar Documento
          </>
        )}
      </button>
    </form>
  )
}
