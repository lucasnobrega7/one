"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDatasourcesApi } from "../hooks/useDatasourcesApi"
import type { Datasource } from "../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon, FileIcon, FileTextIcon, GlobeIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

/**
 * Componente para listar fontes de dados
 */
export function DatasourceList() {
  const [datasources, setDatasources] = useState<Datasource[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { listDatasources, isLoading, error } = useDatasourcesApi()

  useEffect(() => {
    const fetchDatasources = async () => {
      const data = await listDatasources()
      setDatasources(data)
    }

    fetchDatasources()
  }, [listDatasources])

  const filteredDatasources = datasources.filter(
    (datasource) =>
      datasource.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      datasource.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Função para obter o ícone com base no tipo de fonte de dados
  const getDatasourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "file":
        return <FileIcon className="h-6 w-6" />
      case "text":
        return <FileTextIcon className="h-6 w-6" />
      case "web":
        return <GlobeIcon className="h-6 w-6" />
      default:
        return <FileIcon className="h-6 w-6" />
    }
  }

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fontes de Dados</h1>
        <Button onClick={() => router.push("/datasources/create")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Adicionar Fonte de Dados
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar fontes de dados..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Erro ao carregar fontes de dados</h2>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <Button onClick={() => listDatasources()}>Tentar novamente</Button>
        </div>
      ) : filteredDatasources.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Nenhuma fonte de dados encontrada</h2>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Tente um termo de busca diferente" : "Adicione sua primeira fonte de dados para começar"}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push("/datasources/create")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar Fonte de Dados
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasources.map((datasource) => (
            <Card key={datasource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="mr-2">{getDatasourceIcon(datasource.type)}</div>
                  {datasource.name || `Fonte de dados ${datasource.id.slice(0, 8)}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex mt-4 space-x-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{datasource.type}</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(datasource.status)}`}>
                    {datasource.status}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/datasources/${datasource.id}`)}
                  disabled={datasource.status === "pending" || datasource.status === "processing"}
                >
                  Visualizar
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm("Tem certeza que deseja excluir esta fonte de dados?")) {
                      // Implementar lógica de exclusão
                    }
                  }}
                >
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
