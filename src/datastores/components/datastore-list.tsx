"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDatastoresApi } from "../hooks/use-datastores-api"
import type { Datastore } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function DatastoreList() {
  const [datastores, setDatastores] = useState<Datastore[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { listDatastores, isLoading, error } = useDatastoresApi()

  useEffect(() => {
    const fetchDatastores = async () => {
      const data = await listDatastores()
      setDatastores(data)
    }

    fetchDatastores()
  }, [listDatastores])

  const filteredDatastores = datastores.filter(
    (datastore) =>
      datastore.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      datastore.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bases de Conhecimento</h1>
        <Button onClick={() => router.push("/datastores/create")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Criar Base de Conhecimento
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar bases de conhecimento..."
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
          <h2 className="text-xl font-semibold mb-2 text-red-500">Erro ao carregar bases de conhecimento</h2>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <Button onClick={() => listDatastores()}>Tentar novamente</Button>
        </div>
      ) : filteredDatastores.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Nenhuma base de conhecimento encontrada</h2>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Tente um termo de busca diferente" : "Crie sua primeira base de conhecimento para começar"}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push("/datastores/create")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Criar Base de Conhecimento
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatastores.map((datastore) => (
            <Card key={datastore.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{datastore.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 line-clamp-2">{datastore.description}</p>
                <div className="flex mt-4 space-x-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{datastore.type}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      datastore.visibility === "public" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {datastore.visibility}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/datastores/${datastore.id}/documents`)}>
                  Documentos
                </Button>
                <Button variant="outline" onClick={() => router.push(`/datastores/${datastore.id}/settings`)}>
                  Configurações
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
