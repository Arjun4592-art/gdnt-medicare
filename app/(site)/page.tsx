import Link from 'next/link'
import { getProducts } from '@/lib/data'
import ProductCard from '@/components/ProductCard'
import HeroVideo from '@/components/HeroVideo'
import CertLogo from '@/components/CertLogo'
import Reveal from '@/components/Reveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

/* ---------- content ---------- */

const CATEGORIES = [
  {
    label: 'Tablets & Capsules',
    desc: 'Oral solid dosage forms across everyday and specialist therapy areas.',
    count: '32 items',
    icon: (
      <>
        <rect x='3' y='8.5' width='18' height='7' rx='3.5' />
        <path d='M12 8.5v7' />
      </>
    ),
  },
  {
    label: 'Syrups & Liquids',
    desc: 'Syrups, suspensions and oral liquids for adults and children.',
    count: '14 items',
    icon: (
      <>
        <path d='M9.5 3h5v4l3 4.5V19a2 2 0 01-2 2h-7a2 2 0 01-2-2v-7.5L9.5 7V3z' />
        <path d='M7 14h10' />
      </>
    ),
  },
  {
    label: 'Injectables',
    desc: 'Sterile injectable formulations for clinics and hospitals.',
    count: '9 items',
    icon: (
      <>
        <path d='M18 3l3 3M16 5l3 3-9.5 9.5-3-3L16 5z' />
        <path d='M6.5 14.5L3 21l6.5-3.5' />
        <path d='M11 9l2 2' />
      </>
    ),
  },
  {
    label: 'Ointments & Creams',
    desc: 'Topical formulations for skin, pain and wound care.',
    count: '11 items',
    icon: (
      <>
        <rect x='7' y='8' width='10' height='13' rx='1.5' />
        <path d='M9 8V5h6v3M10 3h4' />
        <path d='M10 13h4' />
      </>
    ),
  },
  {
    label: 'Wellness & Supplements',
    desc: 'Daily nutrition and wellness support products.',
    count: '10 items',
    icon: (
      <>
        <path d='M12 21c-4.5-2-7-5.5-7-9.5V5l7-2 7 2v6.5c0 4-2.5 7.5-7 9.5z' />
        <path d='M12 8v7M8.5 11.5h7' />
      </>
    ),
  },
]

const CERTS = [
  {
    key: 'who',
    src: '/who-logo.png',
    short: 'WHO',
    name: 'World Health Organization',
    desc: 'Manufacturing aligned with WHO-GMP guidelines for quality and safety.',
  },
  {
    key: 'gmp',
    src: '/gmp-logo.jpg',
    short: 'GMP',
    name: 'GMP Certified',
    desc: 'Good Manufacturing Practices: products made and tested to strict quality norms.',
  },
  {
    key: 'iso',
    src: '/iso-logo.png',
    short: 'ISO',
    name: 'ISO Certified',
    desc: 'Quality management processes aligned with international ISO standards.',
  },
]

const ASSURANCES = [
  'WHO-GMP certified formulations',
  '100% genuine products',
  'Direct trade pricing',
  'Fast regional dispatch',
]

const STEPS = [
  {
    n: '01',
    t: 'Browse the catalog',
    d: 'Check composition, pack size and trade pricing for every product in our range.',
  },
  {
    n: '02',
    t: 'Send an enquiry',
    d: 'Reach us by form, WhatsApp, phone or email. We usually respond within a few hours.',
  },
  {
    n: '03',
    t: 'Receive your order',
    d: 'Quick regional dispatch to clinics, hospitals and medical stores.',
  },
]

const WHY_US = [
  {
    t: 'Genuine products',
    d: 'Medicines supplied directly, with every batch traceable to the manufacturer.',
  },
  {
    t: 'Transparent trade pricing',
    d: 'Clear rates for bulk and retail orders, with no hidden mark-ups.',
  },
  {
    t: 'Reliable dispatch',
    d: 'Consistent stock and dependable timelines for clinics and pharmacies.',
  },
  {
    t: 'People you can reach',
    d: 'Our team answers on WhatsApp, phone and email for orders and queries.',
  },
]

