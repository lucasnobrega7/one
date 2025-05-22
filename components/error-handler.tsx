"use client"

import { useState, useEffect } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { XCircle, RefreshCw } from "lucide-react"

interface ErrorHandlerProps {
  message?: string
  retry?: () => void
}

export function ErrorHandler({ message = "Ocorreu um erro ao processar sua solicitação", retry }: ErrorHandlerProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
  }, [message])

  if (!visible) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{message}</p>
        <div className="flex gap-2 mt-2">
          {retry && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                retry()
                setVisible(false)
              }}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Tentar novamente
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setVisible(false)}>
            Fechar
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
