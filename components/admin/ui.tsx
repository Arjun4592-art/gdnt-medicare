'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/* ------------------------------------------------------------------ */
/* Icons (24x24, stroke based — one place so every panel matches)       */
/* ------------------------------------------------------------------ */
const ICON_PATHS = {
  overview: (
    <>
      <rect x='3' y='3' width='7' height='7' rx='1.5' />
      <rect x='14' y='3' width='7' height='7' rx='1.5' />
      <rect x='3' y='14' width='7' height='7' rx='1.5' />
      <rect x='14' y='14' width='7' height='7' rx='1.5' />
    </>
  ),
  products: (
    <>
      <path d='M21 7.5v9L12 21l-9-4.5v-9L12 3l9 4.5z' />
      <path d='M3.3 7l8.7 4.5L20.7 7' />
      <path d='M12 21v-9.5' />
    </>
  ),
  categories: (
    <>
      <path d='M20.5 13.2l-7.3 7.3a1.5 1.5 0 01-2.1 0l-7.8-7.8a1.5 1.5 0 01-.4-1V4.5A1.5 1.5 0 014.3 3h7.2c.4 0 .8.2 1 .4l7.9 7.9a1.5 1.5 0 010 2.1z' />
      <circle cx='8.3' cy='7.8' r='1.3' fill='currentColor' stroke='none' />
    </>
  ),
  inventory: (
    <>
      <rect x='3' y='4' width='18' height='4' rx='1' />
      <path d='M5 8v9a2 2 0 002 2h10a2 2 0 002-2V8' />
      <path d='M10 13h4' />
    </>
  ),
  enquiries: <path d='M4 4h16v12H8l-4 4V4z' />,
  analytics: (
    <>
      <path d='M4 20V10' />
      <path d='M12 20V4' />
      <path d='M20 20v-7' />
    </>
  ),
  plus: <path d='M12 5v14M5 12h14' />,
  search: (
    <>
      <circle cx='11' cy='11' r='7' />
      <path d='M21 21l-4.3-4.3' />
    </>
  ),
  edit: <path d='M4 20h4l11-11-4-4L4 16v4z' />,
  trash: <path d='M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13' />,
  check: <path d='M5 12.5l4.5 4.5L19 7.5' />,
  alert: (
    <>
      <path d='M12 3l10 18H2L12 3z' />
      <path d='M12 10v5M12 18.2v.1' />
    </>
  ),
  close: <path d='M6 6l12 12M18 6L6 18' />,
  external: (
    <path d='M15 3h6v6M10 14L21 3M19 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5' />
  ),
  logout: (
    <path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9' />
  ),
  refresh: <path d='M20 11a8 8 0 10-2.3 5.7M20 4v7h-7' />,
  image: (
    <>
      <rect x='3' y='4' width='18' height='16' rx='2' />
      <circle cx='8.5' cy='9.5' r='1.5' />
      <path d='M21 16l-5-5-8 9' />
    </>
  ),
  menu: <path d='M4 7h16M4 12h16M4 17h16' />,
  rupee: <path d='M7 5h10M7 9.5h10M7 5c5 0 7 1.5 7 4.5S11 14 7 14l7 6' />,
} as const

export type IconName = keyof typeof ICON_PATHS

export function Icon({
  name,
  size = 18,
  className,
}: {
  name: IconName
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      className={className}
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Layout primitives                                                    */
/* ------------------------------------------------------------------ */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7'>
      <div>
        <h1 className='text-[22px] md:text-2xl font-extrabold text-navy tracking-tight'>
          {title}
        </h1>
        {subtitle && (
          <p className='text-[13.5px] text-muted mt-1'>{subtitle}</p>
        )}
      </div>
      {actions && <div className='flex items-center gap-2.5'>{actions}</div>}
    </div>
  )
}

