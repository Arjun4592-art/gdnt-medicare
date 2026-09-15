import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductByIdAsync, getRelatedProductsAsync } from '@/lib/data'
import { getDiscountPercent } from '@/lib/products'
import ProductGallery from '@/components/ProductGallery'
import ProductCard from '@/components/ProductCard'
import ProductTabs from '@/components/ProductTabs'
import Stars from '@/components/Stars'
import Reveal from '@/components/Reveal'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProductByIdAsync(id)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | GDNT Medicare Pvt. Ltd.`,
    description: `${product.salt} — ${product.desc}. Available in ${product.pack} packs.`,
  }
}

const TRUST_BADGES = [
  {
    label: '100% Genuine',
    icon: (
      <path
        d='M12 21s-7.5-4.6-10-9.2C.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.4C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.8C19.5 16.4 12 21 12 21z'
        stroke='#0F6E4E'
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
    ),
  },
  {
    label: 'GMP Certified',
    icon: (
      <path
        d='M12 3l8 3.5v5c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-5L12 3z'
        stroke='#0F6E4E'
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
    ),
  },
  {
    label: 'Secure Payment',
    icon: (
      <>
        <rect
          x='4'
          y='10'
          width='16'
          height='10'
          rx='2'
          stroke='#0F6E4E'
          strokeWidth='1.8'
        />
        <path
          d='M7.5 10V7a4.5 4.5 0 019 0v3'
          stroke='#0F6E4E'
          strokeWidth='1.8'
          strokeLinecap='round'
        />
      </>
    ),
  },
]

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductByIdAsync(id)
  if (!product) notFound()

  const related = await getRelatedProductsAsync(product)
  const discount = getDiscountPercent(product.price, product.mrp)

  const specs: [string, string][] = [
    ['Composition', product.salt],
    ['Form', product.type],
    ['Pack Size', product.pack],
    ['Category', product.cat],
    ['Storage', 'Store below 30°C, protect from light'],
  ]

  return (
    <>
      <div className='max-w-[1240px] mx-auto px-5 sm:px-8 py-5 text-[13px] text-muted overflow-x-auto whitespace-nowrap'>
        <Link href='/' className='hover:text-forest'>
          Home
        </Link>
        <span className='mx-1.5'>/</span>
        <Link href='/shop' className='hover:text-forest'>
          Shop
        </Link>
        <span className='mx-1.5'>/</span>
        <span className='text-navy font-semibold'>{product.name}</span>
      </div>

      <section className='pt-2 sm:pt-4'>
        <div className='max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start'>
          <Reveal>
            <ProductGallery
              images={product.images}
              icon={product.icon}
              name={product.name}
            />
          </Reveal>

          <Reveal delay={100}>
            <div>
              <div className='flex items-center justify-between gap-3 flex-wrap'>
                <span className='inline-flex items-center text-[11px] font-extrabold text-gold uppercase tracking-wide bg-gold/10 px-3 py-1.5 rounded-full'>
                  {product.type} · {product.pack}
                </span>
                <span
                  className='text-[11px] font-bold px-3 py-1.5 rounded-full'
                  style={{
                    color: product.stock === 'In Stock' ? '#0F6E4E' : '#C79A48',
                    background:
                      product.stock === 'In Stock' ? '#EAF6EF' : '#FDF3E3',
                  }}
                >
                  {product.stock}
                </span>
              </div>

              <h1 className='text-[24px] sm:text-[30px] font-extrabold text-navy mt-3 leading-tight'>
                {product.name}
              </h1>
              <div className='text-[13.5px] sm:text-sm text-muted mt-1.5'>
                {product.salt}
              </div>

              {product.rating > 0 && (
                <Stars rating={product.rating} reviews={product.reviews} />
              )}

              <div className='mt-5 py-5 border-t border-b border-line'>
                <div className='flex items-center gap-2.5 flex-wrap'>
                  <div className='text-[26px] sm:text-[28px] font-extrabold text-navy'>
                    ₹{product.price}
                  </div>
                  {discount > 0 && (
                    <span className='text-[11px] font-extrabold text-white bg-gradient-to-r from-gold to-[#B07F2A] px-2.5 py-1 rounded-full shadow-[0_4px_10px_-4px_rgba(199,154,72,0.5)]'>
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div className='text-xs text-muted mt-1'>
                  MRP <span className='line-through'>₹{product.mrp}</span> ·
                  Trade price on request
                </div>
              </div>

              <div className='mt-6'>
                {specs.map(([k, v]) => (
                  <div
                    key={k}
                    className='flex justify-between gap-4 py-3 border-b border-line/70 text-[13px] sm:text-[13.5px]'
                  >
                    <span className='text-muted font-semibold'>{k}</span>
                    <span className='text-navy font-bold text-right'>{v}</span>
                  </div>
                ))}
              </div>

              <div className='flex flex-col gap-3 mt-7'>
                <Link
                  href='/contact'
                  className='w-full sm:w-auto bg-forest text-white px-8 py-4 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgba(15,110,78,0.55)]'
                >
                  <svg width='15' height='15' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M4 4h16v12H8l-4 4V4z'
                      stroke='#fff'
                      strokeWidth='1.6'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Send Enquiry
                </Link>
                <div className='flex gap-3'>
                  <a
                    href='https://wa.me/919876543210'
                    className='flex-1 border-[1.5px] border-line px-4 sm:px-8 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors hover:border-forest hover:text-forest'
                  >
                    <svg width='15' height='15' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M12 3a9 9 0 00-7.8 13.5L3 21l4.7-1.2A9 9 0 1012 3z'
                        stroke='#0F6E4E'
                        strokeWidth='1.6'
                        strokeLinejoin='round'
                      />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href='tel:+919876543210'
                    className='flex-1 border-[1.5px] border-line px-4 sm:px-8 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors hover:border-forest hover:text-forest'
                  >
                    <svg width='15' height='15' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M4.5 4h4l1.5 4.5-2.3 1.4a11 11 0 005.4 5.4l1.4-2.3 4.5 1.5v4a1.5 1.5 0 01-1.6 1.5A15.5 15.5 0 013 5.6 1.5 1.5 0 014.5 4z'
                        stroke='#0F6E4E'
                        strokeWidth='1.6'
                        strokeLinejoin='round'
                      />
                    </svg>
                    Call Now
                  </a>
                </div>
              </div>

              <div className='flex flex-wrap gap-2.5 mt-6'>
                {TRUST_BADGES.map((b) => (
                  <div
                    key={b.label}
                    className='flex items-center gap-2 text-[12px] font-semibold text-navy bg-bg-soft border border-line/80 rounded-full pl-2 pr-3.5 py-1.5'
                  >
                    <span className='w-6 h-6 rounded-full bg-forest-pale flex items-center justify-center shrink-0'>
                      <svg
                        className='w-3.5 h-3.5'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        {b.icon}
                      </svg>
                    </span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className='py-14 sm:py-16'>
        <div className='max-w-[1240px] mx-auto px-5 sm:px-8'>
          <ProductTabs product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className='pb-20 sm:pb-24'>
          <div className='max-w-[1240px] mx-auto px-5 sm:px-8'>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-navy mb-8 sm:mb-10'>
              Related Products
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6'>
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
