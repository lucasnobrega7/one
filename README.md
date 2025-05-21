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

All required environment variables for both the Next.js frontend and the FastAPI
backend are listed in `.env.example`. Copy this file to `.env` and provide the
appropriate values before running the project.

## Static Resource Loader

The `StaticResourceLoader` component preloads scripts or images from the `/public` folder once mounted.

```tsx
import { StaticResourceLoader } from '@/src/components/StaticResourceLoader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StaticResourceLoader resources={['/marketing-bot.png', '/my-script.js']} />
      {children}
    </>
  )
}
```