export function Card({
  title,
  action,
  children,
  className = '',
  bodyClassName = '',
  flush = false,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  /** extra classes for the content area (e.g. to centre it vertically) */
  bodyClassName?: string
  /** remove inner padding (for tables) */
  flush?: boolean
}) {
  return (
    <section
      className={`flex flex-col bg-white border border-line rounded-2xl shadow-[0_1px_2px_rgba(20,24,31,0.04)] ${className}`}
    >
      {title && (
        <div className='px-4 sm:px-6 py-3.5 sm:py-4 min-h-[58px] border-b border-line flex flex-wrap items-center justify-between gap-x-4 gap-y-2'>
          <h3 className='text-[14.5px] font-extrabold text-navy'>{title}</h3>
          {action && <div className='shrink-0'>{action}</div>}
        </div>
      )}
      <div
        className={`flex-1 min-w-0 ${flush ? '' : 'p-4 sm:p-6'} ${bodyClassName}`}
      >
        {children}
      </div>
    </section>
  )
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled,
  icon,
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  icon?: IconName
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className='inline-flex items-center gap-2 bg-forest text-white px-4.5 py-2.5 rounded-lg font-bold text-[13px] shadow-sm transition-all hover:bg-forest-dark hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0'
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  disabled,
  icon,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: IconName
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className='inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line bg-white text-[13px] font-bold text-navy transition-colors hover:border-forest hover:text-forest disabled:opacity-60'
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  )
}

export function IconButton({
  icon,
  title,
  onClick,
  tone = 'forest',
}: {
  icon: IconName
  title: string
  onClick: () => void
  tone?: 'forest' | 'danger'
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-8 h-8 rounded-lg bg-bg-soft flex items-center justify-center transition-colors ${
        tone === 'danger'
          ? 'text-[#C0392B] hover:bg-[#FBEAE8]'
          : 'text-forest hover:bg-forest-pale'
      }`}
    >
      <Icon name={icon} size={15} />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Badges                                                               */
/* ------------------------------------------------------------------ */
const TONES = {
  green: 'bg-[#E7F5EE] text-[#0F6E4E]',
  red: 'bg-[#FBEAE8] text-[#C0392B]',
  amber: 'bg-[#FDF3E3] text-[#9A6C14]',
  gray: 'bg-[#EEF0F2] text-[#5B6470]',
  navy: 'bg-[#E9ECF3] text-[#1B2A4A]',
} as const

export type Tone = keyof typeof TONES

export function Badge({
  tone = 'gray',
  children,
  dot = false,
}: {
  tone?: Tone
  children: ReactNode
  dot?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${TONES[tone]}`}
    >
      {dot && <span className='w-1.5 h-1.5 rounded-full bg-current' />}
      {children}
    </span>
  )
}