/* ---------- small helpers ---------- */

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 16 16'
    fill='none'
    className={className}
    aria-hidden='true'
  >
    <path
      d='M2 8h11M9 4l4 4-4 4'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
    />
  </svg>
)

const Check = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <circle cx='12' cy='12' r='9' />
    <path d='M8.5 12.3l2.5 2.5 4.5-5' />
  </svg>
)

function SectionHead({
  label,
  title,
  text,
  link,
}: {
  label: string
  title: string
  text?: string
  link?: { href: string; text: string }
}) {
  return (
    <Reveal className='flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10'>
      <div className='max-w-[620px]'>
        <div className='flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.1em] text-forest'>
          <span className='rule-grow h-px bg-forest' />
          {label}
        </div>
        <h2 className='mt-3 text-[30px] md:text-[38px] font-semibold text-navy leading-[1.15]'>
          {title}
        </h2>
        {text && (
          <p className='mt-3 text-[15.5px] text-muted leading-relaxed'>
            {text}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className='group inline-flex items-center gap-2 text-[14px] font-bold text-forest hover:text-forest-dark self-start md:self-auto'
        >
          {link.text}
          <Arrow className='transition-transform group-hover:translate-x-1' />
        </Link>
      )}
    </Reveal>
  )
}

const wrap = 'max-w-[1240px] mx-auto px-5 sm:px-8'

