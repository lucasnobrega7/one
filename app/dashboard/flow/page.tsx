"use client"

import { FlowBuilderEnhanced } from '@/components/agents/flow-builder-enhanced'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function FlowPage() {
  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AgentStudio</h1>
            <p className="text-gray-600 mt-2">
              Editor visual de fluxos para criação de agentes inteligentes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              ✅ ReactFlow v12
            </Badge>
            <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
              🎯 N8N Inspired
            </Badge>
            <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-200">
              🧠 Chatvolt Patterns
            </Badge>
          </div>
        </div>
        
        <Separator className="mt-4" />
      </div>

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">🚀 Triggers</h3>
          <p className="text-sm text-gray-600">
            Manual, Webhook e Schedule triggers para iniciar fluxos automaticamente
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">🤖 Agentes IA</h3>
          <p className="text-sm text-gray-600">
            GPT-4, Claude, Mixtral integrados com 87% margem de lucro via OpenRouter
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📊 Schema Integration</h3>
          <p className="text-sm text-gray-600">
            Conectado ao Prisma schema com Organization, Agent, Datastore models
          </p>
        </Card>
      </div>

      {/* Main Flow Builder */}
      <FlowBuilderEnhanced />
      
      {/* Technical Notes */}
      <div className="mt-6">
        <Card className="p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">🔧 Implementação Técnica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Frontend Stack</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• ReactFlow v12 + TypeScript</li>
                <li>• Shadcn/ui components</li>
                <li>• Tailwind CSS styling</li>
                <li>• Context API para state</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Backend Integration</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Prisma schema models</li>
                <li>• Supabase PostgreSQL</li>
                <li>• OpenRouter API integration</li>
                <li>• Real-time flow execution</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}