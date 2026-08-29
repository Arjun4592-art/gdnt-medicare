import Link from 'next/link'
import { Product, getDiscountPercent } from '@/lib/products'
import ProductImage from '@/components/ProductImage'
import Stars from './Stars'
import Reveal from './Reveal'

export default function ProductCard({
  product,
  delay = 0,
}: {
  product: Product
  delay?: number
}) {
  const discount = getDiscountPercent(product.price, product.mrp)
  return (
    <Reveal delay={delay}>
      <div className='group bg-white border border-line/70 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-transparent hover:shadow-[0_30px_54px_-22px_rgba(20,24,31,0.22)]'>
        <div className='aspect-[4/3] bg-gradient-to-br from-bg-soft to-white flex items-center justify-center relative overflow-hidden'>
          <span
            className='absolute top-3 left-3 z-10 bg-white/95 backdrop-blur text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-[0_4px_10px_-4px_rgba(20,24,31,0.25)] tracking-wide'
            style={{ color: product.tagColor }}
          >
            {product.cat}
          </span>
          {discount > 0 && (
            <span className='absolute bottom-3 left-3 z-10 bg-gradient-to-r from-gold to-[#B07F2A] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-[0_4px_10px_-4px_rgba(199,154,72,0.5)]'>
              {discount}% OFF
            </span>
          )}
          <button
            aria-label='Save'
            className='absolute top-3 right-3 z-10 w-[30px] h-[30px] rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-[0_4px_10px_-4px_rgba(20,24,31,0.25)] transition-all hover:scale-110 hover:bg-forest-pale'
          >
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
              <path
                d='M12 21s-7.5-4.6-10-9.2C.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.4C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.8C19.5 16.4 12 21 12 21z'
                stroke='#5B6470'
                strokeWidth='1.6'
              />
            </svg>
          </button>
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            icon={product.icon}
          />
          {/* subtle vignette on hover */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400' />
        </div>
        <div className='p-[18px] pb-3'>
          <div className='text-[10px] text-gold font-extrabold uppercase tracking-wide'>
            {product.type} · {product.pack}
          </div>
          <h4 className='text-base font-extrabold mt-1.5 text-navy leading-snug line-clamp-1'>
            {product.name}
          </h4>
          <div className='text-[12.5px] text-muted mt-1 line-clamp-1'>
            {product.desc}
          </div>
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
        <div className='flex items-center justify-between px-[18px] py-3.5 border-t border-line/70 bg-bg-soft/40'>
          <div className='leading-tight'>
            <div className='font-extrabold text-navy text-lg'>
              ₹{product.price}
            </div>
            {discount > 0 && (
              <div className='flex items-center gap-1.5 mt-0.5'>
                <span className='text-[11px] text-muted font-semibold line-through'>
                  ₹{product.mrp}
                </span>
                <span className='text-[11px] text-forest font-bold'>
                  {discount}% off
                </span>
              </div>
            )}
          </div>
          <Link
            href={`/product/${product.id}`}
            className='bg-forest-pale text-forest text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all group-hover:bg-forest group-hover:text-white group-hover:shadow-[0_10px_20px_-10px_rgba(15,110,78,0.5)]'
          >
            View Details
            <svg
              viewBox='0 0 16 16'
              fill='none'
              className='w-3 h-3 transition-transform group-hover:translate-x-1'
            >
              <path
                d='M2 8h11M9 4l4 4-4 4'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
              />
            </svg>
          </Link>
        </div>
      </div>
    </Reveal>
  )
}
