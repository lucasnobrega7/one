"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Script from 'next/script'

export interface StaticResourceLoaderProps {
  /** Paths to resources inside the `/public` folder. */
  resources: string[]
}

/**
 * Preloads static scripts or images from the `/public` directory when the
 * component mounts. Images are loaded using `next/image` with `priority`, while
 * scripts are injected with `next/script`.
 */
export function StaticResourceLoader({ resources }: StaticResourceLoaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {resources.map((path, i) => {
        const lower = path.toLowerCase()
        if (/(?:png|jpg|jpeg|gif|svg|webp)$/.test(lower)) {
          return (
            <Image
              key={i}
              src={path}
              alt=""
              width={1}
              height={1}
              style={{ display: 'none' }}
              priority
            />
          )
        }

        if (lower.endsWith('.js')) {
          return <Script key={i} src={path} strategy="beforeInteractive" />
        }

        return null
      })}
    </>
  )
}