'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/** true once the element has scrolled into view (fires only once) */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(() => setSeen(true), 0)
      return () => clearTimeout(t)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, seen] as const
}

/** eases a number from its previous value up to `target` once `active` */
export function useCountUp(target: number, active: boolean, duration = 1200) {
  const [n, setN] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setTimeout(() => {
        fromRef.current = target
        setN(target)
      }, 0)
      return () => clearTimeout(t)
    }
    const from = fromRef.current
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = from + (target - from) * eased
      fromRef.current = v
      setN(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])

  return n
}

/** a number that counts up when it scrolls into view */
export function AnimatedNumber({
  value,
  format = (n: number) => n.toLocaleString('en-IN'),
  duration = 1200,
}: {
  value: number
  format?: (n: number) => string
  duration?: number
}) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.1)
  const n = useCountUp(value, seen, duration)
  return (
    <span ref={ref} className='tabular-nums'>
      {format(Math.round(n))}
    </span>
  )
}

/** fades + rises its children into place when scrolled into view */
export function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const [ref, seen] = useInView<HTMLDivElement>(0.08)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none ${
        seen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
