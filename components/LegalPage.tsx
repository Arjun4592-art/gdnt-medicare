import Link from 'next/link'
import type { ReactNode } from 'react'

export type LegalSection = {
  title: string
  body: ReactNode
}

const wrap = 'max-w-[1240px] mx-auto px-5 sm:px-8'

export const LEGAL_LINKS = [
  { href: '/drug-license', label: 'Drug License Info' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-trade', label: 'Terms of Trade' },
]

export default function LegalPage({
  title,
  intro,
  updated,
  current,
  sections,
}: {
  title: string
  intro: string
  updated: string
  current: string
  sections: LegalSection[]
}) {
  return (
    <>
      <div className='border-b border-line bg-bg-soft'>
        <div className={`${wrap} pt-3.5 pb-8`}>
          <div className='text-[13px] text-muted'>
            <Link href='/' className='hover:text-forest transition-colors'>
              Home
            </Link>
            <span className='mx-2'>/</span>
            <span className='text-navy font-semibold'>{title}</span>
          </div>
          <h1 className='animate-rise mt-5 text-[30px] md:text-[40px] font-semibold text-navy leading-tight'>
            {title}
          </h1>
          <p className='animate-rise [animation-delay:120ms] mt-2 text-[15px] text-muted max-w-2xl leading-relaxed'>
            {intro}
          </p>
          <p className='mt-3 text-[12.5px] text-muted'>
            Last updated: {updated}
          </p>
        </div>
      </div>

      <section className='py-10 lg:py-14'>
        <div
          className={`${wrap} grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-16 items-start`}
        >
          <nav
            aria-label='Legal pages'
            className='lg:sticky lg:top-24 flex lg:flex-col gap-2 overflow-x-auto whitespace-nowrap'
          >
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={l.label === current ? 'page' : undefined}
                className={`px-4 py-2.5 rounded-md text-[13.5px] font-semibold border transition-colors ${
                  l.label === current
                    ? 'bg-forest text-white border-forest'
                    : 'border-line text-navy hover:border-forest hover:text-forest'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className='max-w-3xl space-y-9'>
            {sections.map((s, i) => (
              <div key={s.title}>
                <h2 className='text-[19px] sm:text-[21px] font-semibold text-navy'>
                  {i + 1}. {s.title}
                </h2>
                <div className='mt-2.5 text-[15px] text-muted leading-relaxed space-y-3'>
                  {s.body}
                </div>
              </div>
            ))}

            <div className='border-t border-line pt-6 text-[14px] text-muted'>
              Questions about this page? Write to{' '}
              <a
                href='mailto:orders@gdntmedicare.com'
                className='text-forest font-semibold hover:underline'
              >
                orders@gdntmedicare.com
              </a>{' '}
              or call{' '}
              <a
                href='tel:+918679884419'
                className='text-forest font-semibold hover:underline'
              >
                +91 86798 84419
              </a>
              .
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