export function Th({
  children,
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <th
      className={`text-left text-[11px] uppercase tracking-wider text-muted font-bold px-5 py-3 bg-bg-soft/70 border-b border-line whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  className = '',
  colSpan,
}: {
  children?: ReactNode
  className?: string
  colSpan?: number
}) {
  return (
    <td
      colSpan={colSpan}
      className={`px-5 py-3.5 text-[13.5px] border-b border-line ${className}`}
    >
      {children}
    </td>
  )
}

/* ------------------------------------------------------------------ */
/* Search + segmented filter                                            */
/* ------------------------------------------------------------------ */
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className='relative flex-1 min-w-[200px] max-w-[340px]'>
      <Icon
        name='search'
        size={15}
        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className='w-full border border-line rounded-lg pl-10 pr-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-forest/25 focus:border-forest'
      />
    </div>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className='flex bg-[#EBEEEC] rounded-lg p-1 gap-1 w-fit'>
      {options.map((s) => (
        <button
          key={s}
          type='button'
          onClick={() => onChange(s)}
          className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-bold transition-colors whitespace-nowrap ${
            value === s
              ? 'bg-white text-forest shadow-sm'
              : 'text-muted hover:text-navy'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Modal                                                                */
/* ------------------------------------------------------------------ */
export function Modal({
  title,
  onClose,
  children,
  width = 400,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-navy/45 backdrop-blur-[2px] px-4'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label={title}
    >
      <div
        className='bg-white rounded-2xl border border-line shadow-2xl w-full p-6'
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-[15.5px] font-extrabold text-navy'>{title}</h3>
          <button
            type='button'
            onClick={onClose}
            className='w-8 h-8 rounded-md flex items-center justify-center text-muted hover:bg-bg-soft hover:text-navy transition-colors'
            aria-label='Close'
          >
            <Icon name='close' size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Empty + loading states                                               */
/* ------------------------------------------------------------------ */
export function EmptyState({
  icon = 'products',
  title,
  text,
  action,
}: {
  icon?: IconName
  title: string
  text?: string
  action?: ReactNode
}) {
  return (
    <div className='bg-white border border-dashed border-[#cfd4da] rounded-2xl px-6 py-14 text-center'>
      <div className='w-12 h-12 mx-auto rounded-full bg-forest-pale text-forest flex items-center justify-center mb-4'>
        <Icon name={icon} size={22} />
      </div>
      <h3 className='text-[16px] font-extrabold text-navy'>{title}</h3>
      {text && (
        <p className='text-[13.5px] text-muted mt-1.5 max-w-[380px] mx-auto'>
          {text}
        </p>
      )}
      {action && <div className='mt-5'>{action}</div>}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div
      className='animate-pulse'
      aria-busy='true'
      aria-label='Loading dashboard'
    >
      <div className='h-7 w-56 bg-[#E6E9E8] rounded-md mb-2' />
      <div className='h-4 w-72 bg-[#EEF0EF] rounded-md mb-8' />
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className='h-[112px] bg-white border border-line rounded-2xl'
          />
        ))}
      </div>
      <div className='h-72 bg-white border border-line rounded-2xl' />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* KPI card                                                             */
/* ------------------------------------------------------------------ */
export function KpiCard({
  label,
  value,
  hint,
  icon,
  tone = 'green',
  onClick,
}: {
  label: string
  value: ReactNode
  hint?: string
  icon: IconName
  tone?: 'green' | 'red' | 'amber' | 'navy'
  onClick?: () => void
}) {
  const toneBox = {
    green: 'bg-forest-pale text-forest',
    red: 'bg-[#FBEAE8] text-[#C0392B]',
    amber: 'bg-[#FDF3E3] text-[#9A6C14]',
    navy: 'bg-[#E9ECF3] text-navy',
  }[tone]
  const inner = (
    <>
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0 text-[10.5px] sm:text-[12px] text-muted font-bold uppercase tracking-wide'>
          {label}
        </div>
        <span
          className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl flex items-center justify-center ${toneBox}`}
        >
          <Icon name={icon} size={17} />
        </span>
      </div>
      <div className='text-[20px] sm:text-[22px] xl:text-[28px] leading-tight font-extrabold text-navy mt-3 sm:mt-4 break-words'>
        {value}
      </div>
      {hint && (
        <div className='text-[12px] text-muted font-semibold mt-2'>{hint}</div>
      )}
    </>
  )
  const base =
    'text-left min-w-0 bg-white border border-line rounded-2xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(20,24,31,0.04)]'
  return onClick ? (
    <button
      type='button'
      onClick={onClick}
      className={`${base} transition-all hover:-translate-y-0.5 hover:border-forest/40 hover:shadow-md`}
    >
      {inner}
    </button>
  ) : (
    <div className={base}>{inner}</div>
  )
}

/* ------------------------------------------------------------------ */
/* Toasts                                                               */
/* ------------------------------------------------------------------ */
interface ToastItem {
  id: number
  kind: 'success' | 'error'
  text: string
}

const ToastContext = createContext<{
  success: (text: string) => void
  error: (text: string) => void
} | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const push = useCallback((kind: ToastItem['kind'], text: string) => {
    const id = nextId.current++
    setItems((prev) => [...prev, { id, kind, text }])
    window.setTimeout(
      () => setItems((prev) => prev.filter((t) => t.id !== id)),
      kind === 'error' ? 6000 : 3500,
    )
  }, [])

  const api = useMemo(
    () => ({
      success: (text: string) => push('success', text),
      error: (text: string) => push('error', text),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live='polite'
        className='fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 items-end pointer-events-none'
      >
        {items.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex items-center gap-2.5 pl-3.5 pr-4 py-3 rounded-xl text-[13px] font-bold shadow-lg border max-w-[360px] ${
              t.kind === 'error'
                ? 'bg-white border-[#C0392B]/30 text-[#C0392B]'
                : 'bg-navy border-navy text-white'
            }`}
            style={{ animation: 'slideDown 0.25s ease-out' }}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                t.kind === 'error' ? 'bg-[#FBEAE8]' : 'bg-forest'
              }`}
            >
              <Icon name={t.kind === 'error' ? 'alert' : 'check'} size={11} />
            </span>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
