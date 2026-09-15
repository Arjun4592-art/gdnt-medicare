'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductIcon from './ProductIcon'
import { ProductIcon as IconType } from '@/lib/products'

export default function ProductGallery({
  images,
  icon,
  name,
}: {
  images: string[]
  icon: IconType
  name: string
}) {
  const [failed, setFailed] = useState<Set<number>>(new Set())
  const [active, setActive] = useState(0)
  const [mainLoaded, setMainLoaded] = useState(false)

  const valid = images
    .map((src, i) => ({ src, i }))
    .filter(({ i }) => !failed.has(i))
  const hasImages = valid.length > 0
  const current = hasImages
    ? (valid.find((v) => v.i === active) ?? valid[0])
    : null

  function markFailed(i: number) {
    setFailed((prev) => {
      const next = new Set(prev)
      next.add(i)
      return next
    })
  }

  return (
    <div>
      <div className='relative h-[280px] sm:h-[380px] lg:h-[440px] rounded-2xl bg-gradient-to-br from-bg-soft to-white mb-3.5 overflow-hidden ring-1 ring-line/70 flex items-center justify-center'>
        {current ? (
          <>
            {!mainLoaded && (
              <div className='absolute inset-0 animate-pulse bg-gradient-to-br from-line/50 via-bg-soft to-line/50' />
            )}
            <Image
              key={current.src}
              src={current.src}
              alt={name}
              fill
              priority
              className={`object-contain p-6 sm:p-10 transition-opacity duration-500 ${
                mainLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setMainLoaded(true)}
              onError={() => markFailed(current.i)}
            />
          </>
        ) : (
          <ProductIcon
            icon={icon}
            className='w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] drop-shadow-[0_16px_26px_rgba(20,24,31,0.12)]'
          />
        )}
      </div>

      {hasImages ? (
        <div className='flex gap-2.5 overflow-x-auto pb-1'>
          {valid.map(({ src, i }) => (
            <button
              key={src}
              onClick={() => {
                setActive(i)
                setMainLoaded(false)
              }}
              className={`relative w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] shrink-0 rounded-xl bg-bg-soft border-2 overflow-hidden cursor-pointer transition-colors ${
                current?.i === i
                  ? 'border-forest'
                  : 'border-transparent hover:border-forest/50'
              }`}
            >
              <Image
                src={src}
                alt={`${name} thumbnail`}
                fill
                className='object-cover'
                onError={() => markFailed(i)}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className='flex gap-2.5'>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-xl bg-bg-soft border-2 flex items-center justify-center ${
                i === 0 ? 'border-forest' : 'border-transparent'
              }`}
            >
              <ProductIcon icon={icon} className='w-7 h-7 sm:w-8 sm:h-8' />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
