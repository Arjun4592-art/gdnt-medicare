import Image from 'next/image'
import { Product } from '@/lib/products'
import ProductIcon from '../ProductIcon'

export default function Thumb({ product, size = 40 }: { product: Product; size?: number }) {
  return (
    <div
      className='rounded-lg bg-bg-soft border border-line flex items-center justify-center overflow-hidden shrink-0'
      style={{ width: size, height: size }}
    >
      {product.images.length > 0 ? (
        <Image
          src={product.images[0]}
          alt={product.name}
          width={size}
          height={size}
          className='w-full h-full object-contain'
        />
      ) : (
        <ProductIcon icon={product.icon} className='w-full h-full p-1' />
      )}
    </div>
  )
}
