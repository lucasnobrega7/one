import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    // Parse the request body safely
    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { userId, email } = body

    if (!userId || !email) {
      return NextResponse.json({ error: "Dados de usuário incompletos" }, { status: 400 })
    }

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    // Create Supabase client with service role
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if user exists in Supabase
    const { data: userData, error: userError } = await supabase.from("users").select("id").eq("id", userId).single()

    if (userError && userError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      return NextResponse.json({ error: "Database query error" }, { status: 500 })
    }

    if (!userData) {
      // If user doesn't exist, check by email
      const { data: userByEmail, error: emailError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single()

      if (emailError && emailError.code !== "PGRST116") {
        return NextResponse.json({ error: "Database query error" }, { status: 500 })
      }

      if (!userByEmail) {
        // Create user if doesn't exist
        const { error: insertError } = await supabase.from("users").insert({
          id: userId,
          email: email,
        })

        if (insertError) {
          return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
        }

        // Add default role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: userId,
          role: "user",
        })

        if (roleError) {
          // Don't fail the whole process if role assignment fails
        }
      }
    }

    // Generate a session for the user
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    })

    if (error) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    return NextResponse.json({ success: true, session: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
