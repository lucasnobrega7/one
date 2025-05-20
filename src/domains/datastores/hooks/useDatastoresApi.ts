"use client"

import { useState } from "react"
import { datastoreApiService } from "../services/datastoreApiService"
import type { Datastore, DatastoreCreate, DatastoreQuery } from "../types"
import { useToast } from "@/components/ui/use-toast"

/**
 * Hook para interagir com a API de datastores
 */
export function useDatastoresApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const createDatastore = async (data: DatastoreCreate): Promise<Datastore | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datastoreApiService.createDatastore(data)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao criar datastore")
      setError(error)
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getDatastore = async (datastoreId: string): Promise<Datastore | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datastoreApiService.getDatastore(datastoreId)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao obter datastore")
      setError(error)
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateDatastore = async (datastoreId: string, data: DatastoreCreate): Promise<Datastore | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datastoreApiService.updateDatastore(datastoreId, data)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao atualizar datastore")
      setError(error)
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDatastore = async (datastoreId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      await datastoreApiService.deleteDatastore(datastoreId)
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao excluir datastore")
      setError(error)
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const queryDatastore = async (datastoreId: string, query: DatastoreQuery): Promise<Record<string, any>[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datastoreApiService.queryDatastore(datastoreId, query)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao consultar datastore")
      setError(error)
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const listDatastores = async (): Promise<Datastore[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datastoreApiService.listDatastores()
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao listar datastores")
      setError(error)
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createDatastore,
    getDatastore,
    updateDatastore,
    deleteDatastore,
    queryDatastore,
    listDatastores,
    isLoading,
    error,
  }
}
