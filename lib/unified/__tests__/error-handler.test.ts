import { ApiErrorHandler, ApiErrorType, handleApiResponse, fetchWithErrorHandling } from '../error-handler'

describe('ApiErrorHandler', () => {
  describe('fromResponse', () => {
    it('should create error from 401 response', async () => {
      const response = new Response('Unauthorized', { status: 401, statusText: 'Unauthorized' })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.type).toBe(ApiErrorType.AUTHENTICATION_ERROR)
      expect(error.status).toBe(401)
      expect(error.retryable).toBe(false)
      expect(error.message).toContain('401')
    })

    it('should create error from 403 response', async () => {
      const response = new Response('Forbidden', { status: 403, statusText: 'Forbidden' })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.type).toBe(ApiErrorType.AUTHORIZATION_ERROR)
      expect(error.status).toBe(403)
      expect(error.retryable).toBe(false)
    })

    it('should create error from 404 response', async () => {
      const response = new Response('Not Found', { status: 404, statusText: 'Not Found' })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.type).toBe(ApiErrorType.NOT_FOUND_ERROR)
      expect(error.status).toBe(404)
      expect(error.retryable).toBe(false)
    })

    it('should create error from 422 response', async () => {
      const response = new Response('Validation Error', { status: 422, statusText: 'Unprocessable Entity' })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.type).toBe(ApiErrorType.VALIDATION_ERROR)
      expect(error.status).toBe(422)
      expect(error.retryable).toBe(false)
    })

    it('should create error from 429 response', async () => {
      const response = new Response('Too Many Requests', { status: 429, statusText: 'Too Many Requests' })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.type).toBe(ApiErrorType.RATE_LIMIT_ERROR)
      expect(error.status).toBe(429)
      expect(error.retryable).toBe(true)
    })

    it('should create error from 500 response', async () => {
      const response = new Response('Internal Server Error', { status: 500, statusText: 'Internal Server Error' })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.type).toBe(ApiErrorType.SERVER_ERROR)
      expect(error.status).toBe(500)
      expect(error.retryable).toBe(true)
    })

    it('should parse JSON error response', async () => {
      const errorData = { message: 'Custom error message', code: 'CUSTOM_ERROR' }
      const response = new Response(JSON.stringify(errorData), { 
        status: 400, 
        statusText: 'Bad Request',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.message).toBe('Custom error message')
      expect(error.details).toEqual(errorData)
    })

    it('should handle non-JSON response body', async () => {
      const response = new Response('Plain text error', { status: 400, statusText: 'Bad Request' })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.message).toBe('Plain text error')
    })

    it('should handle empty response body', async () => {
      const response = new Response('', { status: 500, statusText: 'Internal Server Error' })
      
      const error = await ApiErrorHandler.fromResponse(response)
      
      expect(error.message).toContain('HTTP 500')
    })
  })

  describe('fromNetworkError', () => {
    it('should create network error from Error object', () => {
      const networkError = new Error('Failed to fetch')
      
      const error = ApiErrorHandler.fromNetworkError(networkError)
      
      expect(error.type).toBe(ApiErrorType.NETWORK_ERROR)
      expect(error.message).toContain('Failed to fetch')
      expect(error.retryable).toBe(true)
      expect(error.details.originalError).toBe('Error')
    })

    it('should create network error from TypeError', () => {
      const networkError = new TypeError('Network request failed')
      
      const error = ApiErrorHandler.fromNetworkError(networkError)
      
      expect(error.type).toBe(ApiErrorType.NETWORK_ERROR)
      expect(error.details.originalError).toBe('TypeError')
    })
  })

  describe('fromValidationError', () => {
    it('should create validation error', () => {
      const error = ApiErrorHandler.fromValidationError('Invalid input', { field: 'email' })
      
      expect(error.type).toBe(ApiErrorType.VALIDATION_ERROR)
      expect(error.message).toBe('Invalid input')
      expect(error.details).toEqual({ field: 'email' })
      expect(error.retryable).toBe(false)
    })
  })

  describe('formatForUser', () => {
    it('should format network error for user', () => {
      const error = {
        type: ApiErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date().toISOString(),
        retryable: true
      }
      
      const formatted = ApiErrorHandler.formatForUser(error)
      
      expect(formatted).toBe('Erro de conexão. Verifique sua internet e tente novamente.')
    })

    it('should format authentication error for user', () => {
      const error = {
        type: ApiErrorType.AUTHENTICATION_ERROR,
        message: 'Unauthorized',
        timestamp: new Date().toISOString(),
        retryable: false
      }
      
      const formatted = ApiErrorHandler.formatForUser(error)
      
      expect(formatted).toBe('Erro de autenticação. Faça login novamente.')
    })

    it('should format authorization error for user', () => {
      const error = {
        type: ApiErrorType.AUTHORIZATION_ERROR,
        message: 'Forbidden',
        timestamp: new Date().toISOString(),
        retryable: false
      }
      
      const formatted = ApiErrorHandler.formatForUser(error)
      
      expect(formatted).toBe('Você não tem permissão para realizar esta ação.')
    })

    it('should format validation error with details for user', () => {
      const error = {
        type: ApiErrorType.VALIDATION_ERROR,
        message: 'Validation failed',
        details: { message: 'Email is required' },
        timestamp: new Date().toISOString(),
        retryable: false
      }
      
      const formatted = ApiErrorHandler.formatForUser(error)
      
      expect(formatted).toBe('Email is required')
    })

    it('should format rate limit error for user', () => {
      const error = {
        type: ApiErrorType.RATE_LIMIT_ERROR,
        message: 'Too many requests',
        timestamp: new Date().toISOString(),
        retryable: true
      }
      
      const formatted = ApiErrorHandler.formatForUser(error)
      
      expect(formatted).toBe('Muitas tentativas. Aguarde alguns minutos e tente novamente.')
    })

    it('should format server error for user', () => {
      const error = {
        type: ApiErrorType.SERVER_ERROR,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        retryable: true
      }
      
      const formatted = ApiErrorHandler.formatForUser(error)
      
      expect(formatted).toBe('Erro interno do servidor. Tente novamente em alguns instantes.')
    })
  })

  describe('shouldShowToUser', () => {
    it('should not show retryable network errors to user', () => {
      const error = {
        type: ApiErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date().toISOString(),
        retryable: true
      }
      
      const shouldShow = ApiErrorHandler.shouldShowToUser(error)
      
      expect(shouldShow).toBe(false)
    })

    it('should show authentication errors to user', () => {
      const error = {
        type: ApiErrorType.AUTHENTICATION_ERROR,
        message: 'Unauthorized',
        timestamp: new Date().toISOString(),
        retryable: false
      }
      
      const shouldShow = ApiErrorHandler.shouldShowToUser(error)
      
      expect(shouldShow).toBe(true)
    })

    it('should show validation errors to user', () => {
      const error = {
        type: ApiErrorType.VALIDATION_ERROR,
        message: 'Invalid input',
        timestamp: new Date().toISOString(),
        retryable: false
      }
      
      const shouldShow = ApiErrorHandler.shouldShowToUser(error)
      
      expect(shouldShow).toBe(true)
    })
  })

  describe('getRetryDelay', () => {
    it('should return longer delay for rate limit errors', () => {
      const error = {
        type: ApiErrorType.RATE_LIMIT_ERROR,
        message: 'Too many requests',
        timestamp: new Date().toISOString(),
        retryable: true
      }
      
      const delay1 = ApiErrorHandler.getRetryDelay(error, 1)
      const delay2 = ApiErrorHandler.getRetryDelay(error, 2)
      
      expect(delay1).toBe(10000) // 5000 * 2^1
      expect(delay2).toBe(20000) // 5000 * 2^2
    })

    it('should return exponential backoff for network errors', () => {
      const error = {
        type: ApiErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date().toISOString(),
        retryable: true
      }
      
      const delay1 = ApiErrorHandler.getRetryDelay(error, 1)
      const delay2 = ApiErrorHandler.getRetryDelay(error, 2)
      
      expect(delay1).toBe(2000) // 1000 * 2^1
      expect(delay2).toBe(4000) // 1000 * 2^2
    })

    it('should return zero delay for non-retryable errors', () => {
      const error = {
        type: ApiErrorType.AUTHENTICATION_ERROR,
        message: 'Unauthorized',
        timestamp: new Date().toISOString(),
        retryable: false
      }
      
      const delay = ApiErrorHandler.getRetryDelay(error, 1)
      
      expect(delay).toBe(0)
    })

    it('should cap the maximum delay', () => {
      const error = {
        type: ApiErrorType.RATE_LIMIT_ERROR,
        message: 'Too many requests',
        timestamp: new Date().toISOString(),
        retryable: true
      }
      
      const delay = ApiErrorHandler.getRetryDelay(error, 10) // Very high attempt number
      
      expect(delay).toBeLessThanOrEqual(30000) // Should be capped
    })
  })

  describe('logError', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation()
      jest.spyOn(console, 'warn').mockImplementation()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should log server errors as error level', () => {
      const error = {
        type: ApiErrorType.SERVER_ERROR,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        retryable: true
      }
      
      ApiErrorHandler.logError(error, 'test context')
      
      expect(console.error).toHaveBeenCalledWith('API Error:', expect.objectContaining({
        context: 'test context',
        type: ApiErrorType.SERVER_ERROR
      }))
    })

    it('should log other errors as warn level', () => {
      const error = {
        type: ApiErrorType.AUTHENTICATION_ERROR,
        message: 'Unauthorized',
        timestamp: new Date().toISOString(),
        retryable: false
      }
      
      ApiErrorHandler.logError(error, 'test context')
      
      expect(console.warn).toHaveBeenCalledWith('API Error:', expect.objectContaining({
        context: 'test context',
        type: ApiErrorType.AUTHENTICATION_ERROR
      }))
    })
  })
})

