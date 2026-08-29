import Link from 'next/link'
import { getProducts } from '@/lib/data'
import ProductCard from '@/components/ProductCard'
import Reveal from '@/components/Reveal'
import { IconBadge } from '@/components/IconBadge'

const CATEGORY_TILES = [
  {
    label: 'Tablets & Capsules',
    count: '32 items',
    bg: '#FDEDEC',
    stroke: '#C0392B',
    fill: true,
    icon: (
      <>
        <rect
          x='3'
          y='9.2'
          width='18'
          height='7.4'
          rx='3.7'
          fill='#C0392B'
          fillOpacity='0.12'
        />
        <path
          d='M12 9.2h5.3a3.7 3.7 0 010 7.4H12z'
          fill='#C0392B'
          fillOpacity='0.9'
          stroke='none'
        />
        <rect x='3' y='9.2' width='18' height='7.4' rx='3.7' />
        <line x1='12' y1='9.2' x2='12' y2='16.6' />
        <circle cx='6.4' cy='12.9' r='0.9' fill='#C0392B' stroke='none' />
      </>
    ),
  },
  {
    label: 'Syrups & Liquids',
    count: '14 items',
    bg: '#EAF6EF',
    stroke: '#0F6E4E',
    fill: true,
    icon: (
      <>
        <path
          d='M9.6 3.2h4.8v3.6l3 4.6v8.4a1.8 1.8 0 01-1.8 1.8H8.4a1.8 1.8 0 01-1.8-1.8v-8.4l3-4.6z'
          strokeLinejoin='round'
        />
        <path
          d='M6.9 14.4h10.2v5.4a1.8 1.8 0 01-1.8 1.8H8.7a1.8 1.8 0 01-1.8-1.8z'
          fill='#0F6E4E'
          fillOpacity='0.85'
          stroke='none'
        />
        <rect
          x='9.2'
          y='1.7'
          width='5.6'
          height='2'
          rx='0.6'
          fill='#0F6E4E'
          stroke='none'
        />
      </>
    ),
  },
  {
    label: 'Injectables',
    count: '9 items',
    bg: '#EAF1FB',
    stroke: '#2E6FBE',
    fill: true,
    icon: (
      <>
        <path
          d='M19.5 3.5l-2.3 2.3M6.5 16.5l7-7 2.5 2.5-7 7-4 1.4 1.5-3.9z'
          strokeLinejoin='round'
          fill='#2E6FBE'
          fillOpacity='0.12'
        />
        <line x1='10.6' y1='7.6' x2='13.4' y2='10.4' strokeWidth='1.7' />
        <line x1='8.6' y1='9.6' x2='11.4' y2='12.4' strokeWidth='1.7' />
        <circle cx='5' cy='19' r='1.1' fill='#2E6FBE' stroke='none' />
      </>
    ),
  },
  {
    label: 'Ointments & Creams',
    count: '11 items',
    bg: '#FDF3E3',
    stroke: '#C79A48',
    fill: true,
    icon: (
      <>
        <rect
          x='6.5'
          y='4.5'
          width='11'
          height='16'
          rx='2.2'
          strokeLinejoin='round'
        />
        <path d='M9.5 4.5V2.7h5v1.8' />
        <rect
          x='7.7'
          y='9.5'
          width='8.6'
          height='8.2'
          rx='1'
          fill='#C79A48'
          fillOpacity='0.85'
          stroke='none'
        />
        <line
          x1='9.3'
          y1='12.2'
          x2='14.7'
          y2='12.2'
          stroke='white'
          strokeOpacity='0.9'
        />
        <line
          x1='9.3'
          y1='15'
          x2='13'
          y2='15'
          stroke='white'
          strokeOpacity='0.7'
        />
      </>
    ),
  },
  {
    label: 'Wellness & Supplements',
    count: '10 items',
    bg: '#F1EAFB',
    stroke: '#7B4FC9',
    fill: true,
    icon: (
      <>
        <path
          d='M12 20.5c-4.6-2-7.5-5.7-7.5-10.2a7.5 7.5 0 0115 0c0 4.5-2.9 8.2-7.5 10.2z'
          strokeLinejoin='round'
          fill='#7B4FC9'
          fillOpacity='0.12'
        />
        <path d='M12 15.5V7.8M9.1 10.7c1.4.95 4.4.95 5.8 0' strokeWidth='1.6' />
        <circle cx='12' cy='7.6' r='1.15' fill='#7B4FC9' stroke='none' />
      </>
    ),
  },
  {
    label: 'First Aid & Essentials',
    count: '6 items',
    bg: '#EAF6EF',
    stroke: '#0F6E4E',
    fill: true,
    icon: (
      <>
        <rect
          x='3'
          y='6.2'
          width='18'
          height='13.8'
          rx='3'
          strokeLinejoin='round'
        />
        <path d='M8.4 6.2V4.6a1.6 1.6 0 011.6-1.6h4a1.6 1.6 0 011.6 1.6v1.6' />
        <rect
          x='9.8'
          y='9.4'
          width='4.4'
          height='8'
          rx='1'
          fill='#0F6E4E'
          stroke='none'
        />
        <rect
          x='5.5'
          y='11.8'
          width='13'
          height='3.2'
          rx='1'
          fill='#0F6E4E'
          stroke='none'
        />
      </>
    ),
  },
]

