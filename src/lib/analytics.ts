"use client"

import type React from "react"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

// Initialize PostHog
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "https://app.posthog.com",
    capture_pageview: false, // We'll manually capture pageviews
    persistence: "localStorage",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug()
    },
  })
}

/**
 * Track an event in PostHog
 * @param eventName Name of the event to track
 * @param properties Additional properties to include with the event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  posthog?.capture(eventName, properties)
}

/**
 * Track a page view in PostHog
 * @param url The URL of the page being viewed
 * @param properties Additional properties to include with the event
 */
export function trackPageView(url: string, properties?: Record<string, any>) {
  posthog?.capture("$pageview", {
    $current_url: url,
    ...properties,
  })
}

/**
 * Identify a user in PostHog
 * @param userId The unique identifier for the user
 * @param properties Additional properties to associate with the user
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  posthog?.identify(userId, properties)
}

/**
 * Reset the current user in PostHog (typically on logout)
 */
export function resetUser() {
  posthog?.reset()
}

/**
 * PostHog provider component for React
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export { posthog }
