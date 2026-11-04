'use client'

import { useState, type ReactNode } from 'react'

/**
 * Official WHO logo used next to every "WHO-GMP" mention.
 *
 * Drop the genuine logo file at:  public/who-logo.png
 * (transparent PNG, ideally ~200px or wider).
 *
 * Until that file exists, `fallback` is rendered instead (and the optional
 * white `tile` wrapper is skipped), so the page never shows a broken image.
 */
export default function WhoLogo({
  className = 'h-4 w-4',
  tile,
  fallback = null,
}: {
  className?: string
  /** classes for a wrapper (e.g. a white rounded tile) shown only when the logo loads */
  tile?: string
  fallback?: ReactNode
}) {
  const [failed, setFailed] = useState(false)

  if (failed) return <>{fallback}</>

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      // The image can fail *before* React hydrates, in which case onError never
      // fires — so also check on mount whether it already finished with 0 width.
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailed(true)
      }}
      src='/who-logo.png'
      alt='World Health Organization logo'
      className={`object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  )

  return tile ? <span className={tile}>{img}</span> : img
}
