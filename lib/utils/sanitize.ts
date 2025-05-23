import DOMPurify from "dompurify"
import { JSDOM } from "jsdom"

// Create a DOMPurify instance with a window from JSDOM
const window = new JSDOM("").window
const purify = DOMPurify(window)

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  })
}

/**
 * Sanitize user input for database queries
 */
export function sanitizeInput(input: string): string {
  // Remove any potentially dangerous characters
  return input
    .replace(/[<>]/g, "") // Remove < and > characters
    .trim()
}

/**
 * Sanitize object properties recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj }

  Object.keys(result).forEach((key) => {
    const value = result[key]

    if (typeof value === "string") {
      result[key] = sanitizeInput(value)
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObject(value)
    }
  })

  return result
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string {
  const sanitized = email.trim().toLowerCase()

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
    throw new Error("Invalid email format")
  }

  return sanitized
}
