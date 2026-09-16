import Link from 'next/link'
import Reveal from '@/components/Reveal'
import ContactForm from '@/components/ContactForm'
import { IconBadge } from '@/components/IconBadge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with GDNT Medicare Pvt. Ltd., ethical pharmaceutical company in Meerut, Uttar Pradesh, via form, WhatsApp, phone, or email for product enquiries and trade pricing.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact GDNT Medicare Pvt. Ltd.',
    description:
      'Get in touch with our ethical pharmaceutical company in Meerut, Uttar Pradesh for product enquiries and trade pricing.',
    url: 'https://gdntmedicare.com/contact',
    type: 'website',
  },
}

const METHODS = [
  {
    title: 'Fill the Enquiry Form',
    body: 'We typically respond within a few hours during business days.',
    icon: <path d='M4 4h16v12H8l-4 4V4z' strokeLinejoin='round' />,
  },
  {
    title: 'WhatsApp Chat',
    body: (
      <a href='https://wa.me/919876543210' className='text-forest font-bold'>
        +91 98765 43210
      </a>
    ),
    icon: (
      <path
        d='M12 3a9 9 0 00-7.8 13.5L3 21l4.7-1.2A9 9 0 1012 3z'
        strokeLinejoin='round'
      />
    ),
  },
  {
    title: 'Call Us',
    body: (
      <a href='tel:+919876543210' className='text-forest font-bold'>
        +91 98765 43210
      </a>
    ),
    icon: (
      <path
        d='M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .7 3a2 2 0 01-.4 2.1L8.1 10a16 16 0 006 6l1.2-1.3a2 2 0 012.1-.4c1 .3 2 .5 3 .7a2 2 0 011.6 2z'
        strokeLinejoin='round'
      />
    ),
  },
  {
    title: 'Email',
    body: (
      <a
        href='mailto:orders@gdntmedicare.com'
        className='text-forest font-bold'
      >
        orders@gdntmedicare.com
      </a>
    ),
    icon: <path d='M3 5h18v14H3z M3 7l9 6 9-6' strokeLinejoin='round' />,
  },
]

export default function ContactPage() {
  return (
    <>
      <div className='max-w-[1240px] mx-auto px-5 sm:px-8 py-5 text-[13px] text-muted'>
        <Link href='/' className='hover:text-forest transition-colors'>
          Home
        </Link>
        <span className='mx-1.5'>/</span>
        <span className='text-navy font-semibold'>Contact</span>
      </div>

      <section className='relative pt-4 pb-24 overflow-hidden'>
        <div className='pointer-events-none absolute -top-20 -left-32 w-[420px] h-[420px] rounded-full bg-forest/[0.06] blur-[110px]' />
        <div className='pointer-events-none absolute top-40 right-0 w-[360px] h-[360px] rounded-full bg-gold/[0.08] blur-[100px]' />

        <div className='relative max-w-[1240px] mx-auto px-5 sm:px-8'>
          <Reveal className='max-w-[620px] mx-auto mb-12 text-center'>
            <div className='inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4 justify-center bg-white/80 backdrop-blur border border-forest/15 px-3.5 py-1.5 rounded-full shadow-[0_6px_16px_-8px_rgba(15,110,78,0.25)] w-fit mx-auto'>
              <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse' />{' '}
              Get in Touch
            </div>
            <h1 className='text-3xl md:text-4xl font-extrabold text-navy leading-tight'>
              We&apos;d love to hear{' '}
              <span className='relative inline-block'>
                <span className='relative z-10 bg-gradient-to-r from-forest via-emerald-600 to-forest bg-clip-text text-transparent'>
                  from you
                </span>
                <svg
                  className='absolute -bottom-1 left-0 w-full'
                  height='8'
                  viewBox='0 0 130 8'
                  preserveAspectRatio='none'
                  fill='none'
                >
                  <path
                    d='M1 6c26-5 84-5 128-1'
                    stroke='#C79A48'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
            </h1>
            <p className='mt-3.5 text-muted text-[15px] leading-relaxed'>
              Reach us through whichever channel is easiest — form, WhatsApp,
              phone, or email.
            </p>
          </Reveal>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-14'>
            <div className='flex flex-col gap-4'>
              {METHODS.map((m, i) => (
                <Reveal key={m.title} delay={i * 70}>
                  <div
                    className='group relative flex gap-4 items-start p-5 bg-white border border-line/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1'
                    style={{ boxShadow: '0 4px 14px -8px rgba(20,24,31,0.08)' }}
                  >
                    <span className='absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-forest to-emerald-500 scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300' />
                    <IconBadge
                      from='#14A876'
                      to='#0B4F38'
                      size={46}
                      shape='square'
                    >
                      {m.icon}
                    </IconBadge>
                    <div>
                      <h5 className='text-sm font-extrabold text-navy'>
                        {m.title}
                      </h5>
                      <p className='text-[13px] text-muted mt-0.5'>{m.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={4 * 70}>
                <div
                  className='group relative flex gap-4 items-start p-5 bg-white border border-line/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1'
                  style={{ boxShadow: '0 4px 14px -8px rgba(20,24,31,0.08)' }}
                >
                  <span className='absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gold to-[#8B6D3F] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300' />
                  <IconBadge
                    from='#D9AE5F'
                    to='#8B6D3F'
                    size={46}
                    shape='square'
                  >
                    <path
                      d='M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z'
                      strokeLinejoin='round'
                    />
                    <circle cx='12' cy='11' r='2.2' />
                  </IconBadge>
                  <div>
                    <h5 className='text-sm font-extrabold text-navy'>
                      Office Address
                    </h5>
                    <p className='text-[13px] text-muted mt-0.5'>
                      GDNT Medicare Pvt. Ltd., Poothkhas, Rohta Road, Meerut,
                      Uttar Pradesh, 250502
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
