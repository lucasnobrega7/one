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
      setStatus({
        loading: false,
        success: false,
        error: error.message || "Erro ao conectar à API",
        details: "Verifique a configuração do banco de dados",
      })
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <Database className="w-8 h-8 text-[#46B2E0]" />
          Verificação do Banco de Dados
        </h1>
        <p className="text-white/70 mb-8">
          Verifica se a conexão com o banco de dados Neon está funcionando corretamente.
        </p>
      </div>
      
      <Card className="w-full max-w-2xl bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-6 w-6 text-[#46B2E0]" />
            Status da Conexão
          </CardTitle>
          <CardDescription className="text-white/70">
            Verifica se a conexão com o banco de dados Neon está funcionando corretamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status.loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-[#46B2E0]" />
              <span className="ml-2 text-white/70">Verificando conexão...</span>
            </div>
          ) : status.success ? (
            <Alert className="bg-green-500/10 border-green-500/30">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-white">Conexão estabelecida com sucesso</AlertTitle>
              <AlertDescription>
                <p className="text-white/80">{status.message}</p>
                {status.timestamp && (
                  <p className="text-sm text-white/60 mt-2">
                    Timestamp do servidor: {new Date(status.timestamp).toLocaleString()}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-white">Erro na conexão</AlertTitle>
              <AlertDescription>
                <p className="text-red-400">{status.error}</p>
                {status.details && <p className="text-sm mt-2 text-red-400/80">{status.details}</p>}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={checkDatabase} 
            disabled={status.loading} 
            className="w-full bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] hover:from-[#46B2E0]/80 hover:to-[#8A53D2]/80 text-white"
          >
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
