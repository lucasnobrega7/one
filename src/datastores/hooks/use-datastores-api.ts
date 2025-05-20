"use client"

import { useState } from "react"
import { datastoresApiService } from "../services/datastores-api-service"
import type { Datastore, DatastoreCreate, DatastoreQuery } from "@/src/types/api"
import { useToast } from "@/src/hooks/use-toast"

export function useDatastoresApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const createDatastore = async (data: DatastoreCreate): Promise<Datastore | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datastoresApiService.createDatastore(data)
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
      const result = await datastoresApiService.getDatastore(datastoreId)
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
      const result = await datastoresApiService.updateDatastore(datastoreId, data)
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
      await datastoresApiService.deleteDatastore(datastoreId)
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
      const result = await datastoresApiService.queryDatastore(datastoreId, query)
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
      const result = await datastoresApiService.listDatastores()
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
