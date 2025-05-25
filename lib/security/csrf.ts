import crypto from 'crypto'
import { cookies } from 'next/headers'

/**
 * CSRF Protection Implementation
 * Generates and validates CSRF tokens for forms and API calls
 */

export async function generateCSRFToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  
  const cookieStore = cookies()
  cookieStore.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  
  return token
}

export async function validateCSRFToken(token: string): Promise<boolean> {
  if (!token) return false
  
  try {
    const cookieStore = cookies()
    const storedToken = cookieStore.get('csrf-token')?.value
    
    if (!storedToken) return false
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(storedToken, 'hex'),
      Buffer.from(token, 'hex')
    )
  } catch (error) {
    return false
  }
}

export async function getCSRFToken(): Promise<string | null> {
  try {
    const cookieStore = cookies()
    return cookieStore.get('csrf-token')?.value || null
  } catch (error) {
    return null
  }
}

export function clearCSRFToken(): void {
  try {
    const cookieStore = cookies()
    cookieStore.delete('csrf-token')
  } catch (error) {
    // Error clearing CSRF token
  }
}

/**
 * Middleware helper to validate CSRF for POST/PUT/DELETE requests
 */
export async function validateCSRFMiddleware(request: Request): Promise<boolean> {
  const method = request.method
  
  // Only validate for state-changing operations
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return true
  }
  
  // Get token from header or form data
  const headerToken = request.headers.get('X-CSRF-Token')
  let formToken: string | null = null
  
  try {
    const contentType = request.headers.get('Content-Type')
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      formToken = formData.get('csrf_token') as string
    }
  } catch (error) {
    // Ignore form parsing errors
  }
  
  const token = headerToken || formToken
  if (!token) return false
  
  return await validateCSRFToken(token)
}