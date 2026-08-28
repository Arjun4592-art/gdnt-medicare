'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close the mobile menu / search whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  // Close search modal on Escape, and lock body scroll while it's open.
  useEffect(() => {
    if (!searchOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSearchOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [searchOpen])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setSearchOpen(false)
    setMenuOpen(false)
    setQuery('')
  }

  return (
    <header className='sticky top-0 z-100 bg-white/92 backdrop-blur-md border-b border-line'>
      <div className='max-w-[1240px] mx-auto px-4 sm:px-8 flex items-center justify-between h-20 gap-3'>
        <Link href='/' className='flex items-center gap-2.5 shrink-0'>
          <Image
            src='/logo.png'
            alt='GDNT Medicare logo'
            width={42}
            height={42}
            className='h-[42px] w-auto'
          />
          <div className='leading-tight hidden md:block'>
            <span className='block font-extrabold text-[17px] text-navy'>
              GDNT Medicare
            </span>
            <span className='block text-[9px] tracking-wider uppercase text-forest font-bold'>
              Pvt. Ltd.
            </span>
          </div>
        </Link>

        <nav className='hidden md:block'>
          <ul className='flex gap-9'>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm font-semibold py-1.5 relative transition-colors hover:text-forest ${
                    pathname === item.href ? 'text-forest' : 'text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='flex items-center gap-2 sm:gap-4'>
          <button
            type='button'
            aria-label='Search'
            onClick={() => setSearchOpen(true)}
            className='flex w-10 h-10 shrink-0 rounded-full bg-bg-soft items-center justify-center transition-colors hover:bg-forest-pale'
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
            className='hidden sm:inline-block bg-forest text-white px-6 py-3 rounded-lg text-[13px] font-bold transition-transform hover:-translate-y-0.5 shadow-sm'
          >
            Enquire Now
          </Link>

          <button
            type='button'
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className='md:hidden flex w-10 h-10 shrink-0 rounded-full bg-bg-soft items-center justify-center transition-colors hover:bg-forest-pale'
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

      <div
        className={`md:hidden grid overflow-hidden border-b border-line bg-white transition-[grid-template-rows,opacity] duration-300 ease-out ${
          menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className='min-h-0 overflow-hidden'>
          <nav
            className={`transition-transform duration-300 ease-out ${
              menuOpen ? 'translate-y-0' : '-translate-y-2'
            }`}
          >
            <ul className='max-w-[1240px] mx-auto px-4 sm:px-8 py-3 flex flex-col'>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 text-[15px] font-semibold border-b border-line last:border-b-0 ${
                      pathname === item.href ? 'text-forest' : 'text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className='pt-3'>
                <Link
                  href='/contact'
                  onClick={() => setMenuOpen(false)}
                  className='block text-center bg-forest text-white px-6 py-3 rounded-lg text-[13px] font-bold shadow-sm'
                >
                  Enquire Now
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {searchOpen && (
        <div
          className='fixed inset-0 z-200 flex items-start justify-center px-4 pt-24 sm:pt-32 bg-ink/50 backdrop-blur-sm animate-[fadeIn_.18s_ease-out]'
          onClick={() => setSearchOpen(false)}
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-label='Search products'
            onClick={(e) => e.stopPropagation()}
            className='w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-line p-2 animate-[slideDown_.2s_ease-out]'
          >
            <form onSubmit={submitSearch} className='flex items-center gap-2'>
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
                placeholder='Search products...'
                className='flex-1 py-3.5 text-[15px] bg-transparent focus:outline-none'
              />
              <button
                type='button'
                aria-label='Close search'
                onClick={() => setSearchOpen(false)}
                className='mr-1 w-9 h-9 shrink-0 rounded-full bg-bg-soft flex items-center justify-center transition-colors hover:bg-forest-pale'
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
        </div>
      )}
    </header>
  )
}
