'use client'

import { useState } from 'react'
import { Product, getDiscountPercent } from '@/lib/products'

export default function CategoriesPanel({ products }: { products: Product[] }) {
  const byCategory = products.reduce<Record<string, Product[]>>((acc, p) => {
    ;(acc[p.cat] ||= []).push(p)
    return acc
  }, {})

  const rows = Object.entries(byCategory)
    .map(([cat, items]) => {
      const avgPrice = items.reduce((s, p) => s + p.price, 0) / items.length
      const lowStock = items.filter((p) => p.stock === 'Low Stock').length
      const onDiscount = items.filter(
        (p) => getDiscountPercent(p.price, p.mrp) > 0,
      ).length
      return { cat, count: items.length, avgPrice, lowStock, onDiscount, items }
    })
    .sort((a, b) => b.count - a.count)

  const [selected, setSelected] = useState<string | null>(rows[0]?.cat ?? null)
  const active = rows.find((r) => r.cat === selected) ?? null

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-navy'>Categories</h1>
        <p className='text-[13.5px] text-muted mt-1'>
          Every category currently in your catalog, at a glance.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className='bg-white border border-line rounded-2xl p-12 text-center text-[13.5px] text-muted'>
          No products yet — categories will show up here once you add some.
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-5 items-start'>
          {/* Category list — click a row to see its data */}
          <div className='bg-white border border-line rounded-2xl overflow-hidden'>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left text-[11px] uppercase tracking-wide text-muted font-semibold px-6 py-3 border-b border-line'>
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.cat}
                    onClick={() => setSelected(r.cat)}
                    className={`cursor-pointer transition-colors border-b border-line last:border-b-0 ${
                      selected === r.cat ? 'bg-forest-pale' : 'hover:bg-bg-soft'
                    }`}
                  >
                    <td
                      className={`px-6 py-3.5 text-[13.5px] font-bold ${
                        selected === r.cat ? 'text-forest' : 'text-navy'
                      }`}
                    >
                      {r.cat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected category's data */}
          {active && (
            <div className='bg-white border border-line rounded-2xl p-6'>
              <div className='flex items-start justify-between mb-5'>
                <h3 className='font-extrabold text-navy text-[17px]'>
                  {active.cat}
                </h3>
                <span className='text-[11px] font-bold px-2.5 py-1 rounded-full bg-forest-pale text-forest whitespace-nowrap'>
                  {active.count} {active.count === 1 ? 'product' : 'products'}
                </span>
              </div>

              <div className='grid grid-cols-3 gap-4 mb-6'>
                <Stat
                  label='Avg. Price'
                  value={`₹${active.avgPrice.toFixed(0)}`}
                />
                <Stat
                  label='On Discount'
                  value={`${active.onDiscount} / ${active.count}`}
                />
                <Stat
                  label='Low Stock'
                  value={String(active.lowStock)}
                  valueClass={
                    active.lowStock > 0 ? 'text-[#C0392B]' : 'text-forest'
                  }
                />
              </div>

              <div className='border border-line rounded-xl overflow-hidden overflow-x-auto'>
                <table className='w-full min-w-[480px]'>
                  <thead>
                    <tr>
                      {['Product', 'Price', 'Status'].map((h) => (
                        <th
                          key={h}
                          className='text-left text-[11px] uppercase tracking-wide text-muted font-semibold px-5 py-2.5 border-b border-line'
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {active.items.map((p) => (
                      <tr
                        key={p.id}
                        className='hover:bg-bg-soft transition-colors'
                      >
                        <td className='px-5 py-3 text-[13px] font-bold text-navy border-b border-line last:border-b-0'>
                          {p.name}
                        </td>
                        <td className='px-5 py-3 text-[13px] border-b border-line last:border-b-0'>
                          ₹{p.price}
                        </td>
                        <td className='px-5 py-3 border-b border-line last:border-b-0'>
                          <span
                            className='text-[11px] font-bold px-2.5 py-1 rounded-full'
                            style={{
                              color:
                                p.stock === 'In Stock' ? '#0F6E4E' : '#C0392B',
                              background:
                                p.stock === 'In Stock' ? '#E7F5EE' : '#FBEAE8',
                            }}
                          >
                            {p.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  valueClass = 'text-navy',
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className='bg-bg-soft rounded-lg px-3.5 py-3'>
      <div className='text-[11px] text-muted font-semibold mb-1'>{label}</div>
      <div className={`text-[16px] font-extrabold ${valueClass}`}>{value}</div>
    </div>
  )
}
