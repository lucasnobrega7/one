"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw, Database } from "lucide-react"

export default function DbCheckPage() {
  const [status, setStatus] = useState<{
    loading: boolean
    success?: boolean
    message?: string
    timestamp?: string
    error?: string
    details?: string
  }>({
    loading: true,
  })

  const checkDatabase = async () => {
    setStatus({ loading: true })
    try {
      const response = await fetch("/api/drizzle-check")

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}\n${errorText}`)
      }

      const data = await response.json()

      if (data.success) {
        setStatus({
          loading: false,
          success: true,
          message: data.message,
          timestamp: data.timestamp,
        })
      } else {
        setStatus({
          loading: false,
          success: false,
          error: data.error || "Erro desconhecido",
          details: data.details,
        })
      }
    } catch (error: any) {
      console.error("Erro ao verificar banco de dados:", error)
      setStatus({
        loading: false,
        success: false,
        error: error.message || "Erro ao conectar à API",
        details: "Verifique o console para mais detalhes",
      })
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Verificação do Banco de Dados
          </CardTitle>
          <CardDescription>
            Verifica se a conexão com o banco de dados Neon está funcionando corretamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status.loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Verificando conexão...</span>
            </div>
          ) : status.success ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Conexão estabelecida com sucesso</AlertTitle>
              <AlertDescription>
                <p>{status.message}</p>
                {status.timestamp && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Timestamp do servidor: {new Date(status.timestamp).toLocaleString()}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro na conexão</AlertTitle>
              <AlertDescription>
                <p>{status.error}</p>
                {status.details && <p className="text-sm mt-2">{status.details}</p>}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={checkDatabase} disabled={status.loading} className="w-full">
            {status.loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Verificar Novamente
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
