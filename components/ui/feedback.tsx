'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FeedbackProps {
  type: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
  autoClose?: number // ms
}

export function Feedback({ 
  type, 
  title, 
  message, 
  action, 
  onClose, 
  autoClose = 5000 
}: FeedbackProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoClose)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [autoClose, onClose])

  if (!isVisible) return null

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }

  const Icon = icons[type]

  return (
    <div className={cn(
      'border rounded-lg p-4 mb-4 transition-all duration-300',
      colors[type]
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColors[type])} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <p className="text-sm">{message}</p>
          
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="mt-2"
            >
              {action.label}
            </Button>
          )}
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Loading feedback component
interface LoadingFeedbackProps {
  message?: string
  className?: string
}

export function LoadingFeedback({ 
  message = 'Carregando...', 
  className 
}: LoadingFeedbackProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm text-gray-600', className)}>
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600" />
      <span>{message}</span>
    </div>
  )
}

// Success feedback hook
export function useSuccessFeedback() {
  const [feedback, setFeedback] = useState<{
    show: boolean
    message: string
    action?: { label: string; onClick: () => void }
  }>({ show: false, message: '' })

  const showSuccess = (
    message: string, 
    action?: { label: string; onClick: () => void }
  ) => {
    setFeedback({ show: true, message, action })
  }

  const hideFeedback = () => {
    setFeedback({ show: false, message: '' })
  }

  return {
    feedback,
    showSuccess,
    hideFeedback
  }
}