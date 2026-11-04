import Link from 'next/link'
import { Product, getDiscountPercent } from '@/lib/products'
import ProductImage from '@/components/ProductImage'
import Reveal from '@/components/Reveal'

export default function ProductCard({
  product,
  delay = 0,
}: {
  product: Product
  /** ms, to stagger cards as they scroll into view */
  delay?: number
}) {
  const discount = getDiscountPercent(product.price, product.mrp)
  const lowStock = product.stock === 'Low Stock'

  return (
    <Reveal delay={delay} className='h-full'>
      <article className='group flex h-full flex-col bg-white border border-line rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-forest/60 hover:shadow-[0_20px_36px_-20px_rgba(20,24,31,0.3)]'>
        <Link
          href={`/product/${product.id}`}
          className='relative block aspect-[4/3] bg-bg-soft overflow-hidden'
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            icon={product.icon}
          />
          {discount > 0 && (
            <span className='absolute top-0 left-0 bg-forest text-white text-[11px] font-bold px-2.5 py-1'>
              {discount}% OFF
            </span>
          )}
        </Link>

        <div className='flex flex-1 flex-col p-4'>
          <div className='text-[11.5px] font-semibold text-muted uppercase tracking-[0.04em]'>
            {product.cat}
          </div>
          <h3 className='mt-1 text-[16px] font-bold text-navy leading-snug line-clamp-1'>
            <Link href={`/product/${product.id}`} className='hover:text-forest'>
              {product.name}
            </Link>
          </h3>
          {/* Composition is what prescribers look at first */}
          <p className='mt-1 text-[13px] text-muted leading-snug line-clamp-2 min-h-[36px]'>
            {product.salt || product.desc}
          </p>

          <div className='mt-3 flex items-center gap-2 text-[12px] text-ink'>
            <span className='border border-line rounded px-2 py-0.5'>
              {product.type}
            </span>
            <span className='border border-line rounded px-2 py-0.5'>
              {product.pack}
            </span>
            <span
              className={`ml-auto font-semibold ${
                lowStock ? 'text-[#a8741f]' : 'text-forest'
              }`}
            >
              {product.stock}
            </span>
          </div>

          <div className='mt-4 pt-4 border-t border-line flex items-end justify-between gap-3'>
            <div className='leading-tight'>
              <div className='text-[19px] font-bold text-navy'>
                ₹{product.price}
              </div>
              {discount > 0 && (
                <div className='mt-0.5 text-[12px] text-muted'>
                  MRP <span className='line-through'>₹{product.mrp}</span>
                </div>
              )}
            </div>
            <Link
              href={`/product/${product.id}`}
              className='shrink-0 border border-forest text-forest text-[13px] font-bold px-4 py-2 rounded-md transition-colors group-hover:bg-forest group-hover:text-white'
            >
              View details
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  )
}
