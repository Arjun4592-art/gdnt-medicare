'use client'

import { useState } from 'react'
import { Product } from '@/lib/products'

const TABS = ['Description', 'Usage & Dosage', 'Safety Info'] as const

const FALLBACK: Record<(typeof TABS)[number], string> = {
  Description: 'No description has been added for this product yet.',
  'Usage & Dosage':
    'Dosage should be determined by a registered medical practitioner based on patient condition, age, and severity. This information is provided for trade reference only and is not a substitute for professional medical advice.',
  'Safety Info':
    'Keep out of reach of children. Do not use beyond the expiry date printed on the pack. Report any adverse reactions to your supervising physician. Full prescribing information is available on request.',
}

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof TABS)[number]>('Description')

  const content: Record<(typeof TABS)[number], string> = {
    Description: product.desc || FALLBACK.Description,
    'Usage & Dosage': product.usageDosage || FALLBACK['Usage & Dosage'],
    'Safety Info': product.safetyInfo || FALLBACK['Safety Info'],
  }

  return (
    <div>
      <div className='flex gap-6 sm:gap-8 border-b border-line overflow-x-auto whitespace-nowrap'>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3.5 text-[13px] sm:text-sm font-bold relative transition-colors shrink-0 ${
              active === tab ? 'text-forest' : 'text-muted hover:text-navy'
            }`}
          >
            {tab}
            {active === tab && (
              <span className='absolute -bottom-px left-0 right-0 h-0.5 bg-forest' />
            )}
          </button>
        ))}
      </div>
      <div className='py-6 sm:py-8 text-[14px] sm:text-[14.5px] leading-relaxed text-muted max-w-[700px] whitespace-pre-line'>
        {content[active]}
      </div>
    </div>
  )
}
