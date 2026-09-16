import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { IconBadge } from '@/components/IconBadge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about GDNT Medicare Pvt. Ltd. — a GMP-certified ethical pharmaceutical company based in Meerut, Uttar Pradesh, trusted by doctors and medical stores.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About GDNT Medicare Pvt. Ltd. | Ethical Pharmaceutical Company',
    description:
      'A GMP-certified ethical pharmaceutical company based in Meerut, Uttar Pradesh, trusted by doctors and medical stores.',
    url: 'https://gdntmedicare.com/about',
    type: 'website',
  },
}

const VALUES = [
  {
    t: 'Genuine, Always',
    d: 'Every batch is verified and traceable back to the manufacturer.',
    icon: (
      <>
        <path
          d='M12 3l8 3.5v5c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-5L12 3z'
          strokeLinejoin='round'
        />
        <path d='M9 12l2 2 4-4' />
      </>
    ),
  },
  {
    t: 'Ethical Practices',
    d: 'An ethical pharmaceutical company — licensed operations meeting all trade regulations, with no consumer-facing promotion.',
    icon: (
      <>
        <path d='M7 3h7l4 4v14H7z' strokeLinejoin='round' />
        <path d='M14 3v4h4' strokeLinejoin='round' />
        <path d='M9.5 13.2l1.8 1.8L15 11' />
      </>
    ),
  },
  {
    t: 'Transparent Pricing',
    d: 'No hidden costs — clear trade rates communicated upfront.',
    icon: (
      <>
        <path d='M12 4v16M8 8h5.5a2.5 2.5 0 010 5H9a2.5 2.5 0 000 5H16' />
      </>
    ),
  },
  {
    t: 'Reliable Supply',
    d: 'Consistent stock availability and dependable dispatch timelines.',
    icon: (
      <>
        <rect
          x='3'
          y='7'
          width='12'
          height='10'
          rx='2'
          strokeLinejoin='round'
        />
        <path d='M15 10.5h3.5l2.5 3.5V17h-6' strokeLinejoin='round' />
        <circle cx='8' cy='18' r='1.6' />
        <circle cx='17.5' cy='18' r='1.6' />
      </>
    ),
  },
]

