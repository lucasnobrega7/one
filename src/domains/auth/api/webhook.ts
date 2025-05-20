import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { syncUserToSupabase } from "../services/authService"

/**
 * Endpoint para processar webhooks do Clerk
 */
export async function POST(req: Request) {
  // Obter o cabeçalho de assinatura
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // Se não houver cabeçalhos de assinatura, retornar erro
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Erro: cabeçalhos de webhook ausentes", {
      status: 400,
    })
  }

  // Obter o corpo da requisição
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Validar a assinatura do webhook
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Erro ao verificar webhook:", err)
    return new Response("Erro: assinatura inválida", {
      status: 400,
    })
  }

  // Processar o evento
  const eventType = evt.type

  if (eventType === "user.created" || eventType === "user.updated") {
    // Sincronizar usuário com o Supabase
    await syncUserToSupabase(evt.data)
  }

  return NextResponse.json({ success: true })
}
