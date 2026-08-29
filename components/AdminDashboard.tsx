'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product, getDiscountPercent } from '@/lib/products'
import { Enquiry } from '@/lib/enquiries'
import {
  getAllProductsAdmin,
  deleteProduct as deleteProductAction,
  adjustStock,
} from '@/lib/actions/products'
import { getEnquiries, markResponded } from '@/lib/actions/enquiries'
import { logout } from '@/lib/actions/auth'
import ProductIcon from './ProductIcon'
import ProductFormPage from './ProductFormPage'
import AnalyticsPanel from './AnalyticsPanel'
import CategoriesPanel from './CategoriesPanel'

type Panel =
  | 'overview'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'enquiries'
  | 'analytics'

const NAV: { id: Panel; label: string; d: string }[] = [
  {
    id: 'overview',
    label: 'Overview',
    d: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  },
  { id: 'products', label: 'Products', d: 'M5 9.5h14v5H5z' },
  {
    id: 'categories',
    label: 'Categories',
    d: 'M4 6h7v7H4zM13 6h7v7h-7zM4 15h16v3H4z',
  },
  { id: 'inventory', label: 'Inventory', d: 'M3 7l9-4 9 4-9 4-9-4z' },
  { id: 'enquiries', label: 'Enquiries', d: 'M4 4h16v12H8l-4 4V4z' },
  { id: 'analytics', label: 'Analytics', d: 'M4 20V10M12 20V4M20 20v-7' },
]

function fromDb(row: {
  id: string
  name: string
  category: string
  type: string
  pack_size: string
  price: number
  mrp: number
  stock_quantity: number
  reorder_level: number
  rating: number
  reviews_count: number
  composition: string
  description: string | null
  image_url?: string | null
  images?: string[] | null
}): Product {
  const iconMap: Record<string, Product['icon']> = {
    Tablets: 'tablet',
    Syrup: 'syrup',
    Capsules: 'capsule',
    Ointment: 'ointment',
  }
  return {
    id: row.id as unknown as number,
    name: row.name,
    cat: row.category,
    type: row.type,
    pack: row.pack_size,
    salt: row.composition,
    desc: row.description || '',
    price: Number(row.price),
    mrp: Number(row.mrp),
    stock: row.stock_quantity <= row.reorder_level ? 'Low Stock' : 'In Stock',
    rating: Number(row.rating),
    reviews: row.reviews_count,
    tagColor: '#0F6E4E',
    icon: iconMap[row.type] || 'tablet',
    images:
      row.images && row.images.length > 0
        ? row.images
        : row.image_url
          ? [row.image_url]
          : [],
  }
}

