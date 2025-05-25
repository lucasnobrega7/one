"use client"

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class GlobalErrorHandler extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Send error to monitoring service (Sentry, LogRocket, etc.)
    // TODO: Implement error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl text-gray-900">
                Algo deu errado
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e estamos trabalhando para resolver.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-100 p-4 rounded text-xs">
                  <summary className="cursor-pointer font-medium mb-2">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recarregar
                </Button>
                
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Início
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}