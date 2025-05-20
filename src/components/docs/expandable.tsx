"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface ExpandableProps {
  title: string
  children: React.ReactNode
}

export function Expandable({ title, children }: ExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-4 rounded-lg border">
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">{title}</span>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isExpanded && <div className="border-t p-4">{children}</div>}
    </div>
  )
}
