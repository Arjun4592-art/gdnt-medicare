'use client'

import { useEffect, useRef, ReactNode } from 'react'

type Variant = 'up' | 'fade' | 'left' | 'right' | 'scale'

/**
 * Fades an element in when it scrolls into view.
 * variant: "up" (default) | "fade" | "left" | "right" | "scale"
 * delay:   ms, use i * 80 to stagger items in a grid or list
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'up',
}: {
  children: ReactNode
  delay?: number
  className?: string
  variant?: Variant
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-v={variant}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
