'use client'

import { useState } from 'react'
import { Product } from '@/lib/products'
import {
  Badge,
  EmptyState,
  IconButton,
  PageHeader,
  SearchInput,
  Segmented,
  Td,
  Th,
} from './ui'
import Thumb from './Thumb'

const STATUS = ['All', 'In Stock', 'Low Stock'] as const

// Display-only SKU built from the product id (sanitised so odd ids never leak into the UI).
export function skuFor(id: number): string {
  const clean = String(id)
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .padEnd(8, '0')
    .slice(0, 8)
  return `GDN-${clean}`
}

export default function InventoryPanel({
  products,
  onAdjust,
}: {
  products: Product[]
  onAdjust: (id: number) => void
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<(typeof STATUS)[number]>('All')

  const q = query.trim().toLowerCase()
  const filtered = products.filter(
    (p) =>
      (status === 'All' || p.stock === status) &&
      (q === '' ||
        p.name.toLowerCase().includes(q) ||
        skuFor(p.id).toLowerCase().includes(q)),
  )
  const totalUnits = products.reduce((s, p) => s + p.stockQty, 0)
  const low = products.filter((p) => p.stock === 'Low Stock').length

  return (
    <div>
      <PageHeader
        title='Inventory'
        subtitle={`${totalUnits.toLocaleString('en-IN')} units across ${products.length} products · ${low} low on stock`}
      />

      <div className='flex flex-col sm:flex-row sm:items-center flex-wrap gap-3 mb-4'>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder='Search product or SKU'
        />
        <Segmented options={STATUS} value={status} onChange={setStatus} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon='search'
          title='No products match'
          text='Try a different search or clear the filter.'
        />
      ) : (
        <div className='bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto shadow-[0_1px_2px_rgba(20,24,31,0.04)]'>
          <table className='w-full min-w-[760px]'>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>SKU</Th>
                <Th>In stock</Th>
                <Th>Reorder level</Th>
                <Th>Status</Th>
                <Th className='text-right'>Adjust</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                // bar fills up to 2x the reorder level, so "low" always reads as a short bar
                const pct = Math.min(
                  100,
                  Math.round((p.stockQty / Math.max(1, p.reorderLevel * 2)) * 100),
                )
                const ok = p.stock === 'In Stock'
                return (
                  <tr key={p.id} className='hover:bg-bg-soft/70 transition-colors'>
                    <Td>
                      <div className='flex items-center gap-3'>
                        <Thumb product={p} size={36} />
                        <span className='font-bold text-navy'>{p.name}</span>
                      </div>
                    </Td>
                    <Td className='font-mono text-[12.5px] text-muted'>
                      {skuFor(p.id)}
                    </Td>
                    <Td>
                      <div className='flex items-center gap-3 min-w-[150px]'>
                        <span className='font-extrabold text-navy tabular-nums w-10'>
                          {p.stockQty}
                        </span>
                        <div className='h-1.5 flex-1 rounded-full bg-[#EBEEEC] overflow-hidden'>
                          <div
                            className={`h-full rounded-full ${ok ? 'bg-forest' : 'bg-[#C0392B]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </Td>
                    <Td className='text-muted tabular-nums'>{p.reorderLevel}</Td>
                    <Td>
                      <Badge tone={ok ? 'green' : 'red'} dot>
                        {p.stock}
                      </Badge>
                    </Td>
                    <Td>
                      <div className='flex justify-end'>
                        <IconButton
                          icon='edit'
                          title='Adjust stock'
                          onClick={() => onAdjust(p.id)}
                        />
                      </div>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