export default async function Home() {
  const products = await getProducts()

  return (
    <>
      {/* HERO */}
      <section className='border-b border-line'>
        <div
          className={`${wrap} grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center py-12 lg:py-20`}
        >
          <div>
            <div className='animate-rise flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.1em] text-forest'>
              <span className='h-px w-7 bg-forest' />
              An ethical pharmaceutical company
            </div>
            <h1 className='animate-rise [animation-delay:100ms] mt-5 text-[38px] sm:text-[46px] lg:text-[54px] font-semibold text-navy leading-[1.08]'>
              Genuine medicines, supplied directly to trusted retailers.
            </h1>
            <p className='animate-rise [animation-delay:200ms] mt-6 text-[16.5px] text-muted leading-relaxed max-w-[540px]'>
              GDNT Medicare works with certified manufacturers and checks
              quality at every stage, from sourcing to dispatch. Browse the
              catalog, then enquire for trade pricing.
            </p>
            <div className='animate-rise [animation-delay:300ms] mt-8 flex flex-wrap gap-3'>
              <Link
                href='/shop'
                className='group inline-flex items-center gap-2 bg-forest text-white px-7 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-forest-dark'
              >
                Browse catalog
                <Arrow className='transition-transform group-hover:translate-x-1' />
              </Link>
              <Link
                href='/contact'
                className='inline-flex items-center border border-navy/25 text-navy px-7 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:border-navy hover:bg-bg-soft'
              >
                Send an enquiry
              </Link>
            </div>
          </div>

          <div className='animate-zoom [animation-delay:200ms]'>
            <div className='relative aspect-[4/3] overflow-hidden rounded-md bg-bg-soft border border-line'>
              <HeroVideo />
            </div>
            <div className='mt-3 flex items-center gap-3 text-[13px] text-muted'>
              <span className='flex items-center gap-1.5'>
                {CERTS.map((c) => (
                  <span
                    key={c.key}
                    className='w-9 h-9 rounded border border-line bg-white flex items-center justify-center p-0.5'
                  >
                    <CertLogo
                      src={c.src}
                      alt={`${c.name} logo`}
                      className='max-w-full max-h-full'
                    />
                  </span>
                ))}
              </span>
              WHO-GMP and ISO certified
            </div>
          </div>
        </div>
      </section>

      {/* ASSURANCES: scrolling strip (pauses on hover) */}
      <section className='bg-bg-soft border-b border-line'>
        <div
          className='marquee overflow-hidden py-5'
          style={{
            maskImage:
              'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
          }}
        >
          <div className='flex w-max animate-marquee'>
            {[0, 1].map((dup) => (
              <ul
                key={dup}
                aria-hidden={dup === 1}
                className='flex shrink-0 items-center'
              >
                {/* items repeated so one copy is always wider than the screen */}
                {[...ASSURANCES, ...ASSURANCES].map((a, i) => (
                  <li
                    key={i}
                    className='flex items-center gap-2.5 pr-14 whitespace-nowrap text-[14px] font-semibold text-navy'
                  >
                    <span className='text-forest shrink-0'>
                      <Check />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className='py-16 md:py-24'>
        <div className={wrap}>
          <SectionHead
            label='Product categories'
            title='Browse by dosage form'
            text='Five ranges covering the everyday needs of clinics, hospitals and retail pharmacies.'
            link={{ href: '/shop', text: 'View full catalog' }}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-line'>
            {CATEGORIES.map((c, i) => (
              <Reveal
                key={c.label}
                delay={i * 90}
                className='border-r border-b border-line'
              >
                <Link
                  href='/shop'
                  className='group flex h-full flex-col p-6 bg-white transition-colors duration-300 hover:bg-forest-pale/60'
                >
                  <svg
                    className='transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110'
                    width='34'
                    height='34'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#0F6E4E'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    aria-hidden='true'
                  >
                    {c.icon}
                  </svg>
                  <h3 className='mt-5 text-[16.5px] font-bold text-navy leading-snug'>
                    {c.label}
                  </h3>
                  <p className='mt-2 text-[13.5px] text-muted leading-relaxed flex-1'>
                    {c.desc}
                  </p>
                  <div className='mt-5 flex items-center justify-between text-[13px]'>
                    <span className='text-muted'>{c.count}</span>
                    <span className='inline-flex items-center gap-1.5 font-bold text-forest'>
                      View
                      <Arrow className='transition-transform group-hover:translate-x-1' />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className='py-16 md:py-24 bg-bg-soft border-y border-line'>
        <div className={wrap}>
          <SectionHead
            label='New in the catalog'
            title='Recently added products'
            text='Composition, pack size and trade pricing are listed for every product.'
            link={{ href: '/shop', text: 'View all products' }}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {products.length === 0 ? (
              <div className='col-span-full text-center py-12 text-muted text-sm bg-white border border-line rounded-md'>
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
                  <ProductCard key={p.id} product={p} delay={i * 90} />
                ))
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className='py-16 md:py-24'>
        <div className={wrap}>
          <SectionHead
            label='How it works'
            title='From enquiry to stock in three steps'
          />
          <ol className='grid grid-cols-1 md:grid-cols-3 border border-line rounded-md divide-y md:divide-y-0 md:divide-x divide-line'>
            {STEPS.map((s, i) => (
              <li key={s.n}>
                <Reveal delay={i * 120} className='h-full p-7 md:p-9'>
                  <div className='font-serif text-[44px] font-semibold text-forest/30 leading-none'>
                    {s.n}
                  </div>
                  <h3 className='mt-5 text-[18px] font-bold text-navy'>
                    {s.t}
                  </h3>
                  <p className='mt-2 text-[14.5px] text-muted leading-relaxed'>
                    {s.d}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHY US */}
      <section className='py-16 md:py-24 bg-bg-soft border-y border-line'>
        <div
          className={`${wrap} grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16`}
        >
          <Reveal variant='left'>
            <div className='flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.1em] text-forest'>
              <span className='rule-grow h-px bg-forest' />
              Why GDNT Medicare
            </div>
            <h2 className='mt-3 text-[30px] md:text-[38px] font-semibold text-navy leading-[1.15]'>
              Built on reliability, not just range
            </h2>
            <p className='mt-4 text-[15.5px] text-muted leading-relaxed max-w-[460px]'>
              Every batch is traceable and compliant with pharmaceutical
              standards, so doctors and medical stores can stock with
              confidence.
            </p>
            <Link
              href='/about'
              className='group mt-7 inline-flex items-center gap-2 text-[14px] font-bold text-forest hover:text-forest-dark'
            >
              More about our company
              <Arrow className='transition-transform group-hover:translate-x-1' />
            </Link>
          </Reveal>

          <div className='grid grid-cols-1 sm:grid-cols-2 border-t border-l border-line bg-white'>
            {WHY_US.map((w, i) => (
              <Reveal
                key={w.t}
                delay={i * 100}
                className='border-r border-b border-line'
              >
                <div className='h-full p-6 md:p-7 transition-colors duration-300 hover:bg-forest-pale/50'>
                  <h3 className='text-[16.5px] font-bold text-navy'>{w.t}</h3>
                  <p className='mt-2 text-[14px] text-muted leading-relaxed'>
                    {w.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className='py-16 md:py-24'>
        <div className={wrap}>
          <SectionHead
            label='Certifications'
            title='Standards behind every product'
          />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {CERTS.map((c, i) => (
              <Reveal key={c.key} delay={i * 110} className='h-full'>
                <div className='flex h-full gap-5 items-start p-6 border border-line rounded-md bg-white transition-all duration-300 hover:-translate-y-1 hover:border-forest/50 hover:shadow-[0_18px_32px_-20px_rgba(20,24,31,0.3)]'>
                  <span className='w-[76px] h-[76px] shrink-0 border border-line rounded bg-white flex items-center justify-center p-1.5'>
                    <CertLogo
                      src={c.src}
                      alt={`${c.name} logo`}
                      className='max-w-full max-h-full'
                      fallback={
                        <span className='text-forest font-bold text-sm'>
                          {c.short}
                        </span>
                      }
                    />
                  </span>
                  <div>
                    <h3 className='text-[16.5px] font-bold text-navy leading-snug'>
                      {c.name}
                    </h3>
                    <p className='mt-1.5 text-[13.5px] text-muted leading-relaxed'>
                      {c.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT BAND */}
      <section className='pb-16 md:pb-24'>
        <div className={wrap}>
          <Reveal variant='scale'>
            <div className='grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] rounded-md overflow-hidden bg-forest-dark text-white'>
              <div className='p-8 md:p-12'>
                <h2 className='text-[30px] md:text-[38px] font-semibold leading-[1.15]'>
                  Ready to stock genuine medicines?
                </h2>
                <p className='mt-4 text-white/80 max-w-[440px] text-[15.5px] leading-relaxed'>
                  Reach our team by form, WhatsApp, phone or email. We usually
                  respond within a few hours.
                </p>
                <div className='mt-8 flex flex-wrap gap-3'>
                  <Link
                    href='/contact'
                    className='group inline-flex items-center gap-2 bg-white text-forest-dark px-7 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-forest-pale'
                  >
                    Send an enquiry
                    <Arrow className='transition-transform group-hover:translate-x-1' />
                  </Link>
                  <a
                    href='https://wa.me/918679884419'
                    className='inline-flex items-center border border-white/40 text-white px-7 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-white/10'
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <ul className='border-t lg:border-t-0 lg:border-l border-white/20 divide-y divide-white/20'>
                {[
                  ['Call us', '+91 86798 84419', 'tel:+918679884419'],
                  [
                    'Email us',
                    'orders@gdntmedicare.com',
                    'mailto:orders@gdntmedicare.com',
                  ],
                  [
                    'Visit us',
                    'Poothkhas, Rohta Road, Meerut, UP 250502',
                    '/contact',
                  ],
                ].map(([k, v, href]) => (
                  <li key={k}>
                    <a
                      href={href}
                      className='block px-8 md:px-12 py-6 transition-colors hover:bg-white/5'
                    >
                      <span className='block text-[12px] uppercase tracking-[0.1em] text-white/60 font-bold'>
                        {k}
                      </span>
                      <span className='mt-1 block text-[16px] font-semibold break-words'>
                        {v}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
