'use client'

import { ReactFlowProvider } from '@xyflow/react'
import WorkflowCanvas from './components/WorkflowCanvas'
import NodeLibrary from './components/NodeLibrary'
import WorkflowHeader from './components/WorkflowHeader'
import PropertiesPanel from './components/PropertiesPanel'
import { WorkflowProvider } from './context/WorkflowContext'
import { useState } from 'react'

export default function WorkflowBuilderPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <ReactFlowProvider>
      <WorkflowProvider>
        <div className="h-screen flex flex-col bg-[#1e1e1e]">
          {/* Header */}
          <WorkflowHeader />
          
          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Node Library */}
            <NodeLibrary />
            
            {/* Canvas Area */}
            <div className="flex-1 relative">
              <WorkflowCanvas 
                onNodeSelect={setSelectedNode}
                selectedNode={selectedNode}
              />
            </div>
            
            {/* Right Sidebar - Properties Panel */}
            {selectedNode && (
              <PropertiesPanel 
                nodeId={selectedNode}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </div>
        </div>
      </WorkflowProvider>
    </ReactFlowProvider>
  )
}