"use client"

import React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodeGroupProps {
  children: React.ReactNode
}

export function CodeGroup({ children }: CodeGroupProps) {
  const [activeTab, setActiveTab] = useState<string>("")

  // Extrair os blocos de código e seus títulos
  const codeBlocks = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.type === "pre")
    .map((child) => {
      if (!React.isValidElement(child)) return null

      const pre = child as React.ReactElement
      const code = React.Children.toArray(pre.props.children).find(
        (child) => React.isValidElement(child) && child.type === "code",
      ) as React.ReactElement

      if (!code) return null

      const className = code.props.className || ""
      const language = className.replace("language-", "")
      const title = code.props.title || language

      return {
        title,
        language,
        content: pre,
      }
    })
    .filter(Boolean) as { title: string; language: string; content: React.ReactElement }[]

  if (codeBlocks.length === 0) return null

  if (activeTab === "") {
    setActiveTab(codeBlocks[0].title)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="my-6">
      <TabsList>
        {codeBlocks.map((block) => (
          <TabsTrigger key={block.title} value={block.title}>
            {block.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {codeBlocks.map((block) => (
        <TabsContent key={block.title} value={block.title}>
          {block.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
