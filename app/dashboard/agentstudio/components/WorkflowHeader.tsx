'use client'

import { useState } from 'react'
import { useWorkflow } from '../context/WorkflowContext'
import { Play, Square, Save, Download, Upload, Settings, ChevronDown } from 'lucide-react'

export default function WorkflowHeader() {
  const { 
    workflowName, 
    isExecuting, 
    executeWorkflow, 
    stopExecution,
    saveWorkflow 
  } = useWorkflow()
  
  const [isNameEditing, setIsNameEditing] = useState(false)
  const [editedName, setEditedName] = useState(workflowName)

  const handleNameSave = () => {
    setIsNameEditing(false)
  }

  return (
    <div className="h-14 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {isNameEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSave}
              onKeyPress={(e) => e.key === 'Enter' && handleNameSave()}
              className="bg-transparent text-white text-sm font-medium px-2 py-1 border border-[#3a3a3a] rounded focus:outline-none focus:border-[#ff6d5a]"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsNameEditing(true)}
              className="text-white text-sm font-medium hover:text-[#ff6d5a] transition-colors"
            >
              {workflowName}
            </button>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {!isExecuting ? (
          <button
            onClick={executeWorkflow}
            className="flex items-center space-x-2 px-4 py-1.5 bg-[#ff6d5a] text-white rounded hover:bg-[#ff5543] transition-colors"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Execute Workflow</span>
          </button>
        ) : (
          <button
            onClick={stopExecution}
            className="flex items-center space-x-2 px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Square className="w-4 h-4" />
            <span className="text-sm font-medium">Stop</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={saveWorkflow}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
          title="Save Workflow"
        >
          <Save className="w-4 h-4" />
        </button>
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
          title="Download Workflow"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
          title="Import Workflow"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}