export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ApiError {
  type: ApiErrorType
  message: string
  status?: number
  code?: string
  details?: any
  timestamp: string
  retryable: boolean
}

export class ApiErrorHandler {
  // Map HTTP status codes to error types
  private static getErrorType(status: number): ApiErrorType {
    switch (true) {
      case status === 401:
        return ApiErrorType.AUTHENTICATION_ERROR
      case status === 403:
        return ApiErrorType.AUTHORIZATION_ERROR
      case status === 404:
        return ApiErrorType.NOT_FOUND_ERROR
      case status === 422:
        return ApiErrorType.VALIDATION_ERROR
      case status === 429:
        return ApiErrorType.RATE_LIMIT_ERROR
      case status >= 500:
        return ApiErrorType.SERVER_ERROR
      default:
        return ApiErrorType.UNKNOWN_ERROR
    }
  }

  // Check if error is retryable
  private static isRetryable(errorType: ApiErrorType, status?: number): boolean {
    switch (errorType) {
      case ApiErrorType.NETWORK_ERROR:
      case ApiErrorType.RATE_LIMIT_ERROR:
      case ApiErrorType.SERVER_ERROR:
        return true
      case ApiErrorType.AUTHENTICATION_ERROR:
      case ApiErrorType.AUTHORIZATION_ERROR:
      case ApiErrorType.NOT_FOUND_ERROR:
      case ApiErrorType.VALIDATION_ERROR:
        return false
      default:
        // Retry 5xx errors but not 4xx errors
        return status ? status >= 500 : false
    }
  }

  // Create ApiError from fetch response
  static async fromResponse(response: Response): Promise<ApiError> {
    const status = response.status
    const errorType = this.getErrorType(status)
    
    let message = `HTTP ${status}: ${response.statusText}`
    let details: any = null
    
    try {
      const responseBody = await response.text()
      if (responseBody) {
        try {
          details = JSON.parse(responseBody)
          message = details.message || details.error || message
        } catch {
          // Response is not JSON, use as plain text
          message = responseBody
        }
      }
    } catch {
      // Failed to read response body
    }

    return {
      type: errorType,
      message,
      status,
      details,
      timestamp: new Date().toISOString(),
      retryable: this.isRetryable(errorType, status)
    }
  }

  // Create ApiError from network error
  static fromNetworkError(error: Error): ApiError {
    return {
      type: ApiErrorType.NETWORK_ERROR,
      message: `Network error: ${error.message}`,
      details: { originalError: error.name },
      timestamp: new Date().toISOString(),
      retryable: true
    }
  }

  // Create ApiError from validation error
  static fromValidationError(message: string, details?: any): ApiError {
    return {
      type: ApiErrorType.VALIDATION_ERROR,
      message,
      details,
      timestamp: new Date().toISOString(),
      retryable: false
    }
  }

  // Format error for user display
  static formatForUser(error: ApiError): string {
    switch (error.type) {
      case ApiErrorType.NETWORK_ERROR:
        return 'Erro de conexão. Verifique sua internet e tente novamente.'
      case ApiErrorType.AUTHENTICATION_ERROR:
        return 'Erro de autenticação. Faça login novamente.'
      case ApiErrorType.AUTHORIZATION_ERROR:
        return 'Você não tem permissão para realizar esta ação.'
      case ApiErrorType.NOT_FOUND_ERROR:
        return 'Recurso não encontrado.'
      case ApiErrorType.VALIDATION_ERROR:
        return error.details?.message || 'Dados inválidos fornecidos.'
      case ApiErrorType.RATE_LIMIT_ERROR:
        return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
      case ApiErrorType.SERVER_ERROR:
        return 'Erro interno do servidor. Tente novamente em alguns instantes.'
      default:
        return 'Erro inesperado. Tente novamente.'
    }
  }

  // Log error for debugging
  static logError(error: ApiError, context?: string): void {
    const logLevel = error.type === ApiErrorType.SERVER_ERROR ? 'error' : 'warn'
    
    console[logLevel]('API Error:', {
      context,
      type: error.type,
      message: error.message,
      status: error.status,
      timestamp: error.timestamp,
      retryable: error.retryable,
      details: error.details
    })
  }

  // Check if should show error to user
  static shouldShowToUser(error: ApiError): boolean {
    // Don't show network errors that will be retried automatically
    if (error.type === ApiErrorType.NETWORK_ERROR && error.retryable) {
      return false
    }
    
    // Show most errors to user
    return true
  }

  // Get retry delay based on error type
  static getRetryDelay(error: ApiError, attempt: number): number {
    switch (error.type) {
      case ApiErrorType.RATE_LIMIT_ERROR:
        // Longer delay for rate limits
        return Math.min(30000, 5000 * Math.pow(2, attempt))
      case ApiErrorType.NETWORK_ERROR:
      case ApiErrorType.SERVER_ERROR:
        // Exponential backoff for network/server errors
        return Math.min(10000, 1000 * Math.pow(2, attempt))
      default:
        return 0 // No retry
    }
  }
}

// Error boundary for React components
export interface ErrorBoundaryState {
  hasError: boolean
  error?: ApiError
}

// Utility function to handle API responses with proper error handling
export async function handleApiResponse<T>(
  response: Response,
  context?: string
): Promise<{ success: true; data: T } | { success: false; error: ApiError }> {
  if (response.ok) {
    try {
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      const apiError = {
        type: ApiErrorType.UNKNOWN_ERROR,
        message: 'Failed to parse response JSON',
        timestamp: new Date().toISOString(),
        retryable: false
      }
      ApiErrorHandler.logError(apiError, context)
      return { success: false, error: apiError }
    }
  } else {
    const apiError = await ApiErrorHandler.fromResponse(response)
    ApiErrorHandler.logError(apiError, context)
    return { success: false, error: apiError }
  }
}

// Utility function to wrap fetch calls with error handling
export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit,
  context?: string
): Promise<{ success: true; response: Response } | { success: false; error: ApiError }> {
  try {
    const response = await fetch(url, options)
    return { success: true, response }
  } catch (error) {
    const apiError = error instanceof Error 
      ? ApiErrorHandler.fromNetworkError(error)
      : {
          type: ApiErrorType.UNKNOWN_ERROR,
          message: 'Unknown fetch error',
          timestamp: new Date().toISOString(),
          retryable: false
        }
    
    ApiErrorHandler.logError(apiError, context)
    return { success: false, error: apiError }
  }
}