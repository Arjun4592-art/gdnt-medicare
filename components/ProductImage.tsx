'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductIcon as IconType } from '@/lib/products'
import ProductIcon from './ProductIcon'

export default function ProductImage({
  src,
  alt,
  icon,
}: {
  src: string | undefined
  alt: string
  icon: IconType
}) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'error',
  )

  if (status === 'error' || !src) {
    return (
      <div className='w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.1]'>
        <ProductIcon
          icon={icon}
          className='w-[64px] h-[64px] drop-shadow-[0_10px_18px_rgba(20,24,31,0.15)]'
        />
      </div>
    )
  }

  return (
    <>
      {status === 'loading' && (
        <div className='absolute inset-0 animate-pulse bg-gradient-to-br from-line/60 via-bg-soft to-line/60' />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes='(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 300px'
        className={`object-cover transition-all duration-500 group-hover:scale-[1.08] ${
          status === 'loading' ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </>
  )
}