export default function AboutPage() {
  return (
    <>
      <div className='max-w-[1240px] mx-auto px-5 sm:px-8 py-5 text-[13px] text-muted'>
        <Link href='/' className='hover:text-forest transition-colors'>
          Home
        </Link>
        <span className='mx-1.5'>/</span>
        <span className='text-navy font-semibold'>About Us</span>
      </div>

      {/* HERO / STORY */}
      <section className='relative pt-4 pb-24 overflow-hidden'>
        <div className='pointer-events-none absolute -top-20 -left-32 w-[420px] h-[420px] rounded-full bg-forest/[0.06] blur-[110px]' />
        <div className='pointer-events-none absolute top-40 right-0 w-[360px] h-[360px] rounded-full bg-gold/[0.08] blur-[100px]' />

        <div className='relative max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center'>
          <Reveal>
            <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-5 bg-white/80 backdrop-blur border border-forest/15 px-3.5 py-1.5 rounded-full shadow-[0_6px_16px_-8px_rgba(15,110,78,0.25)] w-fit'>
              <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse' />{' '}
              An Ethical Pharmaceutical Company
            </div>
            <h1 className='text-3xl md:text-[46px] font-extrabold text-navy leading-[1.1] tracking-tight'>
              Expert care for a{' '}
              <span className='relative inline-block'>
                <span className='relative z-10 bg-gradient-to-r from-forest via-emerald-600 to-forest bg-clip-text text-transparent'>
                  healthier
                </span>
                <svg
                  className='absolute -bottom-1 left-0 w-full'
                  height='8'
                  viewBox='0 0 200 8'
                  preserveAspectRatio='none'
                  fill='none'
                >
                  <path
                    d='M1 6c40-5 130-5 198-1'
                    stroke='#C79A48'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                  />
                </svg>
              </span>{' '}
              tomorrow
            </h1>
            <p className='mt-6 text-base text-muted leading-relaxed'>
              GDNT Medicare Pvt. Ltd. is an ethical pharmaceutical company
              founded with one purpose — to make genuine, quality-assured
              medicines easily accessible to the doctors and medical stores who
              depend on them. As an ethical pharma company, we work directly
              with certified manufacturers and maintain strict quality checks at
              every stage, from sourcing to dispatch — with no consumer
              advertising, only trade through medical professionals.
            </p>
            <p className='mt-4 text-base text-muted leading-relaxed'>
              Today, we supply a growing catalog of formulations across cardiac,
              diabetes, respiratory, wellness, and general care categories —
              trusted by clinics and pharmacies across the region.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className='relative h-[420px] rounded-[24px] overflow-hidden bg-gradient-to-br from-forest via-forest to-forest-dark flex items-center justify-center shadow-[0_40px_80px_-30px_rgba(11,79,56,0.5)] ring-1 ring-white/10'>
              {/* dotted texture */}
              <svg
                className='absolute inset-0 w-full h-full opacity-[0.12]'
                xmlns='http://www.w3.org/2000/svg'
              >
                <defs>
                  <pattern
                    id='about-dots'
                    width='22'
                    height='22'
                    patternUnits='userSpaceOnUse'
                  >
                    <circle cx='1.5' cy='1.5' r='1.5' fill='#fff' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#about-dots)' />
              </svg>
              <div className='absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold/20 blur-[70px]' />
              <div className='absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-emerald-300/10 blur-[80px]' />

              <svg
                viewBox='0 0 200 200'
                fill='none'
                className='relative w-[42%] opacity-95'
              >
                <circle
                  cx='100'
                  cy='100'
                  r='80'
                  stroke='url(#about-ring)'
                  strokeWidth='1'
                  strokeDasharray='2 6'
                  opacity='0.6'
                />
                <defs>
                  <linearGradient
                    id='about-ring'
                    x1='0'
                    y1='0'
                    x2='200'
                    y2='200'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#fff' stopOpacity='0.6' />
                    <stop offset='1' stopColor='#fff' stopOpacity='0' />
                  </linearGradient>
                </defs>
                <path
                  d='M100 30c-30 0-50 22-50 50 0 36 50 66 50 66s50-30 50-66c0-28-20-50-50-50z'
                  fill='#fff'
                  fillOpacity='0.1'
                  stroke='#fff'
                  strokeWidth='2'
                />
                <path
                  d='M100 65v40M80 85h40'
                  stroke='#C79A48'
                  strokeWidth='3.5'
                  strokeLinecap='round'
                />
              </svg>

              <div
                className='animate-float absolute top-[12%] left-[8%] bg-white/95 backdrop-blur px-4 py-3 rounded-xl flex gap-2.5 items-center ring-1 ring-black/5'
                style={{ boxShadow: '0 20px 44px -16px rgba(20,24,31,0.28)' }}
              >
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-forest-pale to-white flex items-center justify-center shrink-0 ring-1 ring-forest/10'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M12 3l8 3.5v5c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-5L12 3z'
                      stroke='#0F6E4E'
                      strokeWidth='1.8'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='text-xs font-bold text-navy'>Since 2014</div>
              </div>

              <div
                className='animate-float absolute bottom-[14%] right-[8%] bg-white/95 backdrop-blur px-4 py-3 rounded-xl flex gap-2.5 items-center ring-1 ring-black/5'
                style={{
                  animationDelay: '1.2s',
                  boxShadow: '0 20px 44px -16px rgba(20,24,31,0.28)',
                }}
              >
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-gold/25 to-white flex items-center justify-center shrink-0 ring-1 ring-gold/20'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M9 12l2 2 4-4'
                      stroke='#0F6E4E'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <circle
                      cx='12'
                      cy='12'
                      r='9'
                      stroke='#0F6E4E'
                      strokeWidth='1.6'
                    />
                  </svg>
                </div>
                <div className='text-xs font-bold text-navy'>ISO Certified</div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className='relative max-w-[1240px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-5 mt-16'>
          {[
            ['500+', 'Pharmacy Partners'],
            ['80+', 'Formulations'],
            ['GMP', 'Certified Facility'],
            ['24hr', 'Response Time'],
          ].map(([num, lbl], i) => (
            <Reveal key={lbl} delay={i * 80}>
              <div
                className='group relative text-center py-9 px-4 bg-white rounded-2xl border border-line/70 overflow-hidden transition-all duration-300 hover:-translate-y-2'
                style={{ boxShadow: '0 4px 14px -8px rgba(20,24,31,0.08)' }}
              >
                <span className='absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-forest to-gold scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300' />
                <div className='text-[34px] font-extrabold bg-gradient-to-br from-forest to-forest-dark bg-clip-text text-transparent'>
                  {num}
                </div>
                <div className='text-[12.5px] text-muted mt-1.5 font-semibold'>
                  {lbl}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className='relative py-24 overflow-hidden bg-gradient-to-b from-bg-soft via-bg-soft to-forest-pale/40'>
        <svg
          className='pointer-events-none absolute inset-0 w-full h-full opacity-[0.35]'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <pattern
              id='values-dots'
              width='26'
              height='26'
              patternUnits='userSpaceOnUse'
            >
              <circle
                cx='1.4'
                cy='1.4'
                r='1.4'
                fill='#0F6E4E'
                fillOpacity='0.08'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#values-dots)' />
        </svg>
        <div className='pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full bg-forest/[0.06] blur-[100px]' />

        <div className='relative max-w-[1240px] mx-auto px-5 sm:px-8'>
          <Reveal className='max-w-[620px] mx-auto mb-14 text-center'>
            <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4 justify-center bg-white/80 backdrop-blur border border-forest/15 px-3.5 py-1.5 rounded-full shadow-[0_6px_16px_-8px_rgba(15,110,78,0.25)]'>
              <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse' />{' '}
              Our Values
            </div>
            <h2 className='text-3xl md:text-4xl font-extrabold text-navy leading-tight'>
              What guides how we{' '}
              <span className='relative inline-block'>
                <span className='relative z-10 bg-gradient-to-r from-forest via-emerald-600 to-forest bg-clip-text text-transparent'>
                  work
                </span>
                <svg
                  className='absolute -bottom-1 left-0 w-full'
                  height='8'
                  viewBox='0 0 100 8'
                  preserveAspectRatio='none'
                  fill='none'
                >
                  <path
                    d='M1 6c20-5 60-5 98-1'
                    stroke='#C79A48'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
            </h2>
          </Reveal>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <div
                  className='group relative h-full bg-white border border-line/70 rounded-2xl px-6 py-9 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1.5'
                  style={{ boxShadow: '0 4px 14px -8px rgba(20,24,31,0.08)' }}
                >
                  <span className='absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-gradient-to-r from-transparent via-forest/60 to-transparent scale-x-0 group-hover:scale-x-150 transition-transform duration-300' />
                  <div className='mx-auto mb-5 w-fit relative'>
                    <div className='absolute inset-0 rounded-full bg-forest/20 blur-md scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    <IconBadge from='#14A876' to='#0B4F38'>
                      {v.icon}
                    </IconBadge>
                  </div>
                  <h4 className='text-base font-extrabold mb-2.5 text-navy'>
                    {v.t}
                  </h4>
                  <p className='text-[13px] text-muted leading-relaxed'>
                    {v.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-24'>
        <div className='max-w-[1240px] mx-auto px-5 sm:px-8'>
          <Reveal>
            <div className='relative rounded-[28px] px-6 md:px-16 py-18 text-center text-white overflow-hidden bg-gradient-to-br from-forest via-forest to-forest-dark shadow-[0_50px_90px_-30px_rgba(11,79,56,0.5)]'>
              <svg
                className='pointer-events-none absolute inset-0 w-full h-full opacity-[0.1]'
                xmlns='http://www.w3.org/2000/svg'
              >
                <defs>
                  <pattern
                    id='about-cta-dots'
                    width='24'
                    height='24'
                    patternUnits='userSpaceOnUse'
                  >
                    <circle cx='1.5' cy='1.5' r='1.5' fill='#fff' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#about-cta-dots)' />
              </svg>
              <div className='pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full bg-gold/20 blur-[90px]' />
              <div className='pointer-events-none absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-emerald-300/10 blur-[100px]' />

              <div className='relative'>
                <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-[#CDEFDD] font-bold mb-5 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse' />{' '}
                  Partner With Us
                </div>
                <h2 className='text-3xl md:text-[42px] font-extrabold mb-4 leading-tight'>
                  Let&apos;s work{' '}
                  <span className='relative inline-block'>
                    <span className='relative z-10 bg-gradient-to-r from-gold via-[#F0D9A0] to-gold bg-clip-text text-transparent'>
                      together
                    </span>
                    <svg
                      className='absolute -bottom-1 left-0 w-full'
                      height='8'
                      viewBox='0 0 160 8'
                      preserveAspectRatio='none'
                      fill='none'
                    >
                      <path
                        d='M1 6c30-5 100-5 158-1'
                        stroke='#C79A48'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                      />
                    </svg>
                  </span>
                </h2>
                <p className='text-white/75 max-w-[460px] mx-auto mb-9 text-[15px] leading-relaxed'>
                  Reach out to discuss stocking our range at your clinic or
                  pharmacy.
                </p>
                <Link
                  href='/contact'
                  className='group inline-flex items-center gap-2 bg-white text-forest px-8 py-[15px] rounded-xl font-extrabold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-14px_rgba(0,0,0,0.35)]'
                >
                  Contact Our Team
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 16 16'
                    fill='none'
                    className='transition-transform group-hover:translate-x-1'
                  >
                    <path
                      d='M2 8h11M9 4l4 4-4 4'
                      stroke='#0F6E4E'
                      strokeWidth='1.8'
                      strokeLinecap='round'
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
