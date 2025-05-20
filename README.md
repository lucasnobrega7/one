# v0ag1main

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/agentesdeconversao/v0-v0ag1main)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/a6MDojzPcxU)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/agentesdeconversao/v0-v0ag1main](https://vercel.com/agentesdeconversao/v0-v0ag1main)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/a6MDojzPcxU](https://v0.dev/chat/projects/a6MDojzPcxU)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Environment Variables

Configure these variables on your deployment platforms.

### Front-end (Vercel)

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` – Clerk publishable key
- `NEXT_PUBLIC_CLERK_BASE_URL` – Base URL for Clerk
- `NEXT_PUBLIC_APP_URL` – Public URL of the Next.js app
- `NEXT_PUBLIC_API_URL` – URL of the FastAPI service (used for rewrites)
- `NEXT_PUBLIC_API_BASE_URL` – Base URL for client-side API calls
- `NEXT_PUBLIC_ZAPI_URL` – Z-API endpoint for WhatsApp integration
- `OPENAI_API_KEY` – OpenAI API key
- `ZAPI_TOKEN` – Token for Z-API

### Back-end (Railway)

- `SUPABASE_URL` – Supabase project URL
- `SUPABASE_SERVICE_KEY` – Supabase service role key
- `REDIS_URL` – Redis connection URL
- `CLERK_WEBHOOK_SECRET` – Secret to verify Clerk webhooks
