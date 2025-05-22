"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentUploader } from "@/components/knowledge-base/document-uploader"
import { Loader2, Database, FileText } from "lucide-react"

type KnowledgeBase = {
  id: string
  name: string
  description: string | null
  indexName: string
  createdAt: string
}

export default function KnowledgeBasePage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string | null>(null)

  useEffect(() => {
    async function loadKnowledgeBases() {
      try {
        const response = await fetch("/api/knowledge")
        if (response.ok) {
          const data = await response.json()
          setKnowledgeBases(data)
          if (data.length > 0) {
            setSelectedKnowledgeBase(data[0].id)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar bases de conhecimento:", error)
      } finally {
        setLoading(false)
      }
    }

    loadKnowledgeBases()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <MainLayout>
      <section className="container py-20">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-7xl mb-10">Bases de Conhecimento</h1>
          <p className="text-2xl font-normal mb-10 leading-tight">
            Alimente seus agentes com documentos e dados específicos para melhorar suas respostas e aumentar a precisão.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/knowledge/new" className="openai-button flex items-center">
              Criar nova base
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2"
              >
                <path
                  d="M6.5 3.5L11 8L6.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="/agents" className="openai-link">
              Gerenciar agentes
            </Link>
          </div>
        </div>

        {knowledgeBases.length === 0 ? (
          <div className="border border-dashed border-white/20 p-8 text-center mt-10">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Database className="h-6 w-6 text-white/40" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma base de conhecimento encontrada</h3>
            <p className="text-white/70 mb-4">
              Crie sua primeira base de conhecimento para alimentar seus agentes com informações personalizadas
            </p>
            <Link href="/knowledge/new" className="openai-button inline-flex">
              Criar Base de Conhecimento
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-20">
            <div className="lg:col-span-1">
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-xl mb-4">Suas Bases</h3>
                <p className="text-white/70 mb-4">Selecione uma base para gerenciar</p>
                <ul className="space-y-2">
                  {knowledgeBases.map((kb) => (
                    <li key={kb.id}>
                      <button
                        className={`w-full text-left py-2 px-3 flex items-center ${
                          selectedKnowledgeBase === kb.id
                            ? "bg-white text-black"
                            : "border border-white/20 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedKnowledgeBase(kb.id)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {kb.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedKnowledgeBase && (
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-transparent border border-white/20">
                    <TabsTrigger
                      value="upload"
                      className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                    >
                      Adicionar Documentos
                    </TabsTrigger>
                    <TabsTrigger
                      value="manage"
                      className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                    >
                      Gerenciar Documentos
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-4">
                    <div className="border-t border-white/20 pt-6">
                      <h3 className="text-xl mb-2">Adicionar Documento</h3>
                      <p className="text-white/70 mb-4">
                        Carregue um arquivo de texto ou cole o conteúdo diretamente para adicionar à base de
                        conhecimento.
                      </p>
                      <DocumentUploader knowledgeBaseId={selectedKnowledgeBase} />
                    </div>
                  </TabsContent>
                  <TabsContent value="manage" className="mt-4">
                    <div className="border-t border-white/20 pt-6">
                      <h3 className="text-xl mb-2">Documentos na Base</h3>
                      <p className="text-white/70 mb-4">
                        Visualize e gerencie os documentos nesta base de conhecimento
                      </p>
                      <p className="text-center text-white/50 py-8">
                        Funcionalidade de gerenciamento de documentos em desenvolvimento.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  )
}