describe('handleApiResponse', () => {
  it('should handle successful response', async () => {
    const mockData = { id: '123', name: 'Test' }
    const response = new Response(JSON.stringify(mockData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
    const result = await handleApiResponse(response, 'test context')
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockData)
    }
  })

  it('should handle error response', async () => {
    const response = new Response('Not Found', { status: 404, statusText: 'Not Found' })
    
    const result = await handleApiResponse(response, 'test context')
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.type).toBe(ApiErrorType.NOT_FOUND_ERROR)
    }
  })

  it('should handle JSON parse error', async () => {
    const response = new Response('invalid json', { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
    const result = await handleApiResponse(response, 'test context')
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.type).toBe(ApiErrorType.UNKNOWN_ERROR)
      expect(result.error.message).toContain('Failed to parse response JSON')
    }
  })
})

describe('fetchWithErrorHandling', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('should handle successful fetch', async () => {
    const mockResponse = new Response('OK', { status: 200 })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)
    
    const result = await fetchWithErrorHandling('https://api.example.com', {}, 'test context')
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.response).toBe(mockResponse)
    }
  })

  it('should handle network error', async () => {
    const networkError = new Error('Failed to fetch')
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(networkError)
    
    const result = await fetchWithErrorHandling('https://api.example.com', {}, 'test context')
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.type).toBe(ApiErrorType.NETWORK_ERROR)
      expect(result.error.message).toContain('Failed to fetch')
    }
  })

  it('should handle unknown error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce('Unknown error')
    
    const result = await fetchWithErrorHandling('https://api.example.com', {}, 'test context')
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.type).toBe(ApiErrorType.UNKNOWN_ERROR)
      expect(result.error.message).toBe('Unknown fetch error')
    }
  })
})