"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { FlowProvider } from "@/contexts/FlowContext"
import { FlowEditor } from "@/components/flow-editor/FlowEditor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function FlowEditorWrapper() {
  const params = useParams()
  const agentId = params.id as string
  const [error, setError] = useState<string | null>(null)

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Editor de Fluxo do Agente</CardTitle>
          <CardDescription>
            Crie e edite o fluxo de conversação do seu agente arrastando e conectando nós.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <FlowEditor />
        </CardContent>
      </Card>
    </div>
  )
}

export default function AgentFlowPage() {
  return (
    <FlowProvider>
      <FlowEditorWrapper />
    </FlowProvider>
  )
}
