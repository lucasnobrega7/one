"use client"

import type React from "react"

import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const notificationVariants = cva(
  "relative w-full rounded-lg border p-4 shadow-md [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50 border-gray-200 dark:border-gray-800",
        success:
          "border-green-500/30 text-green-800 dark:text-green-200 [&>svg]:text-green-500 bg-green-50 dark:bg-green-900/20",
        info: "border-blue-500/30 text-blue-800 dark:text-blue-200 [&>svg]:text-blue-500 bg-blue-50 dark:bg-blue-900/20",
        warning:
          "border-yellow-500/30 text-yellow-800 dark:text-yellow-200 [&>svg]:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
        error: "border-red-500/30 text-red-800 dark:text-red-200 [&>svg]:text-red-500 bg-red-50 dark:bg-red-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface NotificationProps extends VariantProps<typeof notificationVariants> {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
  duration?: number | null
  onClose?: () => void
}

export function Notification({
  title,
  description,
  icon,
  className,
  variant,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration !== null) {
      const timeout = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className={cn(notificationVariants({ variant }), className)} role="alert" aria-live="assertive">
      {icon}
      <div className="grid gap-1">
        <div className="text-sm font-medium">{title}</div>
        {description && <div className="text-xs opacity-80">{description}</div>}
      </div>
      {onClose && (
        <button
          className="absolute right-2 top-2 rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => {
            setIsVisible(false)
            onClose()
          }}
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
