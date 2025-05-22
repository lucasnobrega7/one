"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const error = searchParams?.get("error")

  useEffect(() => {
    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      Configuration: "There is a problem with the server configuration.",
      AccessDenied: "You do not have permission to sign in.",
      Verification: "The verification link may have been used or is invalid.",
      Default: "An unexpected error occurred.",
      CredentialsSignin: "The email or password you entered is incorrect.",
      OAuthSignin: "Error in the OAuth sign-in process.",
      OAuthCallback: "Error in the OAuth callback process.",
      OAuthCreateAccount: "Could not create OAuth provider account.",
      EmailCreateAccount: "Could not create email provider account.",
      Callback: "Error in the callback handler.",
      OAuthAccountNotLinked: "This email is already associated with another account.",
      EmailSignin: "Error sending the email verification link.",
      SessionRequired: "Please sign in to access this page.",
    }

    setErrorMessage(error && errorMessages[error] ? errorMessages[error] : errorMessages.Default)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mb-6 text-gray-700">{errorMessage}</p>
        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className="rounded bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700"
          >
            Return to Login
          </Link>
          <Link href="/" className="text-center text-sm text-blue-600 hover:underline">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
