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

const wrap = 'max-w-[1240px] mx-auto px-5 sm:px-8'

export default async function ShopPage() {
  const products = await getProducts()
  return (
    <>
      <div className='border-b border-line bg-bg-soft'>
        <div className={`${wrap} pt-3.5 pb-8`}>
          <div className='text-[13px] text-muted'>
            <Link href='/' className='hover:text-forest transition-colors'>
              Home
            </Link>
            <span className='mx-2'>/</span>
            <span className='text-navy font-semibold'>Shop</span>
          </div>
          <h1 className='animate-rise mt-5 text-[30px] md:text-[40px] font-semibold text-navy leading-tight'>
            Product catalog
          </h1>
          <p className='animate-rise [animation-delay:120ms] mt-2 text-[15px] text-muted max-w-2xl leading-relaxed'>
            Ethical pharmaceutical products — tablets, syrups, capsules and
            ointments — supplied to doctors and medical stores across India.
            Enquire for trade pricing.
          </p>
        </div>
      </div>

      <section className='py-10 pb-20'>
        {products.length === 0 ? (
          <div className={wrap}>
            <div className='text-center py-16 text-muted text-sm bg-bg-soft rounded-md border border-line'>
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

      <section className='pb-16 md:pb-24'>
        <div className={wrap}>
          <Reveal variant='scale'>
            <div className='rounded-md bg-forest-dark text-white px-7 md:px-14 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-7'>
              <div>
                <h2 className='text-[28px] md:text-[34px] font-semibold leading-tight'>
                  Can&apos;t find what you need?
                </h2>
                <p className='mt-2.5 text-white/80 text-[15.5px] max-w-[480px]'>
                  Tell us your requirement and we&apos;ll get back with
                  availability and trade pricing.
                </p>
              </div>
              <div className='flex flex-wrap gap-3 shrink-0'>
                <Link
                  href='/contact'
                  className='inline-flex items-center bg-white text-forest-dark px-7 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-forest-pale'
                >
                  Send an enquiry
                </Link>
                <a
                  href='https://wa.me/918679884419'
                  className='inline-flex items-center border border-white/40 text-white px-7 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-white/10'
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
