"use client"

import React from 'react'
import { OpenAIButton } from '@/components/ui/openai-button'
import { OpenAICard, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/openai-card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to monitoring service in production
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // Send to monitoring service (e.g., Sentry, LogRocket)
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo })
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <OpenAICard variant="elevated" className="max-w-lg text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-red-400">Algo deu errado</CardTitle>
          <CardDescription>
            Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-left bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <summary className="cursor-pointer text-gray-300 mb-2">Detalhes do erro</summary>
              <pre className="text-xs text-red-400 overflow-auto">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <OpenAIButton onClick={resetError} variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </OpenAIButton>
            <OpenAIButton onClick={() => window.location.href = '/'} variant="secondary">
              Voltar ao início
            </OpenAIButton>
          </div>
        </CardContent>
      </OpenAICard>
    </div>
  )
}

// Wrapper component for easier usage
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  )
}

// Hook for error boundaries in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Handled error:', error, errorInfo)
    
    if (process.env.NODE_ENV === 'production') {
      // Send to monitoring service
    }
  }
}