'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts a number up when it scrolls into view.
 * Pass the full display value, e.g. "500+", "80+", "24 hr".
 * Values that don't start with a number (e.g. "GMP") are shown as-is.
 */
export default function CountUp({
  value,
  duration = 1400,
}: {
  value: string
  duration?: number
}) {
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''

  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || !match) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setTimeout(() => setN(target), 0)
      return () => clearTimeout(t)
    }

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setN(Math.round(target * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  if (!match) return <span>{value}</span>

  return (
    <span ref={ref} aria-label={value} className='tabular-nums'>
      {n}
      {suffix}
    </span>
  )
}
