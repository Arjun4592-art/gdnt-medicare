import Link from 'next/link'
import { Suspense } from 'react'
import { getProducts } from '@/lib/data'
import ShopFilters from '@/components/ShopFilters'
import Reveal from '@/components/Reveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All Products | GDNT Medicare Pvt. Ltd.',
  description:
    "Browse GDNT Medicare's full catalog of pharmaceutical products across tablets, syrups, injectables, and wellness ranges.",
}

export default async function ShopPage() {
  const products = await getProducts()
  return (
    <>
      <div className='max-w-[1240px] mx-auto px-8 py-5 text-[13px] text-muted'>
        <Link href='/' className='hover:text-forest'>
          Home
        </Link>
        <span className='mx-1.5'>/</span>Shop
      </div>

      <section className='pt-3 pb-24'>
        {products.length === 0 ? (
          <div className='max-w-[1240px] mx-auto px-8'>
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
        <div className='max-w-[1240px] mx-auto px-8'>
          <Reveal>
            <div className='bg-gradient-to-br from-forest to-forest-dark rounded-3xl px-6 md:px-16 py-16 text-center text-white'>
              <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-[#CDEFDD] font-bold mb-4'>
                <span className='w-1.5 h-1.5 rounded-full bg-white' />{' '}
                Can&apos;t Find What You Need?
              </div>
              <h2 className='text-3xl md:text-[38px] font-extrabold mb-3.5'>
                Ask us for a custom quote
              </h2>
              <p className='text-white/75 max-w-[460px] mx-auto mb-8 text-[15px]'>
                Tell us your requirement and we&apos;ll get back with
                availability and trade pricing.
              </p>
              <Link
                href='/contact'
                className='inline-block bg-white text-forest px-8 py-[15px] rounded-lg font-extrabold text-sm transition-transform hover:-translate-y-0.5'
              >
                Send an Enquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