const WHY_US = [
  {
    t: 'GMP-Certified Sourcing',
    d: 'Every batch is traceable and compliant with pharmaceutical standards.',
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
    t: 'Direct Trade Pricing',
    d: 'No hidden markups — transparent rates for bulk and retail orders.',
    icon: (
      <>
        <path d='M12 4v16M8 8h5.5a2.5 2.5 0 010 5H9a2.5 2.5 0 000 5H16' />
      </>
    ),
  },
  {
    t: 'Fast Regional Dispatch',
    d: 'Warehousing built for quick turnaround to clinics and pharmacies.',
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
  {
    t: 'Dedicated Support',
    d: 'Real people on WhatsApp, phone, and email for orders & queries.',
    icon: (
      <>
        <path
          d='M4 12a8 8 0 0116 0v5a2 2 0 01-2 2h-1v-6h3M4 17v-5h3v6H6a2 2 0 01-2-2z'
          strokeLinejoin='round'
        />
      </>
    ),
  },
]

export default async function Home() {
  const products = await getProducts()
  return (
    <>
      {/* HERO */}
      <section className='relative overflow-hidden pt-[70px] pb-10'>
        {/* photographic background, tinted to brand colors */}
        <div
          className='absolute inset-0 bg-cover bg-[position:70%_center]'
          style={{
            backgroundImage: "url('/hero-bg.png')",
            backgroundColor: '#0F6E4E',
            backgroundBlendMode: 'color-burn',
          }}
        />
        {/* brand-color wash for legibility + cohesion */}
        <div className='absolute inset-0 bg-gradient-to-r from-forest-pale via-forest-pale/85 to-white/40' />
        <div className='absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white' />
        {/* ambient glows */}
        <div className='pointer-events-none absolute -top-32 -left-40 w-[520px] h-[520px] rounded-full bg-forest/10 blur-[110px]' />
        <div className='pointer-events-none absolute top-10 right-0 w-[420px] h-[420px] rounded-full bg-gold/10 blur-[100px]' />

        <div className='relative z-10 max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center'>
          <div>
            <Reveal>
              <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-5 bg-white/80 backdrop-blur border border-forest/15 px-3.5 py-1.5 rounded-full shadow-[0_6px_16px_-8px_rgba(15,110,78,0.35)]'>
                <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse' />
                Healthier Today, Brighter Tomorrow
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className='text-[38px] md:text-[60px] font-extrabold leading-[1.08] text-navy tracking-tight'>
                Your Trusted <br />
                <span className='relative inline-block'>
                  <span className='relative z-10 bg-gradient-to-r from-forest via-forest to-emerald-600 bg-clip-text text-transparent'>
                    Pharmaceutical
                  </span>
                  <svg
                    className='absolute -bottom-1.5 left-0 w-full'
                    height='10'
                    viewBox='0 0 220 10'
                    preserveAspectRatio='none'
                    fill='none'
                  >
                    <path
                      d='M2 7c40-6 140-6 216-1'
                      stroke='#C79A48'
                      strokeWidth='3'
                      strokeLinecap='round'
                    />
                  </svg>
                </span>{' '}
                Partner
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className='mt-6 text-base text-muted leading-relaxed max-w-[460px]'>
                Quality medicines, genuine products. GDNT Medicare supplies
                doctors and medical stores with GMP-certified formulations —
                enquire directly, no middlemen.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className='flex flex-wrap gap-4 mt-9'>
                <Link
                  href='/shop'
                  className='group bg-gradient-to-br from-forest to-forest-dark text-white px-8 py-4 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-12px_rgba(15,110,78,0.55)]'
                >
                  Browse Catalog
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 16 16'
                    fill='none'
                    className='transition-transform group-hover:translate-x-1'
                  >
                    <path
                      d='M2 8h11M9 4l4 4-4 4'
                      stroke='#fff'
                      strokeWidth='1.6'
                      strokeLinecap='round'
                    />
                  </svg>
                </Link>
                <Link
                  href='/contact'
                  className='bg-white/70 backdrop-blur border-[1.5px] border-line px-8 py-[15px] rounded-xl font-bold text-sm transition-colors hover:border-forest hover:text-forest'
                >
                  Talk to Our Team
                </Link>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className='flex flex-wrap gap-3 mt-11'>
                <div className='flex items-center gap-2.5 text-[13px] font-semibold text-navy bg-white border border-line/80 rounded-full pl-2.5 pr-4 py-2 shadow-[0_8px_20px_-14px_rgba(20,24,31,0.3)]'>
                  <span className='w-7 h-7 rounded-full bg-forest-pale flex items-center justify-center shrink-0'>
                    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M12 21s-7.5-4.6-10-9.2C.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.4C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.8C19.5 16.4 12 21 12 21z'
                        stroke='#0F6E4E'
                        strokeWidth='1.8'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                  100% Genuine
                </div>
                <div className='flex items-center gap-2.5 text-[13px] font-semibold text-navy bg-white border border-line/80 rounded-full pl-2.5 pr-4 py-2 shadow-[0_8px_20px_-14px_rgba(20,24,31,0.3)]'>
                  <span className='w-7 h-7 rounded-full bg-forest-pale flex items-center justify-center shrink-0'>
                    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
                      <rect
                        x='3'
                        y='7'
                        width='14'
                        height='11'
                        rx='2'
                        stroke='#0F6E4E'
                        strokeWidth='1.8'
                      />
                      <path
                        d='M17 10h2.5l2 3v5H17'
                        stroke='#0F6E4E'
                        strokeWidth='1.8'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                  Fast Dispatch
                </div>
                <div className='flex items-center gap-2.5 text-[13px] font-semibold text-navy bg-white border border-line/80 rounded-full pl-2.5 pr-4 py-2 shadow-[0_8px_20px_-14px_rgba(20,24,31,0.3)]'>
                  <span className='w-7 h-7 rounded-full bg-forest-pale flex items-center justify-center shrink-0'>
                    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M12 3l8 3.5v5c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-5L12 3z'
                        stroke='#0F6E4E'
                        strokeWidth='1.8'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                  GMP Certified
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className='relative h-[460px] hidden lg:block'>
              {/* floating value badges, scattered over the background photo */}
              <div
                className='animate-float absolute top-[6%] right-[8%] bg-white/90 backdrop-blur px-4.5 py-3.5 rounded-xl flex gap-2.5 items-center ring-1 ring-black/5'
                style={{ boxShadow: '0 20px 44px -16px rgba(20,24,31,0.28)' }}
              >
                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-forest-pale to-white flex items-center justify-center shrink-0 ring-1 ring-forest/10'>
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
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
                <div>
                  <div className='text-xs font-bold text-navy'>
                    500+ Partners
                  </div>
                  <div className='text-[10px] text-muted'>
                    Doctors &amp; pharmacies
                  </div>
                </div>
              </div>

              <div
                className='animate-float absolute top-[38%] left-[2%] bg-white/90 backdrop-blur px-4.5 py-3.5 rounded-xl flex gap-2.5 items-center ring-1 ring-black/5'
                style={{
                  animationDelay: '0.8s',
                  boxShadow: '0 20px 44px -16px rgba(20,24,31,0.28)',
                }}
              >
                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-gold/25 to-white flex items-center justify-center shrink-0 ring-1 ring-gold/20'>
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                    <rect
                      x='4'
                      y='4'
                      width='16'
                      height='16'
                      rx='3'
                      stroke='#0F6E4E'
                      strokeWidth='1.6'
                    />
                    <path d='M4 9h16' stroke='#0F6E4E' strokeWidth='1.6' />
                  </svg>
                </div>
                <div>
                  <div className='text-xs font-bold text-navy'>
                    80+ Formulations
                  </div>
                  <div className='text-[10px] text-muted'>
                    Across 6 categories
                  </div>
                </div>
              </div>

              <div
                className='animate-float absolute bottom-[14%] right-[14%] bg-white/90 backdrop-blur px-4.5 py-3.5 rounded-xl flex gap-2.5 items-center ring-1 ring-black/5'
                style={{
                  animationDelay: '1.5s',
                  boxShadow: '0 20px 44px -16px rgba(20,24,31,0.28)',
                }}
              >
                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-forest-pale to-white flex items-center justify-center shrink-0 ring-1 ring-forest/10'>
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M12 3l8 3.5v5c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-5L12 3z'
                      stroke='#0F6E4E'
                      strokeWidth='1.8'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div>
                  <div className='text-xs font-bold text-navy'>
                    GMP Verified
                  </div>
                  <div className='text-[10px] text-muted'>
                    Every batch certified
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className='py-24'>
        <div className='max-w-[1240px] mx-auto px-8'>
          <Reveal className='max-w-[620px] mx-auto mb-14 text-center'>
            <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4'>
              <span className='w-1.5 h-1.5 rounded-full bg-gold' /> Shop by
              Category
            </div>
            <h2 className='text-3xl md:text-4xl font-extrabold text-navy leading-tight'>
              A catalog built for prescribers
            </h2>
            <p className='mt-3.5 text-muted text-[15px] leading-relaxed'>
              Six ranges covering the everyday needs of clinics, hospitals, and
              retail pharmacies.
            </p>
          </Reveal>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5'>
            {CATEGORY_TILES.map((c, i) => (
              <Reveal key={c.label} delay={i * 70}>
                <Link
                  href='/shop'
                  className='group relative block bg-white border border-line/70 rounded-2xl px-4 pt-8 pb-6 text-center overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-[var(--tile-shadow)]'
                  style={{
                    boxShadow: '0 4px 14px -8px rgba(20,24,31,0.08)',
                    ['--tile-shadow' as any]: `0 24px 40px -18px ${c.stroke}55`,
                  }}
                >
                  {/* top accent bar */}
                  <span
                    className='absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300'
                    style={{ background: c.stroke }}
                  />
                  <div
                    className='w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-3 ring-1'
                    style={{
                      background: c.bg,
                      boxShadow: `0 10px 20px -12px ${c.stroke}66`,
                      ['--tw-ring-color' as any]: `${c.stroke}22`,
                    }}
                  >
                    <svg
                      width='28'
                      height='28'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={c.stroke}
                      strokeWidth='1.6'
                      strokeLinecap='round'
                    >
                      {c.icon}
                    </svg>
                  </div>
                  <div className='text-[13.5px] font-bold text-navy leading-snug'>
                    {c.label}
                  </div>
                  <div
                    className='inline-flex items-center gap-1 text-[10.5px] font-bold mt-2.5 px-2.5 py-1 rounded-full transition-colors'
                    style={{ background: `${c.stroke}14`, color: c.stroke }}
                  >
                    {c.count}
                    <svg
                      width='10'
                      height='10'
                      viewBox='0 0 16 16'
                      fill='none'
                      className='transition-transform group-hover:translate-x-0.5'
                    >
                      <path
                        d='M2 8h11M9 4l4 4-4 4'
                        stroke={c.stroke}
                        strokeWidth='1.8'
                        strokeLinecap='round'
                      />
                    </svg>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className='relative py-24 overflow-hidden bg-gradient-to-b from-bg-soft via-bg-soft to-forest-pale/40'>
        {/* decorative texture */}
        <svg
          className='pointer-events-none absolute inset-0 w-full h-full opacity-[0.35]'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <pattern
              id='featured-dots'
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
          <rect width='100%' height='100%' fill='url(#featured-dots)' />
        </svg>
        <div className='pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full bg-forest/[0.06] blur-[100px]' />
        <div className='pointer-events-none absolute bottom-0 -right-24 w-[380px] h-[380px] rounded-full bg-gold/[0.08] blur-[90px]' />

        <div className='relative max-w-[1240px] mx-auto px-8'>
          <Reveal className='max-w-[620px] mx-auto mb-14 text-center'>
            <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4 bg-white/80 backdrop-blur border border-forest/15 px-3.5 py-1.5 rounded-full shadow-[0_6px_16px_-8px_rgba(15,110,78,0.25)]'>
              <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse' />{' '}
              Featured Products
            </div>
            <h2 className='text-3xl md:text-4xl font-extrabold text-navy leading-tight'>
              Recently added to the{' '}
              <span className='relative inline-block'>
                <span className='relative z-10 bg-gradient-to-r from-forest via-emerald-600 to-forest bg-clip-text text-transparent'>
                  catalog
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
            <p className='mt-3.5 text-muted text-[15px] leading-relaxed'>
              Full composition and trade pricing available — tap any product for
              complete details.
            </p>
          </Reveal>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {products.length === 0 ? (
              <div className='col-span-full text-center py-12 text-muted text-sm'>
                No products yet. Add products from the{' '}
                <Link href='/admin' className='text-forest font-bold underline'>
                  admin dashboard
                </Link>{' '}
                once Supabase is connected.
              </div>
            ) : (
              products
                .slice(0, 4)
                .map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 80} />
                ))
            )}
          </div>
          <Reveal className='text-center mt-10'>
            <Link
              href='/shop'
              className='group inline-flex items-center gap-2 bg-navy text-white px-8 py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_36px_-14px_rgba(20,24,31,0.4)]'
            >
              View All Products
              <svg
                width='14'
                height='14'
                viewBox='0 0 16 16'
                fill='none'
                className='transition-transform group-hover:translate-x-1'
              >
                <path
                  d='M2 8h11M9 4l4 4-4 4'
                  stroke='#fff'
                  strokeWidth='1.6'
                  strokeLinecap='round'
                />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* WHY US */}
      <section className='relative py-28 bg-gradient-to-b from-navy to-[#0B1220] text-white overflow-hidden'>
        {/* ambient glows */}
        <div className='pointer-events-none absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.08] blur-[120px]' />
        <div className='pointer-events-none absolute -bottom-40 right-1/4 w-[460px] h-[460px] rounded-full bg-forest/[0.15] blur-[120px]' />
        {/* faint grid texture */}
        <svg
          className='pointer-events-none absolute inset-0 w-full h-full opacity-[0.05]'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <pattern
              id='why-us-dots'
              width='28'
              height='28'
              patternUnits='userSpaceOnUse'
            >
              <circle cx='1.5' cy='1.5' r='1.5' fill='#fff' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#why-us-dots)' />
        </svg>

        <div className='relative max-w-[1240px] mx-auto px-8'>
          <Reveal className='max-w-[620px] mx-auto mb-16 text-center'>
            <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-gold font-bold mb-4 justify-center bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur'>
              <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse' />{' '}
              Why Choose Us
            </div>
            <h2 className='text-3xl md:text-4xl font-extrabold text-white leading-tight'>
              Built on{' '}
              <span className='relative inline-block'>
                <span className='relative z-10 bg-gradient-to-r from-gold via-[#e8c884] to-gold bg-clip-text text-transparent'>
                  reliability
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
                    opacity='0.7'
                  />
                </svg>
              </span>
              , not just range
            </h2>
          </Reveal>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {WHY_US.map((item, i) => (
              <Reveal key={item.t} delay={i * 90}>
                <div className='group relative h-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-9 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.07] hover:border-gold/30 hover:-translate-y-1.5'>
                  {/* corner accent */}
                  <span className='absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent scale-x-0 group-hover:scale-x-150 transition-transform duration-300' />
                  <div className='mx-auto mb-5 w-fit relative'>
                    <div className='absolute inset-0 rounded-full bg-gold/20 blur-md scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    <IconBadge from='#D9AE5F' to='#8B6D3F'>
                      {item.icon}
                    </IconBadge>
                  </div>
                  <h4 className='text-base font-extrabold mb-2.5 text-white'>
                    {item.t}
                  </h4>
                  <p className='text-[13px] text-white/55 leading-relaxed'>
                    {item.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-24'>
        <div className='max-w-[1240px] mx-auto px-8'>
          <Reveal>
            <div className='relative rounded-[28px] px-6 md:px-16 py-18 text-center text-white overflow-hidden bg-gradient-to-br from-forest via-forest to-forest-dark shadow-[0_50px_90px_-30px_rgba(11,79,56,0.5)]'>
              {/* dotted texture */}
              <svg
                className='pointer-events-none absolute inset-0 w-full h-full opacity-[0.1]'
                xmlns='http://www.w3.org/2000/svg'
              >
                <defs>
                  <pattern
                    id='cta-dots'
                    width='24'
                    height='24'
                    patternUnits='userSpaceOnUse'
                  >
                    <circle cx='1.5' cy='1.5' r='1.5' fill='#fff' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#cta-dots)' />
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
                  Get in Touch
                </div>
                <h2 className='text-3xl md:text-[42px] font-extrabold mb-4 leading-tight'>
                  Ready to stock{' '}
                  <span className='relative inline-block'>
                    <span className='relative z-10 bg-gradient-to-r from-gold via-[#F0D9A0] to-gold bg-clip-text text-transparent'>
                      genuine medicines
                    </span>
                    <svg
                      className='absolute -bottom-1 left-0 w-full'
                      height='8'
                      viewBox='0 0 300 8'
                      preserveAspectRatio='none'
                      fill='none'
                    >
                      <path
                        d='M1 6c50-5 200-5 298-1'
                        stroke='#C79A48'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                      />
                    </svg>
                  </span>
                  ?
                </h2>
                <p className='text-white/75 max-w-[460px] mx-auto mb-9 text-[15px] leading-relaxed'>
                  Reach our team directly — by form, WhatsApp, phone, or email.
                  We usually respond within a few hours.
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
