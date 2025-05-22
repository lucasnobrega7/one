"use client"

import { useState, useEffect } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function EnvChecker() {
  const [missingVars, setMissingVars] = useState<string[]>([])
  const [invalidUrls, setInvalidUrls] = useState<string[]>([])

  useEffect(() => {
    const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    const urlVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXTAUTH_URL"]

    const missing: string[] = []
    const invalid: string[] = []

    // Check for missing variables
    requiredVars.forEach((varName) => {
      if (!process.env[varName]) {
        missing.push(varName)
      }
    })

    // Check for invalid URLs
    urlVars.forEach((varName) => {
      const url = process.env[varName]
      if (url) {
        try {
          new URL(url)
        } catch (e) {
          invalid.push(`${varName}: ${url}`)
        }
      }
    })

    setMissingVars(missing)
    setInvalidUrls(invalid)
  }, [])

  if (missingVars.length === 0 && invalidUrls.length === 0) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>Environment Variable Issues Detected</AlertTitle>
      <AlertDescription>
        {missingVars.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">Missing Variables:</p>
            <ul className="list-disc pl-5">
              {missingVars.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        )}

        {invalidUrls.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">Invalid URLs:</p>
            <ul className="list-disc pl-5">
              {invalidUrls.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
