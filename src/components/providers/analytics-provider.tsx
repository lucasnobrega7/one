"use client"

import type React from "react"

import { PostHogProvider } from "posthog-js/react"
import { usePageView } from "@/hooks/use-page-view"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <PostHogProvider
      apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY || ""}
      options={{
        api_host: "https://app.posthog.com",
      }}
    >
      <PageViewTracker />
      {children}
    </PostHogProvider>
  )
}

// Component to track page views
function PageViewTracker() {
  usePageView()
  return null
}