export default function AdminDashboard() {
  const [panel, setPanel] = useState<Panel>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [connected, setConnected] = useState<boolean | null>(null) // null = checking
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [dbProducts, dbEnquiries] = await Promise.all([
        getAllProductsAdmin(),
        getEnquiries(),
      ])
      setProducts((dbProducts || []).map(fromDb))
      setEnquiries(
        (dbEnquiries || []).map((e) => ({
          id: e.id as unknown as number,
          name: e.name,
          store: e.store_name || '-',
          product: e.product_name || 'General enquiry',
          contact: e.email || e.phone,
          date: new Date(e.created_at).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          status: e.status,
        })),
      )
      setConnected(true)
    } catch {
      setConnected(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleDeleteProduct(id: number) {
    if (!confirm('Delete this product?')) return
    await deleteProductAction(String(id))
    loadData()
  }

  async function handleAdjustStock(id: number) {
    const val = prompt('New stock quantity:')
    if (val === null) return
    await adjustStock(String(id), parseInt(val) || 0)
    loadData()
  }

  async function handleMarkResponded(id: number) {
    await markResponded(String(id))
    loadData()
  }

  function openAddModal() {
    setEditingProduct(null)
    setShowProductForm(true)
  }

  function openEditModal(p: Product) {
    setEditingProduct(p)
    setShowProductForm(true)
  }

  function closeProductForm() {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  return (
    <div className='min-h-screen bg-bg-soft flex'>
      {/* Mobile top bar */}
      <div className='md:hidden fixed top-0 inset-x-0 z-40 h-16 bg-navy text-white flex items-center justify-between px-4'>
        <div className='flex items-center gap-2.5'>
          <Image
            src='/logo.png'
            alt='GDNT'
            width={776}
            height={322}
            quality={100}
            className='h-7 w-auto brightness-0 invert'
          />
          <span className='font-extrabold text-sm'>GDNT Admin</span>
        </div>
        <button
          type='button'
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((v) => !v)}
          className='w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20'
        >
          {mobileNavOpen ? (
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
              <path
                d='M6 6l12 12M18 6L6 18'
                stroke='#fff'
                strokeWidth='1.8'
                strokeLinecap='round'
              />
            </svg>
          ) : (
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
              <path
                d='M4 7h16M4 12h16M4 17h16'
                stroke='#fff'
                strokeWidth='1.8'
                strokeLinecap='round'
              />
            </svg>
          )}
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      <div
        onClick={() => setMobileNavOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          mobileNavOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`w-[250px] bg-navy text-white p-5 flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 h-screen overflow-y-auto transition-transform duration-300 ease-out md:sticky md:top-0 md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='mb-10 flex items-center justify-between'>
          <div>
            <Image
              src='/logo.png'
              alt='GDNT'
              width={776}
              height={322}
              quality={100}
              className='h-[34px] w-auto brightness-0 invert mb-2'
            />
            <span className='text-white font-extrabold text-sm'>
              GDNT Admin
            </span>
          </div>
          <button
            type='button'
            aria-label='Close menu'
            onClick={() => setMobileNavOpen(false)}
            className='md:hidden w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20 shrink-0'
          >
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
              <path
                d='M6 6l12 12M18 6L6 18'
                stroke='#fff'
                strokeWidth='1.8'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setPanel(item.id)
              closeProductForm()
              setMobileNavOpen(false)
            }}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-[13.5px] font-semibold mb-1 transition-colors text-left ${
              panel === item.id
                ? 'bg-forest text-white'
                : 'text-white/65 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
              <path
                d={item.d}
                stroke='#fff'
                strokeWidth='1.6'
                strokeLinejoin='round'
              />
            </svg>
            {item.label}
          </button>
        ))}
        <div className='mt-auto pt-5 border-t border-white/10 space-y-1'>
          <Link
            href='/'
            className='flex items-center gap-3 px-3.5 py-3 rounded-lg text-[13.5px] font-semibold text-white/65 hover:bg-white/5 hover:text-white transition-colors'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
              <path
                d='M15 3H6a2 2 0 00-2 2v14a2 2 0 002 2h9M10 12h11m0 0l-3-3m3 3l-3 3'
                stroke='#fff'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            View Site
          </Link>
          <button
            onClick={() => logout()}
            className='w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-[13.5px] font-semibold text-white/65 hover:bg-white/5 hover:text-white transition-colors text-left'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
              <path
                d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9'
                stroke='#fff'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      <main className='flex-1 p-6 pt-22 md:pt-10 md:p-10 overflow-x-auto'>
        {connected === false && (
          <div className='mb-6 bg-[#FBEAE8] border border-[#C0392B]/30 text-[13px] text-[#C0392B] font-semibold px-4 py-3 rounded-lg'>
            Could not connect to Supabase. Check your{' '}
            <code className='font-mono'>.env.local</code> keys and that
            you&apos;re logged in — see{' '}
            <code className='font-mono'>SUPABASE_SETUP.md</code>.
          </div>
        )}
        {connected === true && showProductForm ? (
          <ProductFormPage
            editingProduct={editingProduct}
            onCancel={closeProductForm}
            onSaved={() => {
              closeProductForm()
              loadData()
            }}
          />
        ) : (
          <>
            {connected === true &&
              products.length === 0 &&
              panel !== 'enquiries' && <EmptyState onAdd={openAddModal} />}
            {connected === null && (
              <div className='text-muted text-sm'>Loading...</div>
            )}
            {connected === true &&
              (products.length > 0 || panel === 'enquiries') && (
                <>
                  {panel === 'overview' && (
                    <OverviewPanel enquiries={enquiries} products={products} />
                  )}
                  {panel === 'products' && (
                    <ProductsPanel
                      products={products}
                      onDelete={handleDeleteProduct}
                      onEdit={openEditModal}
                      onAdd={openAddModal}
                    />
                  )}
                  {panel === 'categories' && (
                    <CategoriesPanel products={products} />
                  )}
                  {panel === 'inventory' && (
                    <InventoryPanel
                      products={products}
                      onAdjust={handleAdjustStock}
                    />
                  )}
                  {panel === 'enquiries' && (
                    <EnquiriesPanel
                      enquiries={enquiries}
                      onRespond={handleMarkResponded}
                    />
                  )}
                  {panel === 'analytics' && (
                    <AnalyticsPanel products={products} enquiries={enquiries} />
                  )}
                </>
              )}
          </>
        )}
      </main>
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className='bg-white border border-line rounded-2xl p-16 text-center'>
      <h3 className='text-lg font-extrabold text-navy mb-2'>No products yet</h3>
      <p className='text-[13.5px] text-muted mb-6'>
        Add your first product to start building your catalog.
      </p>
      <button
        onClick={onAdd}
        className='bg-forest text-white px-6 py-3 rounded-lg font-bold text-sm transition-transform hover:-translate-y-0.5'
      >
        + Add New Product
      </button>
    </div>
  )
}

function KpiCard({
  label,
  value,
  delta,
  up,
}: {
  label: string
  value: string
  delta: string
  up: boolean
}) {
  return (
    <div className='bg-white border border-line rounded-2xl p-5.5'>
      <div className='text-xs text-muted font-semibold'>{label}</div>
      <div className='text-[26px] font-extrabold text-navy mt-2'>{value}</div>
      <div
        className={`text-[11.5px] font-bold mt-1.5 ${up ? 'text-forest' : 'text-[#C0392B]'}`}
      >
        {delta}
      </div>
    </div>
  )
}

function OverviewPanel({
  enquiries,
  products,
}: {
  enquiries: Enquiry[]
  products: Product[]
}) {
  const lowStock = products.filter((p) => p.stock === 'Low Stock').length
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-navy'>
          Dashboard Overview
        </h1>
        <p className='text-[13.5px] text-muted mt-1'>
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
        <KpiCard
          label='Total Products'
          value={String(products.length)}
          delta='Live count'
          up
        />
        <KpiCard
          label='Low Stock Items'
          value={String(lowStock)}
          delta={lowStock > 0 ? 'Needs attention' : 'All good'}
          up={lowStock === 0}
        />
        <KpiCard
          label='New Enquiries'
          value={String(newEnquiries)}
          delta='Awaiting response'
          up={newEnquiries === 0}
        />
        <KpiCard
          label='Total Enquiries'
          value={String(enquiries.length)}
          delta='All time'
          up
        />
      </div>
      <div className='bg-white border border-line rounded-2xl overflow-hidden'>
        <div className='px-6 py-5 border-b border-line'>
          <h3 className='text-[15px] font-extrabold text-navy'>
            Recent Enquiries
          </h3>
        </div>
        {enquiries.length === 0 ? (
          <p className='px-6 py-8 text-[13.5px] text-muted'>
            No enquiries yet.
          </p>
        ) : (
          <table className='w-full'>
            <thead>
              <tr>
                {['Name', 'Product', 'Contact', 'Status'].map((h) => (
                  <th
                    key={h}
                    className='text-left text-[11px] uppercase tracking-wide text-muted font-semibold px-6 py-3 border-b border-line'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.slice(0, 4).map((e) => (
                <tr key={e.id} className='hover:bg-bg-soft transition-colors'>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line font-semibold text-navy'>
                    {e.name}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    {e.product}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    {e.contact}
                  </td>
                  <td className='px-6 py-4 border-b border-line'>
                    <StatusPill status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const isNew = status === 'New'
  return (
    <span
      className='text-[11px] font-bold px-3 py-1 rounded-full'
      style={{
        color: isNew ? '#0F6E4E' : '#5B6470',
        background: isNew ? '#E7F5EE' : '#EEF0F2',
      }}
    >
      {status}
    </span>
  )
}

function ProductsPanel({
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
  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-extrabold text-navy'>Products</h1>
          <p className='text-[13.5px] text-muted mt-1'>
            Manage your product catalog.
          </p>
        </div>
        <button
          onClick={onAdd}
          className='bg-forest text-white px-6 py-3 rounded-lg font-bold text-sm w-fit transition-transform hover:-translate-y-0.5'
        >
          + Add New Product
        </button>
      </div>
      <div className='bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto'>
        <table className='w-full min-w-[780px]'>
          <thead>
            <tr>
              {[
                '',
                'Product',
                'Category',
                'Price',
                'Discount',
                'Stock',
                'Status',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  className='text-left text-[11px] uppercase tracking-wide text-muted font-semibold px-6 py-3 border-b border-line'
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const discount = getDiscountPercent(p.price, p.mrp)
              return (
                <tr key={p.id} className='hover:bg-bg-soft transition-colors'>
                  <td className='px-6 py-4 border-b border-line'>
                    <div className='w-[38px] h-[38px] rounded-lg bg-bg-soft flex items-center justify-center overflow-hidden'>
                      {p.images.length > 0 ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={38}
                          height={38}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <ProductIcon icon={p.icon} className='w-full h-full' />
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 border-b border-line'>
                    <div className='font-bold text-[13.5px] text-navy'>
                      {p.name}
                    </div>
                    <div className='text-[11.5px] text-muted'>{p.pack}</div>
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    {p.cat}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    ₹{p.price}{' '}
                    <span className='text-[11px] text-muted line-through'>
                      ₹{p.mrp}
                    </span>
                  </td>
                  <td className='px-6 py-4 border-b border-line'>
                    {discount > 0 ? (
                      <span className='text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FDF3E3] text-[#B07F2A]'>
                        {discount}% off
                      </span>
                    ) : (
                      <span className='text-[11px] text-muted'>—</span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    {p.stock === 'In Stock' ? 'In stock' : 'Low'}
                  </td>
                  <td className='px-6 py-4 border-b border-line'>
                    <span
                      className='text-[11px] font-bold px-3 py-1 rounded-full'
                      style={{
                        color: p.stock === 'In Stock' ? '#0F6E4E' : '#C0392B',
                        background:
                          p.stock === 'In Stock' ? '#E7F5EE' : '#FBEAE8',
                      }}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className='px-6 py-4 border-b border-line'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => onEdit(p)}
                        className='w-[30px] h-[30px] rounded-md bg-bg-soft flex items-center justify-center hover:bg-forest-pale transition-colors'
                        title='Edit'
                      >
                        <svg
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M4 20h4l11-11-4-4L4 16v4z'
                            stroke='#0F6E4E'
                            strokeWidth='1.6'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className='w-[30px] h-[30px] rounded-md bg-bg-soft flex items-center justify-center hover:bg-forest-pale transition-colors'
                        title='Delete'
                      >
                        <svg
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13'
                            stroke='#C0392B'
                            strokeWidth='1.6'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InventoryPanel({
  products,
  onAdjust,
}: {
  products: Product[]
  onAdjust: (id: number) => void
}) {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-navy'>Inventory</h1>
        <p className='text-[13.5px] text-muted mt-1'>
          Track and adjust stock quantities.
        </p>
      </div>
      <div className='bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto'>
        <table className='w-full min-w-[700px]'>
          <thead>
            <tr>
              {['Product', 'SKU', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className='text-left text-[11px] uppercase tracking-wide text-muted font-semibold px-6 py-3 border-b border-line'
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className='hover:bg-bg-soft transition-colors'>
                <td className='px-6 py-4 text-[13.5px] font-bold text-navy border-b border-line'>
                  {p.name}
                </td>
                <td className='px-6 py-4 text-[13.5px] font-mono border-b border-line'>
                  GDN-{String(p.id).slice(0, 8)}
                </td>
                <td className='px-6 py-4 border-b border-line'>
                  <span
                    className='text-[11px] font-bold px-3 py-1 rounded-full'
                    style={{
                      color: p.stock === 'In Stock' ? '#0F6E4E' : '#C0392B',
                      background:
                        p.stock === 'In Stock' ? '#E7F5EE' : '#FBEAE8',
                    }}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className='px-6 py-4 border-b border-line'>
                  <button
                    onClick={() => onAdjust(p.id)}
                    className='w-[30px] h-[30px] rounded-md bg-bg-soft flex items-center justify-center hover:bg-forest-pale transition-colors'
                    title='Adjust'
                  >
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M4 20h4l11-11-4-4L4 16v4z'
                        stroke='#0F6E4E'
                        strokeWidth='1.6'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EnquiriesPanel({
  enquiries,
  onRespond,
}: {
  enquiries: Enquiry[]
  onRespond: (id: number) => void
}) {
  const [filter, setFilter] = useState<'All' | 'New' | 'Responded'>('All')
  const filtered = enquiries.filter(
    (e) => filter === 'All' || e.status === filter,
  )

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-extrabold text-navy'>Enquiries</h1>
        <p className='text-[13.5px] text-muted mt-1'>
          Messages submitted through the contact form.
        </p>
      </div>
      <div className='flex gap-2 bg-bg-soft p-1.5 rounded-xl w-fit mb-6'>
        {(['All', 'New', 'Responded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4.5 py-2 rounded-lg text-[13px] font-bold transition-colors ${
              filter === f ? 'bg-white text-forest shadow-sm' : 'text-muted'
            }`}
          >
            {f} (
            {f === 'All'
              ? enquiries.length
              : enquiries.filter((e) => e.status === f).length}
            )
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className='bg-white border border-line rounded-2xl p-12 text-center text-[13.5px] text-muted'>
          No enquiries {filter !== 'All' ? `with status "${filter}"` : 'yet'}.
        </div>
      ) : (
        <div className='bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto'>
          <table className='w-full min-w-[800px]'>
            <thead>
              <tr>
                {[
                  'Name',
                  'Store/Clinic',
                  'Product',
                  'Contact',
                  'Date',
                  'Status',
                  '',
                ].map((h) => (
                  <th
                    key={h}
                    className='text-left text-[11px] uppercase tracking-wide text-muted font-semibold px-6 py-3 border-b border-line'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className='hover:bg-bg-soft transition-colors'>
                  <td className='px-6 py-4 text-[13.5px] font-bold text-navy border-b border-line'>
                    {e.name}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    {e.store}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    {e.product}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    {e.contact}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                    {e.date}
                  </td>
                  <td className='px-6 py-4 border-b border-line'>
                    <StatusPill status={e.status} />
                  </td>
                  <td className='px-6 py-4 border-b border-line'>
                    {e.status === 'New' ? (
                      <button
                        onClick={() => onRespond(e.id)}
                        className='w-[30px] h-[30px] rounded-md bg-bg-soft flex items-center justify-center hover:bg-forest-pale transition-colors'
                        title='Mark as responded'
                      >
                        <svg
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M9 12l2 2 4-4'
                            stroke='#0F6E4E'
                            strokeWidth='2'
                            strokeLinecap='round'
                          />
                          <circle
                            cx='12'
                            cy='12'
                            r='9'
                            stroke='#0F6E4E'
                            strokeWidth='1.6'
                          />
                        </svg>
                      </button>
                    ) : (
                      <span className='text-muted text-xs'>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
