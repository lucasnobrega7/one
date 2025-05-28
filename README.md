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

### Front-end (Vercel)

Set the following variables in your Vercel project:

| Variable | Description |
| -------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL of your Supabase instance. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key used by the client. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication. |
| `NEXT_PUBLIC_CLERK_BASE_URL` | Base URL of your Clerk deployment. |
| `NEXT_PUBLIC_APP_URL` | Public URL of the Next.js app. |
| `NEXT_PUBLIC_API_BASE_URL` | Base path used when calling the API routes. |
| `NEXT_PUBLIC_API_URL` | Domain where the API is accessible. |
| `NEXT_PUBLIC_DASHBOARD_URL` | URL for the dashboard domain. |
| `NEXT_PUBLIC_LOGIN_URL` | URL for the login domain. |
| `NEXT_PUBLIC_DOCS_URL` | URL for the documentation domain. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Key for PostHog analytics. |
| `NEXT_PUBLIC_ZAPI_URL` | Base URL for the Zapi service. |
| `BLOB_READ_WRITE_TOKEN` | Token used with Vercel Blob. |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint. |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token. |
| `CLERK_SECRET_KEY` | Secret key for Clerk server operations. |
| `CLERK_WEBHOOK_SECRET` | Secret used to verify Clerk webhooks. |
| `OPENAI_API_KEY` | API key for OpenAI features. |
| `ZAPI_TOKEN` | Token for the Zapi service. |

### Back-end (Railway)

Configure these variables on Railway for the Python API service:

| Variable | Description |
| -------- | ----------- |
| `SUPABASE_URL` | URL of your Supabase instance. |
| `SUPABASE_SERVICE_KEY` | Supabase service role key used by the backend. |
| `REDIS_URL` | Connection string for Redis. |
| `CLERK_WEBHOOK_SECRET` | Secret used to validate Clerk webhooks. |
