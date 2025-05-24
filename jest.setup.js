"use client"

// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"
import { TextDecoder, TextEncoder } from "util"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return ""
  },
}))

// Mock next-auth (conditional)
try {
  jest.mock("next-auth/react", () => ({
    useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }))
} catch {
  // NextAuth may not be available in all test contexts
}

// Mock Supabase
jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: jest.fn(() => ({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({ data: null, error: null })),
            order: jest.fn(() => ({ data: [], error: null })),
            data: [],
            error: null,
          })),
          order: jest.fn(() => ({ data: [], error: null })),
          data: [],
          error: null,
        })),
        insert: jest.fn(() => ({ data: null, error: null })),
        update: jest.fn(() => ({ data: null, error: null })),
        delete: jest.fn(() => ({ data: null, error: null })),
      })),
      auth: {
        getSession: jest.fn(() => ({ data: { session: null }, error: null })),
        signIn: jest.fn(() => ({ data: null, error: null })),
        signOut: jest.fn(() => ({ error: null })),
      },
    })),
  }
})

// Add TextEncoder and TextDecoder to global scope
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
  }),
)
