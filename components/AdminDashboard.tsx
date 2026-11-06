'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product, getDiscountPercent } from '@/lib/products'
import { Enquiry } from '@/lib/enquiries'
import {
  getAllProductsAdmin,
  deleteProduct as deleteProductAction,
  adjustStock,
} from '@/lib/actions/products'
import {
  getEnquiries,
  markResponded,
  sendEnquiryReply,
} from '@/lib/actions/enquiries'
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

const NAV: { id: Panel; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <>
        <rect x='3' y='3' width='7' height='7' rx='1.5' />
        <rect x='14' y='3' width='7' height='7' rx='1.5' />
        <rect x='3' y='14' width='7' height='7' rx='1.5' />
        <rect x='14' y='14' width='7' height='7' rx='1.5' />
      </>
    ),
  },
  {
    id: 'products',
    label: 'Products',
    icon: (
      <>
        <path
          d='M21 7.5v9L12 21l-9-4.5v-9L12 3l9 4.5z'
          strokeLinejoin='round'
        />
        <path d='M3.3 7l8.7 4.5L20.7 7' strokeLinejoin='round' />
        <path d='M12 21v-9.5' />
      </>
    ),
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: (
      <>
        <path
          d='M20.5 13.2l-7.3 7.3a1.5 1.5 0 01-2.1 0l-7.8-7.8a1.5 1.5 0 01-.4-1V4.5A1.5 1.5 0 014.3 3h7.2c.4 0 .8.2 1 .4l7.9 7.9a1.5 1.5 0 010 2.1z'
          strokeLinejoin='round'
        />
        <circle cx='8.3' cy='7.8' r='1.5' fill='currentColor' stroke='none' />
      </>
    ),
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: (
      <>
        <rect x='3' y='4' width='18' height='4' rx='1' strokeLinejoin='round' />
        <path d='M5 8v9a2 2 0 002 2h10a2 2 0 002-2V8' strokeLinejoin='round' />
        <path d='M10 13h4' />
      </>
    ),
  },
  {
    id: 'enquiries',
    label: 'Enquiries',
    icon: <path d='M4 4h16v12H8l-4 4V4z' strokeLinejoin='round' />,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <>
        <path d='M4 20V10' />
        <path d='M12 20V4' />
        <path d='M20 20v-7' />
      </>
    ),
  },
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
  usage_dosage?: string | null
  safety_info?: string | null
  image_url?: string | null
  images?: string[] | null
  meta_title?: string | null
  meta_description?: string | null
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
    usageDosage: row.usage_dosage || '',
    safetyInfo: row.safety_info || '',
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
    metaTitle: row.meta_title || '',
    metaDescription: row.meta_description || '',
  }
}

