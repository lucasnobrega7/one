"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slack, MessageSquare, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import type { Integration } from "../types/integration.types"

interface IntegrationCardProps {
  integration: Integration
  onEdit?: (integration: Integration) => void
  onDelete?: (integration: Integration) => void
}

/**
 * Componente para exibir uma integração em formato de card
 */
export function IntegrationCard({ integration, onEdit, onDelete }: IntegrationCardProps) {
  // Função para renderizar o ícone correto com base no tipo de integração
  const renderIcon = () => {
    switch (integration.type) {
      case "whatsapp":
        return <MessageSquare className="h-6 w-6 text-green-500" />
      case "slack":
        return <Slack className="h-6 w-6 text-blue-500" />
      default:
        return null
    }
  }

  // Função para renderizar o status com o estilo correto
  const renderStatus = () => {
    switch (integration.status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Ativo
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Inativo
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendente
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Erro
          </Badge>
        )
      default:
        return null
    }
  }

  // Função para renderizar o ícone de status
  const renderStatusIcon = () => {
    switch (integration.status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      case "pending":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {renderIcon()}
            <span className="ml-2">{integration.name}</span>
          </div>
          <div className="flex items-center">
            {renderStatusIcon()}
            <span className="ml-1 text-sm">{renderStatus()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500">
          <p>Tipo: {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}</p>
          <p>Criado em: {integration.createdAt.toLocaleDateString()}</p>
          {integration.type === "whatsapp" && <p>Provedor: {(integration.config as any).provider}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit?.(integration)}>
          Configurar
        </Button>
        <Button variant="outline" className="text-red-500" onClick={() => onDelete?.(integration)}>
          Remover
        </Button>
      </CardFooter>
    </Card>
  )
}
