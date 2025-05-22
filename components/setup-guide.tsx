"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import Link from "next/link"

export function SetupGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasPlaceholderUrl =
    !supabaseUrl || supabaseUrl === "your-supabase-url" || supabaseUrl === "https://your-project-id.supabase.co"

  // Only show if we detect placeholder values
  if (!hasPlaceholderUrl) return null

  return (
    <Card className="w-full max-w-3xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center text-amber-500">
          <AlertCircle className="mr-2 h-5 w-5" />
          Setup Required
        </CardTitle>
        <CardDescription>
          Your application is using placeholder environment variables and needs to be configured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertTitle>Environment Configuration Needed</AlertTitle>
          <AlertDescription>
            You need to set up your environment variables before the application will work correctly.
          </AlertDescription>
        </Alert>

        <Button variant="outline" className="w-full mt-4" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Hide Setup Instructions
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show Setup Instructions
            </>
          )}
        </Button>

        {isOpen && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Quick Setup Guide:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Create a <code className="bg-background px-1 py-0.5 rounded">.env.local</code> file in your project
                  root
                </li>
                <li>Add the required environment variables with proper values</li>
                <li>
                  For Supabase URL, use format:{" "}
                  <code className="bg-background px-1 py-0.5 rounded">https://your-project-id.supabase.co</code>
                </li>
                <li>Restart your development server</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">Required Variables:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> - Your Supabase project
                  URL
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Your Supabase
                  anon key
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">NEXTAUTH_URL</code> - Your application URL
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">NEXTAUTH_SECRET</code> - A secure random string
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/admin/config-check">
            <CheckCircle className="mr-2 h-4 w-4" />
            Check Configuration
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Supabase Dashboard
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
