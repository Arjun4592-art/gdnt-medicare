'use client'

import { Product } from '@/lib/products'
import { Enquiry } from '@/lib/enquiries'
import { Badge, Card, KpiCard, PageHeader, Td, Th } from './ui'
import Thumb from './Thumb'

export default function OverviewPanel({
  enquiries,
  products,
  categoryCount,
  onOpenEnquiry,
  onGo,
}: {
  enquiries: Enquiry[]
  products: Product[]
  categoryCount: number
  onOpenEnquiry: (id: number) => void
  onGo: (panel: 'products' | 'inventory' | 'enquiries' | 'categories') => void
}) {
  const lowStock = products.filter((p) => p.stock === 'Low Stock')
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length

  const byCategory = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => {
      acc[p.cat] = (acc[p.cat] || 0) + 1
      return acc
    }, {}),
  ).sort((a, b) => b[1] - a[1])
  const maxCat = byCategory[0]?.[1] ?? 1

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <PageHeader
        title='Dashboard'
        subtitle={`${greeting} — here's a snapshot of your catalog and enquiries.`}
      />

      <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6'>
        <KpiCard
          label='Products'
          value={String(products.length)}
          hint='Live in catalog'
          icon='products'
          onClick={() => onGo('products')}
        />
        <KpiCard
          label='Categories'
          value={String(categoryCount)}
          hint='Manage categories'
          icon='categories'
          tone='navy'
          onClick={() => onGo('categories')}
        />
        <KpiCard
          label='Low stock'
          value={String(lowStock.length)}
          hint={lowStock.length > 0 ? 'Needs restocking' : 'All stocked up'}
          icon='inventory'
          tone={lowStock.length > 0 ? 'red' : 'green'}
          onClick={() => onGo('inventory')}
        />
        <KpiCard
          label='New enquiries'
          value={String(newEnquiries)}
          hint={newEnquiries > 0 ? 'Awaiting your reply' : 'Inbox is clear'}
          icon='enquiries'
          tone={newEnquiries > 0 ? 'amber' : 'green'}
          onClick={() => onGo('enquiries')}
        />
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 mb-5'>
        <Card
          title='Recent enquiries'
          flush
          action={
            enquiries.length > 0 && (
              <button
                onClick={() => onGo('enquiries')}
                className='text-[12.5px] font-bold text-forest hover:underline'
              >
                View all →
              </button>
            )
          }
        >
          {enquiries.length === 0 ? (
            <p className='px-6 py-10 text-[13.5px] text-muted text-center'>
              No enquiries yet.
            </p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[480px]'>
                <thead>
                  <tr>
                    {['Name', 'Product', 'Date', 'Status'].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enquiries.slice(0, 5).map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => onOpenEnquiry(e.id)}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                          ev.preventDefault()
                          onOpenEnquiry(e.id)
                        }
                      }}
                      tabIndex={0}
                      role='link'
                      title='Open this enquiry'
                      className='hover:bg-bg-soft transition-colors cursor-pointer focus:outline-none focus-visible:bg-bg-soft'
                    >
                      <Td className='font-bold text-navy'>{e.name}</Td>
                      <Td>{e.product}</Td>
                      <Td className='text-muted'>{e.date}</Td>
                      <Td>
                        <Badge tone={e.status === 'New' ? 'green' : 'gray'} dot>
                          {e.status}
                        </Badge>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card
          title='Needs restocking'
          action={
            lowStock.length > 0 && (
              <button
                onClick={() => onGo('inventory')}
                className='text-[12.5px] font-bold text-forest hover:underline'
              >
                Open inventory →
              </button>
            )
          }
        >
          {lowStock.length === 0 ? (
            <p className='text-[13.5px] text-muted py-6 text-center'>
              Every product is above its reorder level.
            </p>
          ) : (
            <ul className='space-y-3.5'>
              {lowStock.slice(0, 5).map((p) => (
                <li key={p.id} className='flex items-center gap-3'>
                  <Thumb product={p} size={38} />
                  <div className='min-w-0 flex-1'>
                    <div className='text-[13.5px] font-bold text-navy truncate'>
                      {p.name}
                    </div>
                    <div className='text-[11.5px] text-muted'>
                      Reorder at {p.reorderLevel}
                    </div>
                  </div>
                  <Badge tone='red'>{p.stockQty} left</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title='Products by category'>
        {byCategory.length === 0 ? (
          <p className='text-[13.5px] text-muted'>No products yet.</p>
        ) : (
          <ul className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3.5'>
            {byCategory.slice(0, 8).map(([cat, n]) => (
              <li key={cat}>
                <div className='flex justify-between text-[13px] mb-1.5'>
                  <span className='font-bold text-navy'>{cat}</span>
                  <span className='text-muted font-semibold'>{n}</span>
                </div>
                <div className='h-2 rounded-full bg-[#EBEEEC] overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-forest'
                    style={{ width: `${(n / maxCat) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
