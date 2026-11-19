'use client'

import { useState } from 'react'
import { Product, priceUnit } from '@/lib/products'
import {
  Badge,
  EmptyState,
  IconButton,
  PageHeader,
  PrimaryButton,
  SearchInput,
  Segmented,
  Td,
  Th,
} from './ui'
import Thumb from './Thumb'

const STATUS = ['All', 'In Stock', 'Low Stock'] as const

export default function ProductsPanel({
  products,
  onDelete,
  onEdit,
  onAdd,
}: {
  products: Product[]
  onDelete: (id: number) => void
  onEdit: (p: Product) => void
  onAdd: () => void
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState<(typeof STATUS)[number]>('All')

  const categories = Array.from(new Set(products.map((p) => p.cat))).sort()

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase()
    const matchesQuery =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q) ||
      p.salt.toLowerCase().includes(q)
    return (
      matchesQuery &&
      (category === 'All' || p.cat === category) &&
      (status === 'All' || p.stock === status)
    )
  })

  return (
    <div>
      <PageHeader
        title='Products'
        subtitle='Add, edit and manage everything in your catalog.'
        actions={
          <PrimaryButton icon='plus' onClick={onAdd}>
            Add product
          </PrimaryButton>
        }
      />

      <div className='flex flex-col sm:flex-row sm:items-center flex-wrap gap-3 mb-4'>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder='Search name, category or salt'
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label='Filter by category'
          className='border border-line rounded-lg px-3.5 py-2.5 text-[13px] font-semibold text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/25 focus:border-forest w-fit'
        >
          <option value='All'>All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Segmented options={STATUS} value={status} onChange={setStatus} />
        <span className='text-[12.5px] text-muted font-semibold sm:ml-auto'>
          Showing {filtered.length} of {products.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon='search'
          title='No products match'
          text='Try a different search or clear the filters.'
        />
      ) : (
        <div className='bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto shadow-[0_1px_2px_rgba(20,24,31,0.04)]'>
          <table className='w-full min-w-[820px]'>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Category</Th>
                <Th>Form</Th>
                <Th>MRP</Th>
                <Th>Stock</Th>
                <Th className='text-right'>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className='hover:bg-bg-soft/70 transition-colors'>
                  <Td>
                    <div className='flex items-center gap-3'>
                      <Thumb product={p} />
                      <div className='min-w-0'>
                        <div className='font-bold text-navy truncate max-w-[260px]'>
                          {p.name}
                        </div>
                        <div className='text-[11.5px] text-muted truncate max-w-[260px]'>
                          {p.pack} · {p.salt}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge tone='navy'>{p.cat}</Badge>
                  </Td>
                  <Td className='text-muted'>{p.type}</Td>
                  <Td>
                    <span className='font-extrabold text-navy'>
                      ₹{p.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className='block text-[11px] text-muted'>
                      per {priceUnit(p.type)}
                    </span>
                  </Td>
                  <Td>
                    <div className='flex items-center gap-2.5'>
                      <span className='font-bold text-navy tabular-nums'>
                        {p.stockQty}
                      </span>
                      <Badge tone={p.stock === 'In Stock' ? 'green' : 'red'} dot>
                        {p.stock}
                      </Badge>
                    </div>
                  </Td>
                  <Td>
                    <div className='flex gap-2 justify-end'>
                      <IconButton icon='edit' title='Edit' onClick={() => onEdit(p)} />
                      <IconButton
                        icon='trash'
                        title='Delete'
                        tone='danger'
                        onClick={() => onDelete(p.id)}
                      />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
