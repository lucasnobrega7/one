"use client"

import { useState } from "react"
import Link from "next/link"
import { Database, MoreHorizontal, Edit, Trash2, FileText, Upload } from "lucide-react"

// Dados de exemplo para bases de conhecimento
const mockKnowledgeBases = [
  {
    id: "1",
    name: "Documentação de Produtos",
    description: "Informações detalhadas sobre nossos produtos e serviços",
    createdAt: "2023-10-10",
    documentCount: 24,
    size: "12.5 MB",
  },
  {
    id: "2",
    name: "FAQ de Suporte",
    description: "Perguntas frequentes e respostas para suporte ao cliente",
    createdAt: "2023-09-15",
    documentCount: 56,
    size: "8.2 MB",
  },
  {
    id: "3",
    name: "Políticas da Empresa",
    description: "Políticas, termos e condições da empresa",
    createdAt: "2023-11-01",
    documentCount: 12,
    size: "5.7 MB",
  },
]

export function KnowledgeBaseList() {
  const [knowledgeBases, setKnowledgeBases] = useState(mockKnowledgeBases)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(id)
    }
  }

  const handleDelete = (id: string) => {
    setKnowledgeBases(knowledgeBases.filter((kb) => kb.id !== id))
    setActiveDropdown(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {knowledgeBases.map((kb) => (
        <div key={kb.id} className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Database className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">{kb.name}</h3>
                  <p className="text-sm text-gray-400">{kb.description}</p>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => toggleDropdown(kb.id)} className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {activeDropdown === kb.id && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <Link
                        href={`/dashboard/knowledge/${kb.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Documentos
                      </Link>
                      <Link
                        href={`/dashboard/knowledge/${kb.id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Link>
                      <Link
                        href={`/dashboard/knowledge/${kb.id}/upload`}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Adicionar Documentos
                      </Link>
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                        onClick={() => handleDelete(kb.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Documentos</p>
                <p className="font-medium">{kb.documentCount}</p>
              </div>
              <div>
                <p className="text-gray-400">Tamanho</p>
                <p className="font-medium">{kb.size}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-750 px-6 py-3 text-sm text-gray-400">
            Criado em {new Date(kb.createdAt).toLocaleDateString("pt-BR")}
          </div>
        </div>
      ))}
    </div>
  )
}
