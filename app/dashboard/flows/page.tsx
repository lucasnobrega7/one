"use client"

import { FlowBuilder } from '@/components/flows/flow-builder'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function FlowsPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Flow Builder</h1>
            <p className="text-sm text-gray-600 mt-1">
              Crie fluxos visuais de automação com IA
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ ReactFlow v12
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🎯 Flowise Inspired
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              🧠 87% Margem
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Flow Builder - Full Height */}
      <div className="flex-1">
        <FlowBuilder />
      </div>
    </div>
  )
}