"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { AnalyticsFilter, TimeRange } from "../types/analytics.types"
import { useState } from "react"

interface TimeRangeSelectorProps {
  filter: AnalyticsFilter
  onChange: (filter: AnalyticsFilter) => void
}

export function TimeRangeSelector({ filter, onChange }: TimeRangeSelectorProps) {
  const [activeRange, setActiveRange] = useState<string>("7d")

  const handleRangeChange = (range: string) => {
    setActiveRange(range)

    const now = new Date()
    let start = new Date()
    let granularity: "hour" | "day" | "week" | "month" = "day"

    switch (range) {
      case "24h":
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        granularity = "hour"
        break
      case "7d":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        granularity = "day"
        break
      case "30d":
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        granularity = "day"
        break
      case "90d":
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        granularity = "week"
        break
      case "1y":
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        granularity = "month"
        break
    }

    const timeRange: TimeRange = { start, end: now }
    onChange({ ...filter, timeRange, granularity })
  }

  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex space-x-1">
          <Button
            variant={activeRange === "24h" ? "default" : "outline"}
            size="sm"
            onClick={() => handleRangeChange("24h")}
          >
            24h
          </Button>
          <Button
            variant={activeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => handleRangeChange("7d")}
          >
            7d
          </Button>
          <Button
            variant={activeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => handleRangeChange("30d")}
          >
            30d
          </Button>
          <Button
            variant={activeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => handleRangeChange("90d")}
          >
            90d
          </Button>
          <Button
            variant={activeRange === "1y" ? "default" : "outline"}
            size="sm"
            onClick={() => handleRangeChange("1y")}
          >
            1y
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
