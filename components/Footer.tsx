import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'

const EXPLORE = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

const LEGAL = [
  { href: '/drug-license', label: 'Drug License Info' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-trade', label: 'Terms of Trade' },
]

export default function Footer() {
  return (
    <footer className='bg-navy text-white/70'>
      <div className='max-w-[1240px] mx-auto px-5 sm:px-8 pt-14 pb-8'>
        <Reveal
          variant='fade'
          className='grid grid-cols-2 md:grid-cols-[1.8fr_1fr_1.3fr_1fr] gap-x-8 gap-y-10 pb-12 border-b border-white/15'
        >
          <div className='col-span-2 md:col-span-1'>
            <Image
              src='/logo.png'
              alt='GDNT Medicare'
              width={776}
              height={322}
              quality={100}
              className='h-[40px] w-auto brightness-0 invert mb-5'
            />
            <p className='max-w-[300px] text-[14px] leading-relaxed'>
              An ethical pharmaceutical company supplying genuine,
              quality-assured medicines to doctors and medical stores.
            </p>
            <div className='mt-5 flex items-center gap-2.5'>
              {[
                ['/who-logo.png', 'WHO'],
                ['/gmp-logo.jpg', 'GMP'],
                ['/iso-logo.png', 'ISO'],
              ].map(([src, alt]) => (
                <span
                  key={alt}
                  className='w-11 h-11 rounded bg-white flex items-center justify-center p-1'
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${alt} certification`}
                    className='max-w-full max-h-full object-contain'
                  />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className='text-[12px] tracking-[0.08em] uppercase text-white font-bold mb-4'>
              Explore
            </h5>
            <ul className='space-y-2.5 text-[14px]'>
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className='hover:text-white transition-colors'
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className='text-[12px] tracking-[0.08em] uppercase text-white font-bold mb-4'>
              Contact
            </h5>
            <ul className='space-y-2.5 text-[14px]'>
              <li>
                <a
                  href='tel:+918679884419'
                  className='hover:text-white transition-colors'
                >
                  +91 86798 84419
                </a>
              </li>
              <li>
                <a
                  href='mailto:orders@gdntmedicare.com'
                  className='hover:text-white transition-colors break-all'
                >
                  orders@gdntmedicare.com
                </a>
              </li>
              <li>
                <a
                  href='https://wa.me/918679884419'
                  className='hover:text-white transition-colors'
                >
                  WhatsApp chat
                </a>
              </li>
              <li className='leading-relaxed'>
                Poothkhas, Rohta Road,
                <br />
                Meerut, Uttar Pradesh 250502
              </li>
            </ul>
          </div>

          <div>
            <h5 className='text-[12px] tracking-[0.08em] uppercase text-white font-bold mb-4'>
              Legal
            </h5>
            <ul className='space-y-2.5 text-[14px]'>
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className='hover:text-white transition-colors'
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className='flex flex-col sm:flex-row justify-between gap-2 pt-6 text-[13px]'>
          <span>© 2026 GDNT Medicare Pvt. Ltd. All rights reserved.</span>
          <span>
            Medicines are supplied to registered medical professionals and
            licensed stores only.
          </span>
        </div>
      </div>
    </footer>
  )
}
