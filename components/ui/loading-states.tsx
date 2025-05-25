import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  width?: string
  height?: string
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, lines = 1, width = "100%", height = "1rem", ...props }, ref) => {
    if (lines === 1) {
      return (
        <div
          ref={ref}
          className={cn("openai-skeleton loading-shimmer", className)}
          style={{ width, height }}
          {...props}
        />
      )
    }

    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="openai-skeleton loading-shimmer"
            style={{
              width: i === lines - 1 ? "75%" : "100%",
              height,
            }}
          />
        ))}
      </div>
    )
  }
)
LoadingSkeleton.displayName = "LoadingSkeleton"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4 border",
      default: "w-6 h-6 border-2", 
      lg: "w-8 h-8 border-2",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "openai-spinner",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

interface LoadingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  showAvatar?: boolean
  lines?: number
}

const LoadingCard = React.forwardRef<HTMLDivElement, LoadingCardProps>(
  ({ className, showAvatar = false, lines = 3, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("openai-card p-6 space-y-4", className)}
      {...props}
    >
      <div className="flex items-center space-x-4">
        {showAvatar && (
          <div className="openai-skeleton loading-shimmer w-10 h-10 rounded-full" />
        )}
        <div className="space-y-2 flex-1">
          <LoadingSkeleton width="60%" height="1.25rem" />
          <LoadingSkeleton width="40%" height="0.875rem" />
        </div>
      </div>
      <LoadingSkeleton lines={lines} />
    </div>
  )
)
LoadingCard.displayName = "LoadingCard"

interface LoadingButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  children?: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "btn-openai-primary flex items-center justify-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {disabled ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  )
)
LoadingButton.displayName = "LoadingButton"

export {
  LoadingSkeleton,
  LoadingSpinner, 
  LoadingCard,
  LoadingButton,
}