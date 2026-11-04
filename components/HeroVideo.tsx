'use client'

import { useRef, useState } from 'react'

/**
 * Looping video that fills its parent (the parent must be `relative` and have a size).
 * File in /public:  hero-video.mp4  (H.264, no audio needed)
 *
 * Includes a small pause/play button (accessibility + for people who find
 * moving media distracting). Hidden for reduced-motion users, who just see
 * the plain background of the parent.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <video
        ref={ref}
        className='absolute inset-0 h-full w-full object-cover motion-reduce:hidden'
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        aria-hidden='true'
        tabIndex={-1}
      >
        <source src='/hero-video.mp4' type='video/mp4' />
      </video>
      <button
        type='button'
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
        className='absolute z-10 bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-navy flex items-center justify-center shadow-sm transition-colors motion-reduce:hidden'
      >
        {playing ? (
          <svg width='12' height='12' viewBox='0 0 12 12' fill='currentColor'>
            <rect x='2' y='1.5' width='2.8' height='9' rx='0.8' />
            <rect x='7.2' y='1.5' width='2.8' height='9' rx='0.8' />
          </svg>
        ) : (
          <svg width='12' height='12' viewBox='0 0 12 12' fill='currentColor'>
            <path d='M3 1.8v8.4a.6.6 0 00.9.5l6.6-4.2a.6.6 0 000-1L3.9 1.3a.6.6 0 00-.9.5z' />
          </svg>
        )}
      </button>
    </>
  )
}
