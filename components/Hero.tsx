'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Transition } from 'motion/react'
import CertLogo from '@/components/CertLogo'

type BlurKeyframe = Record<string, string | number>

const buildKeyframes = (from: BlurKeyframe, steps: BlurKeyframe[]) => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ])
  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  stepDuration?: number
  as?: 'p' | 'span'
  onAnimationComplete?: () => void
}

function BlurText({
  text,
  delay = 150,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  stepDuration = 0.35,
  as: Tag = 'p',
  onAnimationComplete,
}: BlurTextProps) {
  const elements =
    animateBy === 'words'
      ? text.replace(/\n/g, ' \n ').split(' ').filter(Boolean)
      : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current as Element)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const defaultFrom = useMemo<BlurKeyframe>(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction],
  )

  const defaultTo = useMemo<BlurKeyframe[]>(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5,
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction],
  )

  const stepCount = defaultTo.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  )

  // Reduced-motion users just see the finished text.
  if (reduceMotion) {
    return (
      <Tag ref={ref as never} className={className}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref as never}
      className={`${className} flex flex-wrap`}
      style={{ columnGap: animateBy === 'words' ? '0.27em' : undefined }}
    >
      {elements.map((segment, index) => {
        // explicit line break (only from `sm` up; on phones words wrap naturally)
        if (segment === '\n') {
          return (
            <span
              key={index}
              aria-hidden='true'
              className='hidden sm:block basis-full h-0'
            />
          )
        }
        const transition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: 'easeOut',
        }
        return (
          <motion.span
            key={index}
            className='inline-block will-change-[transform,filter,opacity]'
            initial={defaultFrom}
            animate={
              inView ? buildKeyframes(defaultFrom, defaultTo) : defaultFrom
            }
            transition={transition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment === ' ' ? '\u00A0' : segment}
          </motion.span>
        )
      })}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

const wrap = 'max-w-[1240px] mx-auto px-5 sm:px-8'

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 16 16'
    fill='none'
    className={className}
    aria-hidden='true'
  >
    <path
      d='M2 8h11M9 4l4 4-4 4'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export default function Hero({
  certs,
}: {
  certs: { key: string; src: string; name: string }[]
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const v = videoRef.current
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
    <section className='relative isolate overflow-hidden bg-navy'>
      {/* Background video (hidden for reduced-motion users → plain navy) */}
      <video
        ref={videoRef}
        className='absolute inset-0 -z-30 h-full w-full object-cover motion-reduce:hidden'
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

      {/* Overlays: light tint + centre vignette (for the text) + top fade (for the header) */}
      <div aria-hidden='true' className='absolute inset-0 -z-20 bg-navy/40' />
      <div
        aria-hidden='true'
        className='absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_50%_52%,rgba(10,22,42,0.62),transparent_100%)]'
      />
      <div
        aria-hidden='true'
        className='absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-navy/70 to-transparent'
      />

      <div
        className={`${wrap} flex min-h-[640px] lg:min-h-[max(680px,calc(100svh_-_36px))] flex-col items-center justify-center pt-[calc(2rem+72px)] pb-12 sm:pt-[calc(3rem+72px)] sm:pb-14 lg:pt-[calc(2rem+72px)] lg:pb-16 text-center`}
      >
        <div className='max-w-[900px] flex flex-col items-center'>
          {/* eyebrow chip */}
          <div className='animate-rise inline-flex max-w-full items-center gap-2 sm:gap-2.5 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-3.5 sm:px-4 py-1.5 text-[10.5px] sm:text-[12px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white backdrop-blur-sm'>
            <span className='h-1.5 w-1.5 rounded-full bg-[#4ade9c]' />
            An ethical pharmaceutical company
          </div>

          <h1
            className='mt-5 sm:mt-6 font-semibold text-white leading-[1.08] [text-shadow:0_2px_28px_rgba(6,16,32,0.5)]'
            style={{
              // phones: 10vw (36px @360, 44px @440); tablet: 56px; desktop: 64px
              fontSize: 'max(clamp(2rem, 10vw, 3.5rem), min(6.25vw, 4rem))',
              // let the heading use ~12px more width each side than the body text
              width: 'calc(100% + 24px)',
              maxWidth: 'none',
            }}
            aria-label='Your Trusted Partner in Quality Healthcare.'
          >
            <BlurText
              as='span'
              className='justify-center'
              text={'Your Trusted Partner\nin Quality Healthcare.'}
              delay={110}
              animateBy='words'
              direction='top'
              stepDuration={0.4}
            />
          </h1>

          <div className='animate-rise [animation-delay:600ms] mt-4 sm:mt-5 text-[11.5px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-white/90 [text-shadow:0_1px_14px_rgba(6,16,32,0.6)]'>
            Quality &middot; Trust &middot; Commitment
          </div>

          <p
            className='animate-rise [animation-delay:700ms] mt-5 sm:mt-6 text-white/90 leading-relaxed max-w-[640px] text-balance [text-shadow:0_1px_14px_rgba(6,16,32,0.6)]'
            style={{ fontSize: 'clamp(0.97rem, 2.2vw, 1.125rem)' }}
          >
            GDNT Medicare works with certified manufacturers and checks quality
            at every stage, from sourcing to dispatch. Browse the catalog, then
            enquire for trade pricing.
          </p>

          <div className='animate-rise [animation-delay:850ms] mt-7 sm:mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row'>
            <Link
              href='/shop'
              className='group inline-flex w-full max-w-[300px] sm:w-auto sm:max-w-none items-center justify-center gap-2 bg-white text-forest-dark px-8 py-3.5 rounded-md font-bold text-[15px] shadow-lg shadow-black/20 transition-colors hover:bg-forest-pale'
            >
              Browse catalog
              <Arrow className='transition-transform group-hover:translate-x-1' />
            </Link>
            <Link
              href='/contact'
              className='inline-flex w-full max-w-[300px] sm:w-auto sm:max-w-none items-center justify-center border border-white/60 bg-white/5 text-white px-8 py-3.5 rounded-md font-bold text-[15px] backdrop-blur-sm transition-colors hover:border-white hover:bg-white/15'
            >
              Send an enquiry
            </Link>
          </div>

          {/* certification pill */}
          <div className='animate-rise [animation-delay:1000ms] mt-8 sm:mt-10 inline-flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 rounded-2xl sm:rounded-full border border-white/20 bg-white/10 px-5 py-3 sm:py-1.5 sm:pl-2 sm:pr-5 text-[12.5px] sm:text-[13px] text-white backdrop-blur-sm'>
            <span className='flex items-center gap-1.5'>
              {certs.map((c) => (
                <span
                  key={c.key}
                  className='w-8 h-8 rounded-full bg-white flex items-center justify-center p-1'
                >
                  <CertLogo
                    src={c.src}
                    alt={`${c.name} logo`}
                    className='max-w-full max-h-full'
                  />
                </span>
              ))}
            </span>
            <span className='whitespace-nowrap'>
              WHO, GMP and ISO certified
            </span>
          </div>
        </div>
      </div>

      {/* Pause / play */}
      <button
        type='button'
        onClick={toggle}
        aria-label={
          playing ? 'Pause background video' : 'Play background video'
        }
        className='absolute z-10 bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-navy flex items-center justify-center shadow-sm transition-colors motion-reduce:hidden'
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
    </section>
  )
}
