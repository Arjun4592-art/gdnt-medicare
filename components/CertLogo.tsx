'use client'

import { useState, type ReactNode } from 'react'

/**
 * Generic certification / affiliate logo.
 *
 * Drop the genuine logo files in /public:
 *   public/who-logo.png   (World Health Organization)
 *   public/gmp-logo.jpg   (GMP certificate mark)
 *   public/iso-logo.png   (ISO certificate mark)
 *
 * Until a file exists, `fallback` is shown so the page never has a broken image.
 */
export default function CertLogo({
  src,
  alt,
  className = 'h-16 w-auto',
  fallback = null,
  tile,
}: {
  src: string
  alt: string
  className?: string
  fallback?: ReactNode
  /** wrapper classes (e.g. white tile), only rendered when the logo loads */
  tile?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) return <>{fallback}</>

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailed(true)
      }}
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  )

  return tile ? <span className={tile}>{img}</span> : img
}
