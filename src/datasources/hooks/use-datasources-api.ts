"use client"

import { useState } from "react"
import { datasourcesApiService } from "../services/datasources-api-service"
import type { Datasource, DatasourceCreate } from "@/src/types/api"
import { useToast } from "@/src/hooks/use-toast"

export function useDatasourcesApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const createDatasource = async (data: DatasourceCreate): Promise<Datasource | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datasourcesApiService.createDatasource(data)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao criar fonte de dados")
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

  const getDatasource = async (datasourceId: string): Promise<Datasource | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datasourcesApiService.getDatasource(datasourceId)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao obter fonte de dados")
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

  const deleteDatasource = async (datasourceId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      await datasourcesApiService.deleteDatasource(datasourceId)
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao excluir fonte de dados")
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

  const listDatasources = async (): Promise<Datasource[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await datasourcesApiService.listDatasources()
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao listar fontes de dados")
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
    createDatasource,
    getDatasource,
    deleteDatasource,
    listDatasources,
    isLoading,
    error,
  }
}
