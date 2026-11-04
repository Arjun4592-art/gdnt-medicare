'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Needed before using a portal, since document.body isn't available during SSR.
  useEffect(() => {
    setMounted(true)
  }, [])

  // Soft shadow under the sticky header once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu / search whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  // Close search modal on Escape, and lock body scroll while search or the
  // mobile menu is open (both float over the page now, so scrolling behind
  // them would be confusing).
  useEffect(() => {
    if (!searchOpen && !menuOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [searchOpen, menuOpen])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setSearchOpen(false)
    setMenuOpen(false)
    setQuery('')
  }

  return (
    <>
      {/* Utility bar: the contact details a doctor or chemist looks for first */}
      <div className='hidden md:block bg-navy text-white/80 text-[12.5px]'>
        <div className='max-w-[1240px] mx-auto px-8 h-9 flex items-center justify-between gap-8'>
          {/* Scrolling notice: pauses on hover, static for reduced-motion users */}
          <div className='marquee flex-1 min-w-0 overflow-hidden'>
            <div className='flex w-max animate-marquee'>
              {[0, 1].map((dup) => (
                <ul
                  key={dup}
                  aria-hidden={dup === 1}
                  className='flex shrink-0 items-center'
                >
                  {[0, 1].map((i) => (
                    <li
                      key={i}
                      className='whitespace-nowrap pr-12 flex items-center gap-12'
                    >
                      <span>
                        Ethical pharmaceutical company · Meerut, Uttar Pradesh ·
                        Trade supply to retailers
                      </span>
                      <span className='w-1 h-1 rounded-full bg-white/50' />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className='flex shrink-0 items-center gap-6'>
            <a
              href='tel:+918679884419'
              className='hover:text-white transition-colors'
            >
              +91 86798 84419
            </a>
            <a
              href='mailto:orders@gdntmedicare.com'
              className='hover:text-white transition-colors'
            >
              orders@gdntmedicare.com
            </a>
            <a
              href='https://wa.me/918679884419'
              className='hover:text-white transition-colors'
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-100 bg-white border-b border-line transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_8px_24px_-14px_rgba(20,24,31,0.35)]' : ''
        }`}
      >
        <div className='max-w-[1240px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[72px] gap-4'>
          <Link href='/' className='flex items-center shrink-0'>
            <Image
              src='/logo.png'
              alt='GDNT Medicare logo'
              width={776}
              height={322}
              priority
              quality={100}
              className='h-[44px] w-auto transition-transform duration-300 hover:scale-[1.03]'
            />
          </Link>

          <nav className='hidden md:block self-stretch'>
            <ul className='flex gap-8 h-full'>
              {NAV.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)
                return (
                  <li key={item.href} className='h-full'>
                    <Link
                      href={item.href}
                      className={`relative h-full flex items-center text-[14px] font-semibold transition-colors hover:text-forest after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-forest after:origin-left after:transition-transform after:duration-300 ${
                        active
                          ? 'text-forest after:scale-x-100'
                          : 'text-ink after:scale-x-0 hover:after:scale-x-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className='flex items-center gap-2 sm:gap-3'>
            {/* Desktop: a real search field look, like a pharmacy site */}
            <button
              type='button'
              aria-label='Search products'
              onClick={() => setSearchOpen(true)}
              className='hidden lg:flex items-center gap-2.5 w-[240px] h-10 px-3.5 border border-line rounded-md bg-bg-soft text-[13px] text-muted text-left transition-colors hover:border-forest/50'
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <circle
                  cx='11'
                  cy='11'
                  r='7'
                  stroke='#5B6470'
                  strokeWidth='1.8'
                />
                <path
                  d='M21 21l-4.3-4.3'
                  stroke='#5B6470'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                />
              </svg>
              Search medicines
            </button>

            {/* Tablet / mobile: icon only */}
            <button
              type='button'
              aria-label='Search'
              onClick={() => setSearchOpen(true)}
              className='lg:hidden flex w-10 h-10 shrink-0 rounded-md border border-line items-center justify-center transition-colors hover:border-forest/50'
            >
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                <circle
                  cx='11'
                  cy='11'
                  r='7'
                  stroke='#14181F'
                  strokeWidth='1.8'
                />
                <path
                  d='M21 21l-4.3-4.3'
                  stroke='#14181F'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                />
              </svg>
            </button>

            <Link
              href='/contact'
              className='hidden sm:inline-flex items-center h-10 bg-forest text-white px-5 rounded-md text-[13px] font-bold transition-colors hover:bg-forest-dark'
            >
              Enquire Now
            </Link>

            <button
              type='button'
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className='md:hidden flex w-10 h-10 shrink-0 rounded-md border border-line items-center justify-center transition-colors hover:border-forest/50'
            >
              {menuOpen ? (
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M6 6l12 12M18 6L6 18'
                    stroke='#14181F'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                  />
                </svg>
              ) : (
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M4 7h16M4 12h16M4 17h16'
                    stroke='#14181F'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mounted &&
          menuOpen &&
          createPortal(
            <div
              className='md:hidden fixed inset-0 z-90 bg-ink/30 animate-[fadeIn_.18s_ease-out]'
              onClick={() => setMenuOpen(false)}
              aria-hidden='true'
            />,
            document.body,
          )}

        <div
          className={`md:hidden absolute left-0 right-0 top-full z-40 grid overflow-hidden border-b border-line bg-white shadow-[0_16px_32px_-16px_rgba(20,24,31,0.25)] transition-[grid-template-rows,opacity] duration-300 ease-out ${
            menuOpen
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className='min-h-0 overflow-hidden'>
            <nav
              className={`transition-transform duration-300 ease-out ${
                menuOpen ? 'translate-y-0' : '-translate-y-2'
              }`}
            >
              <ul className='max-w-[1240px] mx-auto px-4 sm:px-8 py-2 flex flex-col'>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block py-3.5 text-[15px] font-semibold border-b border-line ${
                        pathname === item.href ? 'text-forest' : 'text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className='py-4 flex flex-col gap-2.5'>
                  <Link
                    href='/contact'
                    onClick={() => setMenuOpen(false)}
                    className='block text-center bg-forest text-white px-6 py-3 rounded-md text-[14px] font-bold'
                  >
                    Enquire Now
                  </Link>
                  <a
                    href='tel:+918679884419'
                    className='block text-center border border-line text-ink px-6 py-3 rounded-md text-[14px] font-bold'
                  >
                    Call +91 86798 84419
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {mounted &&
          searchOpen &&
          createPortal(
            <div
              className='fixed inset-0 z-200 flex items-start justify-center px-4 pt-24 sm:pt-32 bg-ink/60 animate-[fadeIn_.18s_ease-out]'
              onClick={() => setSearchOpen(false)}
            >
              <div
                role='dialog'
                aria-modal='true'
                aria-label='Search products'
                onClick={(e) => e.stopPropagation()}
                className='w-full max-w-xl bg-white rounded-lg shadow-2xl border border-line p-2 animate-[slideDown_.2s_ease-out]'
              >
                <form
                  onSubmit={submitSearch}
                  className='flex items-center gap-2'
                >
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='ml-3 shrink-0'
                  >
                    <circle
                      cx='11'
                      cy='11'
                      r='7'
                      stroke='#5B6470'
                      strokeWidth='1.8'
                    />
                    <path
                      d='M21 21l-4.3-4.3'
                      stroke='#5B6470'
                      strokeWidth='1.8'
                      strokeLinecap='round'
                    />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type='search'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search by medicine name, salt or category'
                    className='flex-1 py-3.5 text-[15px] bg-transparent focus:outline-none'
                  />
                  <button
                    type='button'
                    aria-label='Close search'
                    onClick={() => setSearchOpen(false)}
                    className='mr-1 w-9 h-9 shrink-0 rounded-md flex items-center justify-center transition-colors hover:bg-bg-soft'
                  >
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M6 6l12 12M18 6L6 18'
                        stroke='#14181F'
                        strokeWidth='1.8'
                        strokeLinecap='round'
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>,
            document.body,
          )}
      </header>
    </>
  )
}