export default function AdminDashboard() {
  const [panel, setPanel] = useState<Panel>('overview')
  // Enquiry to open when jumping to the Enquiries panel from the Overview
  const [focusEnquiryId, setFocusEnquiryId] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [connected, setConnected] = useState<boolean | null>(null) // null = checking
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [stockModalId, setStockModalId] = useState<number | null>(null)
  const [stockValue, setStockValue] = useState('')
  const [stockSaving, setStockSaving] = useState(false)
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

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
          phone: e.phone,
          email: e.email || undefined,
          message: e.message || undefined,
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

  // Keep the dashboard fresh: new enquiries arrive while this tab is open, and
  // the data above is only fetched client-side, so refetch when the admin comes
  // back to the tab, switches panels, and every 30 seconds.
  useEffect(() => {
    loadData()
  }, [panel, loadData])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') loadData()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    const timer = window.setInterval(onVisible, 30000)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
      window.clearInterval(timer)
    }
  }, [loadData])

  function handleDeleteProduct(id: number) {
    setDeleteModalId(id)
  }

  async function confirmDeleteProduct() {
    if (deleteModalId === null) return
    setDeleting(true)
    try {
      await deleteProductAction(String(deleteModalId))
      setDeleteModalId(null)
      loadData()
    } finally {
      setDeleting(false)
    }
  }

  function handleAdjustStock(id: number) {
    setStockModalId(id)
    setStockValue('')
  }

  async function confirmAdjustStock() {
    if (stockModalId === null) return
    setStockSaving(true)
    try {
      await adjustStock(String(stockModalId), parseInt(stockValue) || 0)
      setStockModalId(null)
      setStockValue('')
      loadData()
    } finally {
      setStockSaving(false)
    }
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
        className={`w-[250px] bg-navy text-white p-5 flex flex-col fixed top-0 left-0 z-50 h-screen overflow-y-auto transition-transform duration-300 ease-out md:translate-x-0 ${
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
              <g
                stroke='#fff'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                {item.icon}
              </g>
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

      <main className='flex-1 p-6 pt-22 md:pt-10 md:p-10 md:ml-[250px] overflow-x-auto'>
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
                    <OverviewPanel
                      enquiries={enquiries}
                      products={products}
                      onOpenEnquiry={(id) => {
                        setFocusEnquiryId(id)
                        setPanel('enquiries')
                      }}
                    />
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
                      onRefresh={loadData}
                      focusId={focusEnquiryId}
                      onFocusHandled={() => setFocusEnquiryId(null)}
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

      {stockModalId !== null && (
        <Modal
          title='Adjust stock'
          onClose={() => (stockSaving ? null : setStockModalId(null))}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              confirmAdjustStock()
            }}
          >
            <label className='block text-[12.5px] font-bold text-navy mb-2'>
              New stock quantity
            </label>
            <input
              autoFocus
              type='number'
              min={0}
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              placeholder='e.g. 120'
              className='w-full border border-line rounded-lg px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest'
            />
            <div className='flex justify-end gap-3 mt-6'>
              <button
                type='button'
                onClick={() => setStockModalId(null)}
                disabled={stockSaving}
                className='px-4 py-2.5 rounded-lg text-[13px] font-bold text-muted hover:text-navy transition-colors disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={stockSaving || stockValue.trim() === ''}
                className='bg-forest text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0'
              >
                {stockSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteModalId !== null && (
        <Modal
          title='Delete product'
          onClose={() => (deleting ? null : setDeleteModalId(null))}
        >
          <p className='text-[13.5px] text-muted'>
            Are you sure you want to delete this product? This action can&apos;t
            be undone.
          </p>
          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              onClick={() => setDeleteModalId(null)}
              disabled={deleting}
              className='px-4 py-2.5 rounded-lg text-[13px] font-bold text-muted hover:text-navy transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={confirmDeleteProduct}
              disabled={deleting}
              className='bg-[#C0392B] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0'
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-navy/40 backdrop-blur-[2px] px-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl border border-line shadow-xl w-full max-w-[380px] p-6'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-[15px] font-extrabold text-navy'>{title}</h3>
          <button
            type='button'
            onClick={onClose}
            className='w-7 h-7 rounded-md flex items-center justify-center text-muted hover:bg-bg-soft hover:text-navy transition-colors'
            aria-label='Close'
          >
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
              <path
                d='M18 6L6 18M6 6l12 12'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
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
  onOpenEnquiry,
}: {
  enquiries: Enquiry[]
  products: Product[]
  onOpenEnquiry: (id: number) => void
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
        <div className='px-6 py-5 border-b border-line flex items-center justify-between gap-4'>
          <h3 className='text-[15px] font-extrabold text-navy'>
            Recent Enquiries
          </h3>
          {enquiries.length > 0 && (
            <button
              onClick={() => onOpenEnquiry(enquiries[0].id)}
              className='text-[13px] font-bold text-forest hover:underline'
            >
              View all →
            </button>
          )}
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
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState<'All' | 'In Stock' | 'Low Stock'>('All')

  const categories = Array.from(new Set(products.map((p) => p.cat))).sort()

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase()
    const matchesQuery =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    const matchesCategory = category === 'All' || p.cat === category
    const matchesStatus = status === 'All' || p.stock === status
    return matchesQuery && matchesCategory && matchesStatus
  })

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
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

      {/* Search + filters */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-5'>
        <div className='relative flex-1 max-w-[320px]'>
          <svg
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'
          >
            <circle
              cx='11'
              cy='11'
              r='7'
              stroke='currentColor'
              strokeWidth='2'
            />
            <path
              d='M21 21l-4.3-4.3'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by product or category'
            className='w-full border border-line rounded-lg pl-10 pr-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest'
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className='border border-line rounded-lg px-3.5 py-2.5 text-[13px] font-semibold text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest w-fit'
        >
          <option value='All'>All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className='flex bg-bg-soft rounded-lg p-1 gap-1 w-fit'>
          {(['All', 'In Stock', 'Low Stock'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-2 rounded-md text-[12.5px] font-bold transition-colors whitespace-nowrap ${
                status === s
                  ? 'bg-white text-forest shadow-sm'
                  : 'text-muted hover:text-navy'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
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
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className='px-6 py-10 text-center text-[13.5px] text-muted'
                >
                  No products match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
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
                            className='w-full h-full object-contain'
                          />
                        ) : (
                          <ProductIcon
                            icon={p.icon}
                            className='w-full h-full'
                          />
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Builds a clean, display-only SKU from a product id. Sanitized so that any
// stray/non-alphanumeric characters in the underlying id (e.g. corrupted or
// non-UUID values) never leak into the UI.
function skuFor(id: number): string {
  const clean = String(id)
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .padEnd(8, '0')
    .slice(0, 8)
  return `GDN-${clean}`
}

function InventoryPanel({
  products,
  onAdjust,
}: {
  products: Product[]
  onAdjust: (id: number) => void
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | 'In Stock' | 'Low Stock'>('All')

  const filtered = products.filter((p) => {
    const matchesStatus = status === 'All' || p.stock === status
    const matchesQuery =
      query.trim() === '' ||
      p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      skuFor(p.id).toLowerCase().includes(query.trim().toLowerCase())
    return matchesStatus && matchesQuery
  })

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-navy'>Inventory</h1>
        <p className='text-[13.5px] text-muted mt-1'>
          Track and adjust stock quantities.
        </p>
      </div>

      {/* Filter bar */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-5'>
        <div className='relative flex-1 max-w-[320px]'>
          <svg
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'
          >
            <circle
              cx='11'
              cy='11'
              r='7'
              stroke='currentColor'
              strokeWidth='2'
            />
            <path
              d='M21 21l-4.3-4.3'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by product or SKU'
            className='w-full border border-line rounded-lg pl-10 pr-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest'
          />
        </div>
        <div className='flex bg-bg-soft rounded-lg p-1 gap-1 w-fit'>
          {(['All', 'In Stock', 'Low Stock'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-2 rounded-md text-[12.5px] font-bold transition-colors whitespace-nowrap ${
                status === s
                  ? 'bg-white text-forest shadow-sm'
                  : 'text-muted hover:text-navy'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
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
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className='px-6 py-10 text-center text-[13.5px] text-muted'
                >
                  No products match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className='hover:bg-bg-soft transition-colors'>
                  <td className='px-6 py-4 text-[13.5px] font-bold text-navy border-b border-line'>
                    {p.name}
                  </td>
                  <td className='px-6 py-4 text-[13.5px] font-mono border-b border-line'>
                    {skuFor(p.id)}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---- helpers for replying to an enquiry ----
function waNumber(phone?: string) {
  const d = (phone || '').replace(/\D/g, '')
  if (d.length < 10) return ''
  // 10-digit Indian mobile numbers get the +91 country code
  return d.length === 10 ? `91${d}` : d.replace(/^0+/, '')
}

function replyText(e: Enquiry) {
  const topic =
    e.product && e.product !== 'General enquiry' ? ` about ${e.product}` : ''
  return `Hello ${e.name}, thank you for your enquiry${topic} at GDNT Medicare Pvt. Ltd. `
}

function defaultReplySubject(e: Enquiry) {
  const topic =
    e.product && e.product !== 'General enquiry' ? ` - ${e.product}` : ''
  return `Re: Your enquiry${topic} | GDNT Medicare`
}

function defaultReplyBody(e: Enquiry) {
  return `${replyText(e).trim()}\n\n\n\nRegards,\nGDNT Medicare Pvt. Ltd.\n+91 86798 84419`
}

function emailReplyLink(e: Enquiry) {
  const topic =
    e.product && e.product !== 'General enquiry' ? ` - ${e.product}` : ''
  const subject = `Re: Your enquiry${topic} | GDNT Medicare`
  const body = `${replyText(e)}\n\n\n\nRegards,\nGDNT Medicare Pvt. Ltd.\n+91 86798 84419`
  return `mailto:${e.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function whatsappLink(e: Enquiry) {
  return `https://wa.me/${waNumber(e.phone)}?text=${encodeURIComponent(replyText(e))}`
}

function EnquiriesPanel({
  enquiries,
  onRespond,
  onRefresh,
  focusId,
  onFocusHandled,
}: {
  enquiries: Enquiry[]
  onRespond: (id: number) => void
  onRefresh: () => Promise<void> | void
  focusId?: number | null
  onFocusHandled?: () => void
}) {
  const [filter, setFilter] = useState<'All' | 'New' | 'Responded'>('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // in-dashboard email reply composer (one at a time)
  const [composeId, setComposeId] = useState<number | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sentNote, setSentNote] = useState('')

  function toggleRow(id: number) {
    setOpenId(openId === id ? null : id)
    setComposeId(null)
    setSendError('')
    setSentNote('')
  }

  function openComposer(e: Enquiry) {
    if (composeId === e.id) {
      setComposeId(null)
      return
    }
    setComposeId(e.id)
    setSubject(defaultReplySubject(e))
    setBody(defaultReplyBody(e))
    setSendError('')
    setSentNote('')
  }

  async function sendReply(e: Enquiry) {
    setSending(true)
    setSendError('')
    try {
      const res = await sendEnquiryReply(String(e.id), subject, body)
      if (!res.ok) {
        setSendError(res.error)
        return
      }
      setComposeId(null)
      setSentNote(`Reply sent to ${res.to}. Marked as responded.`)
      await onRefresh()
    } catch (err) {
      console.error(err)
      setSendError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  // Arriving from the Overview: show all, open that enquiry and scroll to it
  useEffect(() => {
    if (focusId == null) return
    setFilter('All')
    setOpenId(focusId)
    // (not cleared on cleanup: onFocusHandled() resets focusId right away,
    // which would re-run this effect and cancel the scroll)
    window.setTimeout(() => {
      document
        .getElementById(`enquiry-${focusId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    onFocusHandled?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId])

  async function refresh() {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }
  const filtered = enquiries.filter(
    (e) => filter === 'All' || e.status === filter,
  )

  return (
    <div>
      <div className='mb-6 flex items-start justify-between gap-4 flex-wrap'>
        <div>
          <h1 className='text-2xl font-extrabold text-navy'>Enquiries</h1>
          <p className='text-[13.5px] text-muted mt-1'>
            Messages submitted through the contact form.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className='px-4 py-2 rounded-lg border border-line bg-white text-[13px] font-bold text-navy hover:border-forest hover:text-forest transition-colors disabled:opacity-60'
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
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
                  'Action',
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
                <Fragment key={e.id}>
                  <tr
                    id={`enquiry-${e.id}`}
                    onClick={() => toggleRow(e.id)}
                    className={`transition-colors cursor-pointer scroll-mt-24 ${
                      openId === e.id ? 'bg-forest-pale/40' : 'hover:bg-bg-soft'
                    }`}
                  >
                    <td className='px-6 py-4 text-[13.5px] font-bold text-navy border-b border-line'>
                      {e.name}
                      <span className='block text-[11px] font-semibold text-forest mt-0.5'>
                        {openId === e.id ? 'Hide details' : 'View details'}
                      </span>
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
                    <td className='px-6 py-4 border-b border-line whitespace-nowrap'>
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation()
                          toggleRow(e.id)
                        }}
                        className={`px-4 py-2 rounded-md text-[12.5px] font-bold transition-colors ${
                          e.status === 'New'
                            ? 'bg-forest text-white hover:bg-forest-dark'
                            : 'bg-bg-soft text-navy hover:bg-forest-pale'
                        }`}
                      >
                        {openId === e.id
                          ? 'Close'
                          : e.status === 'New'
                            ? 'Respond'
                            : 'View'}
                      </button>
                    </td>
                  </tr>
                  {openId === e.id && (
                    <tr className='bg-bg-soft'>
                      <td
                        colSpan={7}
                        className='px-6 py-5 border-b border-line text-[13.5px]'
                      >
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                          <div>
                            <div className='text-[11px] uppercase tracking-wide text-muted font-semibold'>
                              Phone
                            </div>
                            <div className='mt-1 font-semibold text-navy'>
                              {e.phone ? (
                                <a
                                  href={`tel:${e.phone}`}
                                  className='hover:text-forest'
                                >
                                  {e.phone}
                                </a>
                              ) : (
                                '-'
                              )}
                            </div>
                          </div>
                          <div>
                            <div className='text-[11px] uppercase tracking-wide text-muted font-semibold'>
                              Email
                            </div>
                            <div className='mt-1 font-semibold text-navy break-all'>
                              {e.email ? (
                                <a
                                  href={`mailto:${e.email}`}
                                  className='hover:text-forest'
                                >
                                  {e.email}
                                </a>
                              ) : (
                                '-'
                              )}
                            </div>
                          </div>
                          <div className='sm:col-span-3'>
                            <div className='text-[11px] uppercase tracking-wide text-muted font-semibold'>
                              Message
                            </div>
                            <p className='mt-1 text-navy whitespace-pre-wrap leading-relaxed'>
                              {e.message || 'No message provided.'}
                            </p>
                          </div>
                        </div>

                        <div className='mt-5 pt-5 border-t border-line'>
                          <div className='text-[11px] uppercase tracking-wide text-muted font-semibold mb-3'>
                            Respond to this enquiry
                          </div>
                          <div className='flex flex-wrap gap-2.5'>
                            {e.email && (
                              <button
                                onClick={() => openComposer(e)}
                                className={`inline-flex items-center gap-2 border px-4 py-2.5 rounded-md text-[13px] font-bold transition-colors ${
                                  composeId === e.id
                                    ? 'bg-forest-pale border-forest text-forest'
                                    : 'bg-white border-line text-navy hover:border-forest hover:text-forest'
                                }`}
                              >
                                Reply by email
                              </button>
                            )}
                            {waNumber(e.phone) && (
                              <a
                                href={whatsappLink(e)}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-2 bg-white border border-line px-4 py-2.5 rounded-md text-[13px] font-bold text-navy hover:border-forest hover:text-forest transition-colors'
                              >
                                Reply on WhatsApp
                              </a>
                            )}
                            {e.phone && (
                              <a
                                href={`tel:${e.phone}`}
                                className='inline-flex items-center gap-2 bg-white border border-line px-4 py-2.5 rounded-md text-[13px] font-bold text-navy hover:border-forest hover:text-forest transition-colors'
                              >
                                Call
                              </a>
                            )}
                            {e.status === 'New' ? (
                              <button
                                onClick={() => onRespond(e.id)}
                                className='inline-flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-md text-[13px] font-bold hover:bg-forest-dark transition-colors sm:ml-auto'
                              >
                                Mark as responded
                              </button>
                            ) : (
                              <span className='inline-flex items-center px-4 py-2.5 rounded-md text-[13px] font-bold text-forest bg-forest-pale sm:ml-auto'>
                                Responded
                              </span>
                            )}
                          </div>
                          {sentNote && openId === e.id && (
                            <p
                              role='status'
                              className='mt-4 bg-forest-pale border border-forest/20 rounded-md px-4 py-3 text-[13px] font-bold text-forest'
                            >
                              {sentNote}
                            </p>
                          )}

                          {composeId === e.id && (
                            <div className='mt-4 bg-white border border-line rounded-md p-4 sm:p-5'>
                              <div className='grid grid-cols-1 sm:grid-cols-[70px_1fr] gap-x-4 gap-y-3 items-center'>
                                <label className='text-[12px] uppercase tracking-wide text-muted font-semibold'>
                                  To
                                </label>
                                <div className='text-[13.5px] font-semibold text-navy break-all'>
                                  {e.name} &lt;{e.email}&gt;
                                </div>
                                <label
                                  htmlFor={`subject-${e.id}`}
                                  className='text-[12px] uppercase tracking-wide text-muted font-semibold'
                                >
                                  Subject
                                </label>
                                <input
                                  id={`subject-${e.id}`}
                                  value={subject}
                                  onChange={(ev) => setSubject(ev.target.value)}
                                  className='w-full border border-[#cfd4da] rounded-md px-3 py-2.5 text-[13.5px] focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
                                />
                              </div>
                              <textarea
                                value={body}
                                onChange={(ev) => setBody(ev.target.value)}
                                rows={9}
                                aria-label='Reply message'
                                className='mt-3 w-full border border-[#cfd4da] rounded-md px-3 py-2.5 text-[13.5px] leading-relaxed focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
                              />
                              {sendError && (
                                <p
                                  role='alert'
                                  className='mt-3 text-[#C0392B] text-[13px] font-bold'
                                >
                                  {sendError}
                                </p>
                              )}
                              <div className='mt-3 flex flex-wrap items-center gap-3'>
                                <button
                                  onClick={() => sendReply(e)}
                                  disabled={sending}
                                  className='bg-forest text-white px-5 py-2.5 rounded-md text-[13px] font-bold hover:bg-forest-dark transition-colors disabled:opacity-60'
                                >
                                  {sending ? 'Sending...' : 'Send reply'}
                                </button>
                                <button
                                  onClick={() => setComposeId(null)}
                                  disabled={sending}
                                  className='px-4 py-2.5 rounded-md text-[13px] font-bold text-muted hover:text-navy'
                                >
                                  Cancel
                                </button>
                                <a
                                  href={emailReplyLink(e)}
                                  className='ml-auto text-[12.5px] font-semibold text-muted hover:text-forest'
                                >
                                  Open in my mail app instead
                                </a>
                              </div>
                              <p className='mt-3 text-[12px] text-muted'>
                                The customer can reply straight to your company
                                inbox. Sending also marks this enquiry as
                                responded.
                              </p>
                            </div>
                          )}

                          <p className='mt-3 text-[12px] text-muted'>
                            Reply by email or WhatsApp first, then click “Mark
                            as responded” so the team knows it is handled.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
