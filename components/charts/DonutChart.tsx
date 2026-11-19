'use client'

import { useId, useState } from 'react'
import { AnimatedNumber, useInView } from './motion'

export interface DonutDatum {
  label: string
  value: number
  color: string
}

// Geometry (SVG user units). The biggest slice reaches the outer radius R,
// smaller slices stop a little short — this gives the "stepped" look.
const VB = 240
const C = VB / 2
const R = 108
const RI = 58
const HOVER_POP = 7

const rad = (deg: number) => (deg * Math.PI) / 180
const pt = (r: number, deg: number) => ({
  x: C + r * Math.cos(rad(deg)),
  y: C + r * Math.sin(rad(deg)),
})

function slicePath(a0: number, a1: number, ro: number) {
  const o0 = pt(ro, a0)
  const o1 = pt(ro, a1)
  const i0 = pt(RI, a0)
  const i1 = pt(RI, a1)
  const large = a1 - a0 > 180 ? 1 : 0
  return [
    `M ${o0.x} ${o0.y}`,
    `A ${ro} ${ro} 0 ${large} 1 ${o1.x} ${o1.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${RI} ${RI} 0 ${large} 0 ${i0.x} ${i0.y}`,
    'Z',
  ].join(' ')
}

// A single 100% slice cannot be drawn as an arc, so draw a full ring instead.
function ringPath(ro: number) {
  return [
    `M ${C - ro} ${C} a ${ro} ${ro} 0 1 0 ${ro * 2} 0 a ${ro} ${ro} 0 1 0 ${-ro * 2} 0 Z`,
    `M ${C - RI} ${C} a ${RI} ${RI} 0 1 0 ${RI * 2} 0 a ${RI} ${RI} 0 1 0 ${-RI * 2} 0 Z`,
  ].join(' ')
}

export default function DonutChart({
  data,
  size = 240,
  centerLabel = 'Total',
  unit = 'items',
}: {
  data: DonutDatum[]
  /** maximum width of the ring in px (it shrinks to fit small screens) */
  size?: number
  /** small caption shown under the total in the middle of the ring */
  centerLabel?: string
  /** plural noun used in the hover tooltip, e.g. 'products' */
  unit?: string
}) {
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  const [hovered, setHovered] = useState<string | null>(null)
  const maskId = 'donut-mask-' + useId().replace(/[^a-zA-Z0-9]/g, '')

  const total = data.reduce((s, d) => s + d.value, 0)
  const visible = data.filter((d) => d.value > 0)
  const maxValue = Math.max(1, ...visible.map((d) => d.value))

  let angle = -90
  const slices = visible.map((d) => {
    const sweep = (d.value / total) * 360
    const a0 = angle
    const a1 = angle + sweep
    angle = a1
    const ro = RI + (R - RI) * (0.7 + 0.3 * (d.value / maxValue))
    const mid = (a0 + a1) / 2
    return {
      ...d,
      a0,
      a1,
      ro,
      pct: Math.round((d.value / total) * 100),
      share: sweep / 360,
      tip: pt(ro + HOVER_POP, mid),
      pop: {
        x: Math.cos(rad(mid)) * HOVER_POP,
        y: Math.sin(rad(mid)) * HOVER_POP,
      },
    }
  })

  const activeSlice = slices.find((s) => s.label === hovered) ?? null

  const maskR = (R + HOVER_POP + 2) / 2
  const maskLen = 2 * Math.PI * maskR

  return (
    <div ref={ref} className='@container w-full'>
      <div className='flex flex-col items-center gap-6'>
        <div
          className='relative shrink-0 w-full aspect-square'
          style={{ maxWidth: size }}
        >
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            className='w-full h-full overflow-visible'
            role='img'
            aria-label={`Donut chart, ${total} total`}
          >
            <defs>
              <mask id={maskId}>
                <circle
                  cx={C}
                  cy={C}
                  r={maskR}
                  fill='none'
                  stroke='#fff'
                  strokeWidth={maskR * 2}
                  strokeDasharray={`${seen ? maskLen : 0} ${maskLen}`}
                  transform={`rotate(-90 ${C} ${C})`}
                  className='motion-reduce:!transition-none'
                  style={{
                    transition:
                      'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </mask>
            </defs>

            {total === 0 && (
              <path d={ringPath(R)} fill='var(--bg-soft)' fillRule='evenodd' />
            )}

            <g mask={`url(#${maskId})`}>
              {slices.map((s) => {
                const active = hovered === s.label
                return (
                  <g
                    key={s.label}
                    onMouseEnter={() => setHovered(s.label)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() =>
                      setHovered((h) => (h === s.label ? null : s.label))
                    }
                    style={{
                      transform: active
                        ? `translate(${s.pop.x}px, ${s.pop.y}px)`
                        : 'translate(0px, 0px)',
                      transition: 'transform 220ms ease-out',
                      cursor: 'pointer',
                    }}
                  >
                    {slices.length === 1 ? (
                      <path
                        d={ringPath(s.ro)}
                        fill={s.color}
                        fillRule='evenodd'
                      />
                    ) : (
                      <path
                        d={slicePath(s.a0, s.a1, s.ro)}
                        fill={s.color}
                        stroke='#fff'
                        strokeWidth={2.5}
                        strokeLinejoin='round'
                      />
                    )}
                  </g>
                )
              })}
            </g>
          </svg>

          {/* hover / tap details */}
          {activeSlice && (
            <div
              className='absolute z-10 pointer-events-none'
              style={{
                left: `${Math.min(80, Math.max(20, (activeSlice.tip.x / VB) * 100))}%`,
                top: `${(activeSlice.tip.y / VB) * 100}%`,
                transform:
                  activeSlice.tip.y < C
                    ? 'translate(-50%, -100%)'
                    : 'translate(-50%, 0)',
              }}
            >
              <div className='rounded-lg bg-navy text-white shadow-lg px-3 py-2 whitespace-nowrap'>
                <div className='flex items-center gap-2 text-[12px] font-bold'>
                  <span
                    className='w-2 h-2 rounded-full shrink-0'
                    style={{ background: activeSlice.color }}
                  />
                  {activeSlice.label}
                </div>
                <div className='mt-1 text-[12px] text-white/85 tabular-nums'>
                  <span className='font-extrabold text-white'>
                    {activeSlice.value.toLocaleString('en-IN')}
                  </span>{' '}
                  {activeSlice.value === 1 ? unit.replace(/s$/, '') : unit}
                  <span className='mx-1.5 text-white/40'>•</span>
                  <span className='font-extrabold text-white'>
                    {activeSlice.pct}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* centre of the ring */}
          <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
            <span className='text-[26px] leading-none font-extrabold text-navy tabular-nums'>
              <AnimatedNumber value={total} duration={1100} />
            </span>
            <span className='text-[11px] font-bold uppercase tracking-wider text-muted mt-1.5'>
              {centerLabel}
            </span>
          </div>
        </div>

        <ul className='flex flex-wrap justify-center gap-x-5 gap-y-2.5'>
          {data.map((d, i) => (
            <li
              key={d.label}
              onMouseEnter={() => setHovered(d.label)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-2 text-[13px] font-semibold cursor-default transition-all duration-500 motion-reduce:transition-none ${
                hovered === d.label ? 'text-navy' : 'text-muted'
              } ${seen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              style={{ transitionDelay: `${300 + i * 90}ms` }}
            >
              <span
                className='w-2.5 h-2.5 rounded-full shrink-0 transition-transform'
                style={{
                  background: d.color,
                  transform: hovered === d.label ? 'scale(1.35)' : 'scale(1)',
                }}
              />
              {d.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
