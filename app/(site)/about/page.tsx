import Link from 'next/link'
import CertLogo from '@/components/CertLogo'
import Reveal from '@/components/Reveal'
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
    t: 'Genuine, always',
    d: 'Every batch is verified and traceable back to the manufacturer.',
  },
  {
    t: 'Ethical practices',
    d: 'Licensed operations that meet all trade regulations, with no consumer-facing promotion. We trade only through medical professionals.',
  },
  {
    t: 'Transparent pricing',
    d: 'No hidden costs. Clear trade rates are shared upfront.',
  },
  {
    t: 'Reliable supply',
    d: 'Consistent stock availability and dependable dispatch timelines.',
  },
]

const FACTS: [string, string][] = [
  ['Established', '2014'],
  ['Company', 'GDNT Medicare Pvt. Ltd.'],
  ['Registered office', 'Poothkhas, Rohta Road, Meerut, Uttar Pradesh 250502'],
  ['Business', 'Ethical pharmaceutical trade'],
  ['Supplies to', 'Doctors, clinics, hospitals and medical stores'],
  ['Range', '80+ formulations'],
]

const CERTS = [
  { label: 'WHO', src: '/who-logo.png' },
  { label: 'GMP', src: '/gmp-logo.jpg' },
  { label: 'ISO', src: '/iso-logo.png' },
]

const CERT_CARDS = [
  {
    key: 'who',
    src: '/who-logo.png',
    short: 'WHO',
    name: 'World Health Organization',
    tag: 'Global standards',
    desc: 'We follow the quality and safety guidelines set by the World Health Organization for the manufacture and supply of medicines.',
  },
  {
    key: 'gmp',
    src: '/gmp-logo.jpg',
    short: 'GMP',
    name: 'GMP Certified',
    tag: 'Good Manufacturing Practice',
    desc: 'Products are made, tested and released under Good Manufacturing Practices, to strict quality norms at every stage.',
  },
  {
    key: 'iso',
    src: '/iso-logo.png',
    short: 'ISO',
    name: 'ISO Certified',
    tag: 'Quality management',
    desc: 'Our quality management processes are aligned with international ISO standards, covering documentation, consistency and continuous improvement.',
  },
]

const wrap = 'max-w-[1240px] mx-auto px-5 sm:px-8'

