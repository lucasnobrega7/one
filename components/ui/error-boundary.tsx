'use client'

import React, { Component, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Ops! Algo deu errado</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {this.state.error?.message || 'Ocorreu um erro inesperado'}
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recarregar
                </Button>
                
                <Button asChild className="flex-1">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Ir ao Início
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional error handling
export function useErrorHandler() {
  const handleError = (error: Error | string, context?: string) => {
    const errorMessage = typeof error === 'string' ? error : error.message
    
    // You can extend this to send to error tracking service
    // Example: Sentry.captureException(error)
  }

  return { handleError }
}

// Higher-order component for error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}