"use client"

import React from "react"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

interface EventTrackerProps {
  eventName: string
  properties?: Record<string, any>
  onMount?: boolean
  children?: React.ReactNode
}

/**
 * Component to track events in PostHog
 * Can track on mount or when triggered by children
 */
export function EventTracker({ eventName, properties, onMount = false, children }: EventTrackerProps) {
  useEffect(() => {
    if (onMount) {
      trackEvent(eventName, properties)
    }
  }, [eventName, properties, onMount])

  const handleTrack = () => {
    trackEvent(eventName, properties)
  }

  if (!children) return null

  // Clone the child element and add an onClick handler
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
              // Call the original onClick if it exists
              if (child.props.onClick) {
                child.props.onClick(e)
              }
              handleTrack()
            },
          })
        }
        return child
      })}
    </>
  )
}