export default function AboutPage() {
  return (
    <>
      {/* breadcrumb */}
      <div className='border-b border-line bg-bg-soft'>
        <div className={`${wrap} py-3.5 text-[13px] text-muted`}>
          <Link href='/' className='hover:text-forest transition-colors'>
            Home
          </Link>
          <span className='mx-2'>/</span>
          <span className='text-navy font-semibold'>About Us</span>
        </div>
      </div>

      {/* STORY + FACT SHEET */}
      <section className='py-12 lg:py-20'>
        <div
          className={`${wrap} grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start`}
        >
          <div>
            <div className='animate-rise flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.1em] text-forest'>
              <span className='h-px w-7 bg-forest' />
              About GDNT Medicare
            </div>
            <h1 className='animate-rise [animation-delay:100ms] mt-5 text-[36px] md:text-[48px] font-semibold text-navy leading-[1.1]'>
              Expert care for a healthier tomorrow
            </h1>
            <p className='animate-rise [animation-delay:200ms] mt-6 text-[16.5px] text-muted leading-[1.75]'>
              GDNT Medicare Pvt. Ltd. is an ethical pharmaceutical company
              founded with one purpose: to make genuine, quality-assured
              medicines easily accessible to the doctors and medical stores who
              depend on them.
            </p>
            <p className='animate-rise [animation-delay:280ms] mt-4 text-[16.5px] text-muted leading-[1.75]'>
              We work directly with certified manufacturers and maintain strict
              quality checks at every stage, from sourcing to dispatch. There is
              no consumer advertising. We trade only through medical
              professionals.
            </p>
            <p className='animate-rise [animation-delay:360ms] mt-4 text-[16.5px] text-muted leading-[1.75]'>
              Today we supply a growing catalog of formulations across cardiac,
              diabetes, respiratory, wellness and general care categories,
              trusted by clinics and pharmacies across the region.
            </p>
            <div className='animate-rise [animation-delay:440ms] mt-8 flex flex-wrap gap-3'>
              <Link
                href='/shop'
                className='inline-flex items-center bg-forest text-white px-7 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-forest-dark'
              >
                View catalog
              </Link>
              <Link
                href='/contact'
                className='inline-flex items-center border border-navy/25 text-navy px-7 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:border-navy hover:bg-bg-soft'
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Company at a glance: real, useful facts instead of a decorative box */}
          <aside
            aria-label='Company at a glance'
            className='animate-zoom [animation-delay:250ms] border border-line rounded-md overflow-hidden bg-white'
          >
            <div className='bg-forest-dark text-white px-6 py-4 flex items-center justify-between'>
              <h2 className='text-[18px] font-semibold'>Company at a glance</h2>
              <span className='text-[12px] uppercase tracking-[0.1em] text-white/70 font-bold'>
                Since 2014
              </span>
            </div>
            <dl className='divide-y divide-line'>
              {FACTS.map(([k, v], i) => (
                <div
                  key={k}
                  style={{ animationDelay: `${450 + i * 80}ms` }}
                  className='animate-rise grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] gap-4 px-6 py-3.5 text-[14px] transition-colors hover:bg-forest-pale/40'
                >
                  <dt className='text-muted font-semibold'>{k}</dt>
                  <dd className='text-navy font-semibold'>{v}</dd>
                </div>
              ))}
            </dl>
            <div className='border-t border-line bg-bg-soft px-6 py-5'>
              <div className='text-[12px] uppercase tracking-[0.1em] text-muted font-bold'>
                Certifications
              </div>
              <div className='mt-3 flex flex-wrap items-center gap-3'>
                {CERTS.map((c) => (
                  <span
                    key={c.label}
                    className='flex items-center gap-2.5 pr-4 pl-1.5 py-1.5 bg-white border border-line rounded-md transition-transform duration-300 hover:-translate-y-0.5'
                  >
                    <span className='w-10 h-10 flex items-center justify-center'>
                      <CertLogo
                        src={c.src}
                        alt={`${c.label} logo`}
                        className='max-w-full max-h-full'
                        fallback={
                          <span className='text-forest font-bold text-xs'>
                            {c.label}
                          </span>
                        }
                      />
                    </span>
                    <span className='text-[13px] font-bold text-navy'>
                      {c.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className='border-y border-line bg-bg-soft py-16 md:py-24'>
        <div className={wrap}>
          <Reveal variant='left'>
            <div className='flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.1em] text-forest'>
              <span className='rule-grow h-px bg-forest' />
              Our certifications
            </div>
            <h2 className='mt-3 text-[30px] md:text-[38px] font-semibold text-navy leading-[1.15] max-w-[620px]'>
              Quality you can verify
            </h2>
            <p className='mt-3 text-[15.5px] text-muted leading-relaxed max-w-[560px]'>
              Recognised standards sit behind every product we supply to doctors
              and medical stores.
            </p>
          </Reveal>

          <div className='mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6'>
            {CERT_CARDS.map((c, i) => (
              <Reveal key={c.key} delay={i * 120}>
                <article className='h-full bg-white border border-line rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-forest/40 hover:shadow-[0_14px_30px_-14px_rgba(15,110,78,0.25)]'>
                  <div className='h-[130px] flex items-center justify-center bg-forest-pale/40 border-b border-line'>
                    <CertLogo
                      src={c.src}
                      alt={`${c.name} logo`}
                      className='h-16 w-auto'
                      fallback={
                        <span className='font-serif text-[34px] font-semibold text-forest'>
                          {c.short}
                        </span>
                      }
                    />
                  </div>
                  <div className='p-6'>
                    <div className='flex items-center justify-between gap-3 flex-wrap'>
                      <h3 className='text-[18px] font-bold text-navy'>
                        {c.name}
                      </h3>
                      <span className='text-[11.5px] font-bold uppercase tracking-[0.08em] text-forest bg-forest-pale px-2.5 py-1 rounded'>
                        {c.tag}
                      </span>
                    </div>
                    <p className='mt-3 text-[15px] text-muted leading-relaxed'>
                      {c.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className='py-16 md:py-24'>
        <div className={wrap}>
          <div className='grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16'>
            <Reveal variant='left'>
              <div className='flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.1em] text-forest'>
                <span className='rule-grow h-px bg-forest' />
                Our values
              </div>
              <h2 className='mt-3 text-[30px] md:text-[38px] font-semibold text-navy leading-[1.15]'>
                What guides how we work
              </h2>
            </Reveal>
            <ol className='divide-y divide-line border-y border-line'>
              {VALUES.map((v, i) => (
                <li key={v.t}>
                  <Reveal
                    delay={i * 100}
                    className='grid grid-cols-[48px_1fr] gap-4 py-6'
                  >
                    <span className='font-serif text-[26px] font-semibold text-forest/40 leading-none pt-0.5'>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className='text-[18px] font-bold text-navy'>{v.t}</h3>
                      <p className='mt-1.5 text-[15px] text-muted leading-relaxed max-w-[560px]'>
                        {v.d}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='pb-16 md:pb-24'>
        <div className={wrap}>
          <Reveal variant='scale'>
            <div className='rounded-md bg-forest-dark text-white px-7 md:px-14 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-7'>
              <div>
                <h2 className='text-[28px] md:text-[34px] font-semibold leading-tight'>
                  Let&apos;s work together
                </h2>
                <p className='mt-2.5 text-white/80 text-[15.5px] max-w-[460px]'>
                  Reach out to discuss stocking our range at your clinic or
                  pharmacy.
                </p>
              </div>
              <Link
                href='/contact'
                className='inline-flex items-center justify-center bg-white text-forest-dark px-8 py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-forest-pale shrink-0'
              >
                Contact our team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
