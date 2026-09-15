'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Product, CATEGORIES } from '@/lib/products'
import ProductCard from './ProductCard'

const FORMS = ['Tablets', 'Capsules', 'Syrup', 'Ointment']

export default function ShopFilters({ products }: { products: Product[] }) {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [categories, setCategories] = useState<string[]>([])
  const [availability, setAvailability] = useState<string[]>([])
  const [forms, setForms] = useState<string[]>([])
  const [sort, setSort] = useState('Featured')
  const [query, setQuery] = useState(initialQuery)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Keep the search box in sync if the ?q= param changes (e.g. header search again).
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  // Lock page scroll while the mobile filter drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileFiltersOpen])

  function toggle(
    list: string[],
    setList: (v: string[]) => void,
    value: string,
  ) {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    )
  }

  // Only offer categories that actually exist in the live product data, falling
  // back to the suggested list if the store hasn't been stocked yet.
  const activeCategories = useMemo(() => {
    const inData = Array.from(new Set(products.map((p) => p.cat))).sort()
    return inData.length > 0 ? inData : CATEGORIES
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = products.filter((p) => {
      if (categories.length > 0 && !categories.includes(p.cat)) return false
      if (availability.length > 0 && !availability.includes(p.stock))
        return false
      if (forms.length > 0 && !forms.includes(p.type)) return false
      if (q) {
        const haystack = `${p.name} ${p.cat} ${p.type} ${p.salt}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })

    if (sort === 'Price: Low to High')
      list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'Price: High to Low')
      list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'Rating') list = [...list].sort((a, b) => b.rating - a.rating)

    return list
  }, [products, categories, availability, forms, sort, query])

  const anyFilterActive =
    categories.length > 0 ||
    availability.length > 0 ||
    forms.length > 0 ||
    query.trim().length > 0

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...categories.map((c) => ({
      label: c,
      onRemove: () => toggle(categories, setCategories, c),
    })),
    ...availability.map((a) => ({
      label: a,
      onRemove: () => toggle(availability, setAvailability, a),
    })),
    ...forms.map((f) => ({
      label: f,
      onRemove: () => toggle(forms, setForms, f),
    })),
    ...(query.trim()
      ? [{ label: `"${query.trim()}"`, onRemove: () => setQuery('') }]
      : []),
  ]

  return (
    <div className='max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-9 items-start'>
      {/* Backdrop for the mobile filter drawer */}
      {mobileFiltersOpen && (
        <div
          onClick={() => setMobileFiltersOpen(false)}
          className='fixed inset-0 bg-navy/50 backdrop-blur-[2px] z-40 lg:hidden'
        />
      )}

      <aside
        className={`bg-bg-soft border border-line p-6 w-[86%] max-w-[320px] overflow-y-auto
          fixed inset-y-0 left-0 z-50 rounded-none transition-transform duration-300 ease-out
          ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:sticky lg:z-auto lg:w-full lg:max-w-none lg:rounded-2xl lg:top-24 lg:translate-x-0`}
      >
        <div className='flex items-center justify-between mb-5 pb-5 border-b border-line'>
          <div className='flex items-center gap-2'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
              <path
                d='M4 6h16M7 12h10M10 18h4'
                stroke='#0F6E4E'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
            <h4 className='text-[14px] font-extrabold text-navy'>Filters</h4>
          </div>
          <div className='flex items-center gap-3.5'>
            {anyFilterActive && (
              <button
                onClick={() => {
                  setCategories([])
                  setAvailability([])
                  setForms([])
                  setQuery('')
                }}
                className='text-[11px] font-bold text-forest hover:underline'
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              aria-label='Close filters'
              className='lg:hidden w-7 h-7 flex items-center justify-center rounded-full hover:bg-white text-muted hover:text-navy transition-colors -mr-1'
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M6 6l12 12M18 6L6 18'
                  stroke='currentColor'
                  strokeWidth='2.2'
                  strokeLinecap='round'
                />
              </svg>
            </button>
          </div>
        </div>

        <div className='mb-5 pb-5 border-b border-line/70'>
          <h5 className='text-[11px] font-extrabold text-muted uppercase tracking-wide mb-3'>
            Category
          </h5>
          <label className='flex items-center gap-2.5 text-[13.5px] text-muted px-2 py-2 rounded-lg cursor-pointer hover:bg-white hover:text-navy transition-colors'>
            <input
              type='checkbox'
              checked={categories.length === 0}
              onChange={() => setCategories([])}
              className='accent-forest w-[15px] h-[15px] shrink-0'
            />
            All Products
          </label>
          {activeCategories.map((c) => (
            <label
              key={c}
              className='flex items-center gap-2.5 text-[13.5px] text-muted px-2 py-2 rounded-lg cursor-pointer hover:bg-white hover:text-navy transition-colors'
            >
              <input
                type='checkbox'
                checked={categories.includes(c)}
                onChange={() => toggle(categories, setCategories, c)}
                className='accent-forest w-[15px] h-[15px] shrink-0'
              />
              {c}
            </label>
          ))}
        </div>

        <div className='mb-5 pb-5 border-b border-line/70'>
          <h5 className='text-[11px] font-extrabold text-muted uppercase tracking-wide mb-3'>
            Availability
          </h5>
          {['In Stock', 'Low Stock'].map((a) => (
            <label
              key={a}
              className='flex items-center gap-2.5 text-[13.5px] text-muted px-2 py-2 rounded-lg cursor-pointer hover:bg-white hover:text-navy transition-colors'
            >
              <input
                type='checkbox'
                checked={availability.includes(a)}
                onChange={() => toggle(availability, setAvailability, a)}
                className='accent-forest w-[15px] h-[15px] shrink-0'
              />
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  a === 'In Stock' ? 'bg-forest' : 'bg-gold'
                }`}
              />
              {a}
            </label>
          ))}
        </div>

        <div>
          <h5 className='text-[11px] font-extrabold text-muted uppercase tracking-wide mb-3'>
            Form
          </h5>
          {FORMS.map((f) => (
            <label
              key={f}
              className='flex items-center gap-2.5 text-[13.5px] text-muted px-2 py-2 rounded-lg cursor-pointer hover:bg-white hover:text-navy transition-colors'
            >
              <input
                type='checkbox'
                checked={forms.includes(f)}
                onChange={() => toggle(forms, setForms, f)}
                className='accent-forest w-[15px] h-[15px] shrink-0'
              />
              {f}
            </label>
          ))}
        </div>
      </aside>

      <div>
        <div className='relative mb-4'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            className='absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none'
          >
            <circle cx='11' cy='11' r='7' stroke='#8A8F98' strokeWidth='1.8' />
            <path
              d='M21 21l-4.3-4.3'
              stroke='#8A8F98'
              strokeWidth='1.8'
              strokeLinecap='round'
            />
          </svg>
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search products by name, category, or salt...'
            className='w-full border border-line rounded-xl pl-11 pr-3.5 py-3 text-[13.5px] bg-white shadow-[0_1px_2px_rgba(20,24,31,0.04)] focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest/40 transition-shadow'
          />
        </div>

        {activeChips.length > 0 && (
          <div className='flex flex-wrap items-center gap-2 mb-4'>
            {activeChips.map((chip, i) => (
              <button
                key={`${chip.label}-${i}`}
                onClick={chip.onRemove}
                className='inline-flex items-center gap-1.5 bg-forest-pale text-forest text-[12px] font-bold pl-3 pr-2 py-1.5 rounded-full hover:bg-forest hover:text-white transition-colors'
              >
                {chip.label}
                <svg width='10' height='10' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M6 6l12 12M18 6L6 18'
                    stroke='currentColor'
                    strokeWidth='2.4'
                    strokeLinecap='round'
                  />
                </svg>
              </button>
            ))}
          </div>
        )}

        <div className='flex justify-between items-start gap-3 mb-6'>
          <div className='flex flex-col items-start gap-2'>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className='lg:hidden inline-flex items-center gap-2 border border-line rounded-lg px-3.5 py-2.5 text-[13px] font-bold text-navy bg-white hover:border-forest/40 transition-colors'
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M4 6h16M7 12h10M10 18h4'
                  stroke='#0F6E4E'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
              Filters
              {activeChips.length > 0 && (
                <span className='inline-flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-forest text-white text-[10px] font-bold'>
                  {activeChips.length}
                </span>
              )}
            </button>
            <div className='text-[13.5px] text-muted'>
              Showing{' '}
              <span className='font-bold text-navy'>{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'product' : 'products'}
            </div>
          </div>
          <div className='relative'>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className='appearance-none border border-line rounded-lg pl-3.5 pr-9 py-2.5 text-[13px] font-semibold text-navy bg-white cursor-pointer hover:border-forest/40 transition-colors focus:outline-none focus:ring-2 focus:ring-forest/30'
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
            <svg
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='none'
              className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
            >
              <path
                d='M6 9l6 6 6-6'
                stroke='#5B6470'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
          {filtered.length === 0 ? (
            <div className='col-span-full flex flex-col items-center justify-center text-center py-20 text-muted text-sm bg-bg-soft rounded-2xl border border-line'>
              <svg
                width='40'
                height='40'
                viewBox='0 0 24 24'
                fill='none'
                className='mb-3 opacity-40'
              >
                <circle
                  cx='11'
                  cy='11'
                  r='7'
                  stroke='#5B6470'
                  strokeWidth='1.6'
                />
                <path
                  d='M21 21l-4.3-4.3'
                  stroke='#5B6470'
                  strokeWidth='1.6'
                  strokeLinecap='round'
                />
              </svg>
              No products match these filters.
              <button
                onClick={() => {
                  setCategories([])
                  setAvailability([])
                  setForms([])
                  setQuery('')
                }}
                className='mt-3 text-forest font-bold text-[12.5px] hover:underline'
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={(i % 6) * 60} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
