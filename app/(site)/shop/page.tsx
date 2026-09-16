import Link from 'next/link'
import { Suspense } from 'react'
import { getProducts } from '@/lib/data'
import ShopFilters from '@/components/ShopFilters'
import Reveal from '@/components/Reveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All Ethical Pharmaceutical Products',
  description:
    "Browse GDNT Medicare's full catalog of ethical pharmaceutical products across tablets, syrups, capsules, and ointments — supplied to doctors and medical stores across India.",
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop All Ethical Pharmaceutical Products | GDNT Medicare Pvt. Ltd.',
    description:
      "Browse GDNT Medicare's full catalog of ethical pharmaceutical products across tablets, syrups, capsules, and ointments.",
    url: 'https://gdntmedicare.com/shop',
    type: 'website',
  },
}

export default async function ShopPage() {
  const products = await getProducts()
  return (
    <>
      <div className='max-w-[1240px] mx-auto px-5 sm:px-8 py-5 text-[13px] text-muted'>
        <Link href='/' className='hover:text-forest'>
          Home
        </Link>
        <span className='mx-1.5'>/</span>Shop
      </div>

      <div className='max-w-[1240px] mx-auto px-5 sm:px-8'>
        <h1 className='text-2xl md:text-[32px] font-extrabold text-navy leading-tight mb-1'>
          Shop All Ethical Pharmaceutical Products
        </h1>
        <p className='text-[13px] text-muted mb-4 max-w-2xl'>
          Browse GDNT Medicare&apos;s full catalog of ethical pharmaceutical
          products — tablets, syrups, capsules, and ointments — supplied to
          doctors and medical stores across India.
        </p>
      </div>

      <section className='pt-3 pb-24'>
        {products.length === 0 ? (
          <div className='max-w-[1240px] mx-auto px-5 sm:px-8'>
            <div className='text-center py-16 text-muted text-sm bg-bg-soft rounded-2xl border border-line'>
              No products available yet. Check back soon, or if you&apos;re the
              admin,{' '}
              <Link href='/admin' className='text-forest font-bold underline'>
                add products here
              </Link>
              .
            </div>
          </div>
        ) : (
          <Suspense fallback={null}>
            <ShopFilters products={products} />
          </Suspense>
        )}
      </section>

      <section className='pb-24'>
        <div className='max-w-[1240px] mx-auto px-5 sm:px-8'>
          <Reveal>
            <div className='relative rounded-[28px] px-6 md:px-16 py-18 text-center text-white overflow-hidden bg-gradient-to-br from-forest via-forest to-forest-dark shadow-[0_50px_90px_-30px_rgba(11,79,56,0.5)]'>
              {/* dotted texture */}
              <svg
                className='pointer-events-none absolute inset-0 w-full h-full opacity-[0.1]'
                xmlns='http://www.w3.org/2000/svg'
              >
                <defs>
                  <pattern
                    id='shop-cta-dots'
                    width='24'
                    height='24'
                    patternUnits='userSpaceOnUse'
                  >
                    <circle cx='1.5' cy='1.5' r='1.5' fill='#fff' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#shop-cta-dots)' />
              </svg>
              {/* glow blobs */}
              <div className='pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full bg-gold/20 blur-[90px]' />
              <div className='pointer-events-none absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-emerald-300/10 blur-[100px]' />
              {/* decorative ring */}
              <svg
                className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-[0.08]'
                viewBox='0 0 520 520'
                fill='none'
              >
                <circle
                  cx='260'
                  cy='260'
                  r='200'
                  stroke='#fff'
                  strokeWidth='1'
                  strokeDasharray='3 9'
                />
              </svg>

              <div className='relative'>
                <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-[#CDEFDD] font-bold mb-5 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse' />{' '}
                  Can&apos;t Find What You Need?
                </div>
                <h2 className='text-3xl md:text-[42px] font-extrabold mb-4 leading-tight'>
                  Ask us for a{' '}
                  <span className='relative inline-block'>
                    <span className='relative z-10 bg-gradient-to-r from-gold via-[#F0D9A0] to-gold bg-clip-text text-transparent'>
                      custom quote
                    </span>
                    <svg
                      className='absolute -bottom-1 left-0 w-full'
                      height='8'
                      viewBox='0 0 260 8'
                      preserveAspectRatio='none'
                      fill='none'
                    >
                      <path
                        d='M1 6c40-5 180-5 258-1'
                        stroke='#C79A48'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                      />
                    </svg>
                  </span>
                </h2>
                <p className='text-white/75 max-w-[460px] mx-auto mb-9 text-[15px] leading-relaxed'>
                  Tell us your requirement and we&apos;ll get back with
                  availability and trade pricing.
                </p>
                <div className='flex flex-wrap gap-3.5 justify-center'>
                  <Link
                    href='/contact'
                    className='group bg-white text-forest px-8 py-[15px] rounded-xl font-extrabold text-sm inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-14px_rgba(0,0,0,0.35)]'
                  >
                    Send an Enquiry
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
                  <a
                    href='https://wa.me/919876543210'
                    className='bg-white/5 backdrop-blur border-[1.5px] border-white/30 text-white px-8 py-[15px] rounded-xl font-extrabold text-sm inline-flex items-center gap-2 transition-all hover:bg-white/15 hover:border-white/60'
                  >
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.06L2 22l5.06-1.32A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.2-1.77 1.24-.45.05-.9.07-1.45-.09-.34-.1-.77-.24-1.32-.48-2.33-1-3.85-3.36-3.97-3.52-.12-.16-.95-1.26-.95-2.4s.6-1.7.81-1.93c.22-.23.48-.29.64-.29.16 0 .32 0 .46.01.15.01.35-.06.55.42.2.5.68 1.71.74 1.83.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.11.49.14.24.6 1 1.29 1.62.89.79 1.63 1.04 1.87 1.16.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.16 1.2z' />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
