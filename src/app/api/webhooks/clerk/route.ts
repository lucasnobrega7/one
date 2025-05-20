import { Webhook } from "svix"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { syncUserToSupabase } from "@/domains/auth/services/authService"

export async function POST(req: Request) {
  // Verificar se o webhook é autêntico
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 })
  }

  // Obter o corpo da requisição
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verificar a assinatura
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    return new Response("Error: Missing webhook secret", { status: 500 })
  }

  const webhook = new Webhook(webhookSecret)

  try {
    webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error: Invalid signature", { status: 400 })
  }

  // Processar o evento
  const { type, data } = payload

  console.log(`Webhook received: ${type}`)

  try {
    switch (type) {
      case "user.created":
      case "user.updated":
        await syncUserToSupabase(data)
        break
      default:
        console.log(`Unhandled webhook event: ${type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new Response("Error processing webhook", { status: 500 })
  }
}
