import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import Reveal from '@/components/Reveal'
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

const DETAILS = [
  {
    k: 'Phone',
    v: '+91 86798 84419',
    href: 'tel:+918679884419',
    note: 'Mon–Sat, business hours',
  },
  {
    k: 'WhatsApp',
    v: '+91 86798 84419',
    href: 'https://wa.me/918679884419',
    note: 'Quick replies for orders and quotes',
  },
  {
    k: 'Email',
    v: 'orders@gdntmedicare.com',
    href: 'mailto:orders@gdntmedicare.com',
    note: 'We usually respond within a few hours',
  },
]

const wrap = 'max-w-[1240px] mx-auto px-5 sm:px-8'

export default function ContactPage() {
  return (
    <>
      <div className='border-b border-line bg-bg-soft'>
        <div className={`${wrap} pt-3.5 pb-8`}>
          <div className='text-[13px] text-muted'>
            <Link href='/' className='hover:text-forest transition-colors'>
              Home
            </Link>
            <span className='mx-2'>/</span>
            <span className='text-navy font-semibold'>Contact</span>
          </div>
          <h1 className='animate-rise mt-5 text-[30px] md:text-[40px] font-semibold text-navy leading-tight'>
            Contact us
          </h1>
          <p className='animate-rise [animation-delay:120ms] mt-2 text-[15px] text-muted max-w-2xl leading-relaxed'>
            For product enquiries and trade pricing, reach us through whichever
            channel is easiest.
          </p>
        </div>
      </div>

      <section className='py-12 lg:py-16'>
        <div
          className={`${wrap} grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start`}
        >
          <Reveal variant='left'>
            <ul className='border border-line rounded-md divide-y divide-line'>
              {DETAILS.map((d) => (
                <li key={d.k}>
                  <a
                    href={d.href}
                    className='block px-6 py-5 transition-all duration-300 hover:bg-bg-soft hover:pl-8'
                  >
                    <span className='block text-[12px] uppercase tracking-[0.1em] text-muted font-bold'>
                      {d.k}
                    </span>
                    <span className='mt-1 block text-[17px] font-bold text-navy break-words'>
                      {d.v}
                    </span>
                    <span className='mt-0.5 block text-[13px] text-muted'>
                      {d.note}
                    </span>
                  </a>
                </li>
              ))}
              <li className='px-6 py-5'>
                <span className='block text-[12px] uppercase tracking-[0.1em] text-muted font-bold'>
                  Office address
                </span>
                <address className='mt-1 not-italic text-[15.5px] font-semibold text-navy leading-relaxed'>
                  GDNT Medicare Pvt. Ltd.
                  <br />
                  Poothkhas, Rohta Road,
                  <br />
                  Meerut, Uttar Pradesh 250502
                </address>
              </li>
            </ul>
          </Reveal>

          <Reveal variant='right' delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
