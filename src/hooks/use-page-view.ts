"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView } from "@/lib/analytics"

/**
 * Hook to track page views in PostHog
 * Place this in your root layout or in pages where you want to track views
 */
export function usePageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = pathname

      // Add search parameters if they exist
      const search = searchParams?.toString()
      if (search) {
        url = `${url}?${search}`
      }

      // Track the page view
      trackPageView(url)
    }
  }, [pathname, searchParams])
}
