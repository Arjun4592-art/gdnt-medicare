'use client'

import { useEffect, useState } from 'react'
import { AnimatedNumber, useInView } from './motion'

export interface BarDatum {
  label: string
  value: number
  color?: string
}

export default function BarChart({
  data,
  valuePrefix = '',
  limit,
  showShare = false,
  showRank = false,
}: {
  data: BarDatum[]
  valuePrefix?: string
  /** show only the first N rows, with a "Show all" toggle */
  limit?: number
  /** show each row's % of the total next to the value */
  showShare?: boolean
  /** show a small rank number (1, 2, 3 …) before each label */
  showRank?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [ref, seen] = useInView<HTMLUListElement>(0.15)
  const max = Math.max(1, ...data.map((d) => d.value))
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const canCollapse = !!limit && data.length > limit
  const rows = canCollapse && !expanded ? data.slice(0, limit) : data

  return (
    <div>
      <style>{`
        @keyframes barShine {
          from { transform: translateX(-120%); }
          to { transform: translateX(420%); }
        }
      `}</style>
      <ul ref={ref} className='space-y-3.5'>
        {rows.map((d, i) => (
          <BarRow
            key={d.label}
            datum={d}
            index={i}
            active={seen}
            widthPct={Math.max(2, (d.value / max) * 100)}
            share={Math.round((d.value / total) * 100)}
            valuePrefix={valuePrefix}
            showShare={showShare}
            showRank={showRank}
          />
        ))}
      </ul>

      {canCollapse && (
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          className='mt-5 text-[12.5px] font-bold text-forest hover:underline'
        >
          {expanded ? 'Show less' : `Show all ${data.length}`}
        </button>
      )}
    </div>
  )
}

function BarRow({
  datum: d,
  index: i,
  active,
  widthPct,
  share,
  valuePrefix,
  showShare,
  showRank,
}: {
  datum: BarDatum
  index: number
  active: boolean
  widthPct: number
  share: number
  valuePrefix: string
  showShare: boolean
  showRank: boolean
}) {
  // start collapsed, then grow to the real width on the next frame
  const [grown, setGrown] = useState(false)
  useEffect(() => {
    if (!active) return
    const id = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(id)
  }, [active])

  const delay = Math.min(i, 8) * 80

  return (
    <li
      className={`group transition-all duration-500 motion-reduce:transition-none ${
        grown ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className='flex items-center justify-between gap-3 mb-1.5'>
        <span className='flex items-center gap-2.5 min-w-0'>
          {showRank && (
            <span
              className={`w-5 h-5 shrink-0 rounded-md text-[10.5px] font-extrabold flex items-center justify-center ${
                i === 0 ? 'bg-forest text-white' : 'bg-bg-soft text-muted'
              }`}
            >
              {i + 1}
            </span>
          )}
          <span
            className='text-[13px] font-semibold text-navy truncate'
            title={d.label}
          >
            {d.label}
          </span>
        </span>
        <span className='shrink-0 flex items-baseline gap-1.5 sm:gap-2'>
          <span className='text-[13px] font-extrabold text-navy tabular-nums'>
            {valuePrefix}
            <AnimatedNumber value={d.value} duration={900 + delay} />
          </span>
          {showShare && (
            <span className='text-[11px] font-bold text-muted w-8 text-right tabular-nums'>
              <AnimatedNumber
                value={share}
                format={(n) => `${n}%`}
                duration={900 + delay}
              />
            </span>
          )}
        </span>
      </div>
      <div className='h-2 rounded-full bg-bg-soft overflow-hidden'>
        <div
          className='relative h-full rounded-full overflow-hidden transition-[width] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:brightness-110'
          style={{
            width: grown ? `${widthPct}%` : '0%',
            transitionDelay: `${delay}ms`,
            background:
              d.color ||
              (i === 0
                ? 'linear-gradient(90deg, #0B4F38, #14A876)'
                : 'linear-gradient(90deg, #0F6E4E, #3DBE91)'),
            opacity: d.color ? 1 : Math.max(0.55, 1 - i * 0.07),
          }}
        >
          {/* soft shine that sweeps across the bar once it has grown */}
          {grown && (
            <span
              className='absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent motion-reduce:hidden'
              style={{
                animation: `barShine 1.1s ease-out ${delay + 700}ms 1 both`,
              }}
            />
          )}
        </div>
      </div>
    </li>
  )
}
