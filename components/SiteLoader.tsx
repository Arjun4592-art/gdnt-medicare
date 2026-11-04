'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const SEEN_KEY = 'gdnt-loader-seen'
const MIN_SHOW_MS = 1100 // never flash: show at least this long
const MAX_SHOW_MS = 4500 // never hang: force-close after this long
const EXIT_MS = 600 // must match the fade-out duration below

/**
 * Full-screen splash shown while the site loads.
 *  - Rendered on the server, so it covers the page from the very first paint.
 *  - Shown once per browser session; later page loads skip it instantly
 *    (an inline script flags <html> before paint, so there is no flash).
 *  - Closes when the page has fully loaded (and the minimum time has passed).
 */
export default function SiteLoader() {
  const [progress, setProgress] = useState(8)
  const [phase, setPhase] = useState<'show' | 'exit' | 'gone'>('show')

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {}
    if (seen) {
      setPhase('gone')
      return
    }

    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden' // no scrolling behind the splash

    const startedAt = Date.now()
    let finished = false
    const timers: number[] = []

    // Progress creeps toward 90% and jumps to 100% when the page is ready.
    const tick = window.setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.09 : p))
    }, 100)

    const finish = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, MIN_SHOW_MS - (Date.now() - startedAt))
      timers.push(
        window.setTimeout(() => {
          window.clearInterval(tick)
          setProgress(100)
          timers.push(
            window.setTimeout(() => {
              setPhase('exit')
              root.style.overflow = prevOverflow
              try {
                sessionStorage.setItem(SEEN_KEY, '1')
              } catch {}
              timers.push(window.setTimeout(() => setPhase('gone'), EXIT_MS))
            }, 250),
          )
        }, wait),
      )
    }

    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    timers.push(window.setTimeout(finish, MAX_SHOW_MS))

    return () => {
      window.clearInterval(tick)
      timers.forEach(clearTimeout)
      window.removeEventListener('load', finish)
      root.style.overflow = prevOverflow
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <>
      {/* Runs before first paint: hides the splash on repeat visits. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('${SEEN_KEY}')==='1')document.documentElement.setAttribute('data-loader','skip')}catch(e){}`,
        }}
      />
      <noscript>
        <style>{'#site-loader{display:none!important}'}</style>
      </noscript>

      <div
        id='site-loader'
        role='status'
        aria-live='polite'
        aria-label='Loading GDNT Medicare'
        className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white transition-all ease-out ${
          phase === 'exit'
            ? 'opacity-0 scale-[1.03] pointer-events-none'
            : 'opacity-100'
        }`}
        style={{ transitionDuration: `${EXIT_MS}ms` }}
      >
        {/* soft background glow */}
        <div
          aria-hidden
          className='absolute w-[420px] h-[420px] rounded-full bg-forest-pale blur-3xl opacity-70 animate-loader-glow'
        />

        <div className='relative flex flex-col items-center px-6 text-center'>
          <Image
            src='/logo.png'
            alt='GDNT Medicare'
            width={776}
            height={322}
            priority
            className='h-[58px] sm:h-[68px] w-auto animate-loader-logo'
          />

          <p className='mt-5 text-[11.5px] sm:text-[12.5px] tracking-[0.22em] uppercase text-muted font-semibold animate-loader-text'>
            Ethical Pharmaceutical Company
          </p>

          {/* progress bar */}
          <div className='mt-8 h-[3px] w-[190px] sm:w-[240px] rounded-full bg-line overflow-hidden'>
            <div
              className='h-full w-full origin-left rounded-full bg-gradient-to-r from-forest via-forest to-gold transition-transform duration-300 ease-out'
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>

          <span className='sr-only'>Loading…</span>
        </div>
      </div>
    </>
  )
}
