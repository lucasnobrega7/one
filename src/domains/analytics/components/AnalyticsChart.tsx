"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartData } from "../types/analytics.types"
import { useEffect, useRef } from "react"

interface AnalyticsChartProps {
  title: string
  data: ChartData
  type?: "line" | "bar"
  height?: number
}

export function AnalyticsChart({ title, data, type = "line", height = 300 }: AnalyticsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.labels.length || !data.datasets.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw placeholder chart (in a real app, use Chart.js or similar)
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#111827"
    ctx.textAlign = "center"
    ctx.fillText(`${title} - ${type} chart with ${data.labels.length} data points`, canvas.width / 2, canvas.height / 2)

    // Draw legend
    const legendY = canvas.height - 30
    data.datasets.forEach((dataset, index) => {
      const x = 20 + index * 150

      ctx.fillStyle = dataset.borderColor || "#000"
      ctx.fillRect(x, legendY, 20, 10)

      ctx.fillStyle = "#111827"
      ctx.textAlign = "left"
      ctx.fillText(dataset.label, x + 25, legendY + 9)
    })
  }, [data, title, type])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} height={height} style={{ width: "100%", height: `${height}px` }} />
      </CardContent>
    </Card>
  )
}
