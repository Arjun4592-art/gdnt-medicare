'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product, mergeCategoryNames } from '@/lib/products'
import { Enquiry } from '@/lib/enquiries'
import {
  getAllProductsAdmin,
  deleteProduct as deleteProductAction,
  adjustStock,
} from '@/lib/actions/products'
import { getCategories, type CategoryRow } from '@/lib/actions/categories'
import { getEnquiries, markResponded } from '@/lib/actions/enquiries'
import { logout } from '@/lib/actions/auth'
import ProductFormPage from './ProductFormPage'
import AnalyticsPanel from './AnalyticsPanel'
import CategoriesPanel from './admin/CategoriesPanel'
import OverviewPanel from './admin/OverviewPanel'
import ProductsPanel from './admin/ProductsPanel'
import InventoryPanel from './admin/InventoryPanel'
import EnquiriesPanel from './admin/EnquiriesPanel'
import {
  DashboardSkeleton,
  EmptyState,
  GhostButton,
  Icon,
  Modal,
  PrimaryButton,
  ToastProvider,
  useToast,
  type IconName,
} from './admin/ui'

type Panel =
  | 'overview'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'enquiries'
  | 'analytics'

const NAV_GROUPS: {
  heading: string
  items: { id: Panel; label: string; icon: IconName }[]
}[] = [
  {
    heading: 'Main',
    items: [{ id: 'overview', label: 'Dashboard', icon: 'overview' }],
  },
  {
    heading: 'Catalog',
    items: [
      { id: 'products', label: 'Products', icon: 'products' },
      { id: 'categories', label: 'Categories', icon: 'categories' },
      { id: 'inventory', label: 'Inventory', icon: 'inventory' },
    ],
  },
  {
    heading: 'Customers',
    items: [{ id: 'enquiries', label: 'Enquiries', icon: 'enquiries' }],
  },
  {
    heading: 'Insights',
    items: [{ id: 'analytics', label: 'Analytics', icon: 'analytics' }],
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
    // The dashboard works with MRP only. `price` is kept equal to MRP.
    price: Number(row.mrp),
    mrp: Number(row.mrp),
    stock: row.stock_quantity <= row.reorder_level ? 'Low Stock' : 'In Stock',
    stockQty: row.stock_quantity,
    reorderLevel: row.reorder_level,
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
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  )
}

function Dashboard() {
  const toast = useToast()
  const [panel, setPanel] = useState<Panel>('overview')
  // Enquiry to open when jumping to the Enquiries panel from the Overview
  const [focusEnquiryId, setFocusEnquiryId] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [categoriesMissing, setCategoriesMissing] = useState(false)
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
      const [dbProducts, dbEnquiries, cats] = await Promise.all([
        getAllProductsAdmin(),
        getEnquiries(),
        getCategories(),
      ])
      setProducts((dbProducts || []).map(fromDb))
      setCategories(cats.categories)
      setCategoriesMissing(cats.tableMissing)
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

  async function confirmDeleteProduct() {
    if (deleteModalId === null) return
    setDeleting(true)
    try {
      await deleteProductAction(String(deleteModalId))
      setDeleteModalId(null)
      toast.success('Product deleted')
      loadData()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't delete product",
      )
    } finally {
      setDeleting(false)
    }
  }

  async function confirmAdjustStock() {
    if (stockModalId === null) return
    setStockSaving(true)
    try {
      await adjustStock(
        String(stockModalId),
        Math.max(0, parseInt(stockValue) || 0),
      )
      setStockModalId(null)
      setStockValue('')
      toast.success('Stock updated')
      loadData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update stock")
    } finally {
      setStockSaving(false)
    }
  }

  async function handleMarkResponded(id: number) {
    try {
      await markResponded(String(id))
      toast.success('Marked as responded')
      loadData()
    } catch {
      toast.error("Couldn't update the enquiry")
    }
  }

  function openAddForm() {
    setEditingProduct(null)
    setShowProductForm(true)
  }

  function openEditForm(p: Product) {
    setEditingProduct(p)
    setShowProductForm(true)
  }

  function closeProductForm() {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  function goTo(next: Panel) {
    setPanel(next)
    closeProductForm()
    setMobileNavOpen(false)
  }

  const newEnquiries = enquiries.filter((e) => e.status === 'New').length
  const lowStock = products.filter((p) => p.stock === 'Low Stock').length
  const badgeFor = (id: Panel) =>
    id === 'enquiries'
      ? { n: newEnquiries, cls: 'bg-[#C79A48] text-white' }
      : id === 'inventory'
        ? { n: lowStock, cls: 'bg-[#C0392B] text-white' }
        : { n: 0, cls: '' }

  const stockProduct = products.find((p) => p.id === stockModalId)
  const needsProducts =
    products.length === 0 &&
    (panel === 'overview' ||
      panel === 'products' ||
      panel === 'inventory' ||
      panel === 'analytics')

  // names offered in the product form's category dropdown
  const categoryNames = mergeCategoryNames(
    categories.map((c) => c.name),
    products.map((p) => p.cat),
  )

  return (
    <div className='min-h-screen bg-[#F3F5F4] flex'>
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
          <span className='font-extrabold text-sm'>Admin</span>
        </div>
        <button
          type='button'
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((v) => !v)}
          className='w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20'
        >
          <Icon name={mobileNavOpen ? 'close' : 'menu'} size={18} />
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
        className={`w-[260px] bg-navy text-white flex flex-col fixed top-0 left-0 z-50 h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-transform duration-300 ease-out md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='px-6 pt-6 pb-5 border-b border-white/10 flex items-start justify-between'>
          <div>
            <Image
              src='/logo.png'
              alt='GDNT Medicare'
              width={776}
              height={322}
              quality={100}
              className='h-[34px] w-auto brightness-0 invert mb-2.5'
            />
            <span className='text-[11px] uppercase tracking-[0.14em] text-white/50 font-bold'>
              Admin Console
            </span>
          </div>
          <button
            type='button'
            aria-label='Close menu'
            onClick={() => setMobileNavOpen(false)}
            className='md:hidden w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 shrink-0'
          >
            <Icon name='close' size={16} />
          </button>
        </div>

        <nav className='flex-1 px-4 py-5 space-y-6' aria-label='Admin sections'>
          {NAV_GROUPS.map((group) => (
            <div key={group.heading}>
              <div className='px-3 mb-2 text-[10.5px] uppercase tracking-[0.14em] text-white/40 font-bold'>
                {group.heading}
              </div>
              {group.items.map((item) => {
                const active = panel === item.id
                const badge = badgeFor(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-semibold mb-0.5 transition-colors text-left ${
                      active
                        ? 'bg-forest text-white shadow-sm'
                        : 'text-white/65 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <Icon name={item.icon} size={18} />
                    <span className='flex-1'>{item.label}</span>
                    {badge.n > 0 && (
                      <span
                        className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-extrabold flex items-center justify-center ${badge.cls}`}
                      >
                        {badge.n}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className='px-4 py-4 border-t border-white/10 space-y-1'>
          <Link
            href='/'
            target='_blank'
            className='flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-semibold text-white/65 hover:bg-white/8 hover:text-white transition-colors'
          >
            <Icon name='external' size={18} />
            View website
          </Link>
          <button
            onClick={() => logout()}
            className='w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-semibold text-white/65 hover:bg-white/8 hover:text-white transition-colors text-left'
          >
            <Icon name='logout' size={18} />
            Log out
          </button>
        </div>
      </aside>

      <main className='flex-1 min-w-0 px-5 pb-10 pt-24 md:pt-10 md:px-10 md:ml-[260px]'>
        <div className='max-w-[1200px] mx-auto'>
          {connected === false && (
            <div className='mb-6 flex gap-3 bg-[#FBEAE8] border border-[#C0392B]/30 text-[13px] text-[#C0392B] font-semibold px-4 py-3 rounded-xl'>
              <Icon name='alert' size={18} className='shrink-0 mt-px' />
              <span>
                Could not connect to Supabase. Check your{' '}
                <code className='font-mono'>.env.local</code> keys and that
                you&apos;re logged in — see{' '}
                <code className='font-mono'>SUPABASE_SETUP.md</code>.
              </span>
            </div>
          )}

          {connected === null && <DashboardSkeleton />}

          {connected === true && showProductForm && (
            <ProductFormPage
              editingProduct={editingProduct}
              categories={categoryNames}
              categoriesReady={!categoriesMissing}
              onCategoriesChanged={loadData}
              onCancel={closeProductForm}
              onSaved={() => {
                toast.success(
                  editingProduct ? 'Product updated' : 'Product added',
                )
                closeProductForm()
                loadData()
              }}
            />
          )}

          {connected === true && !showProductForm && (
            <>
              {needsProducts && (
                <EmptyState
                  title='No products yet'
                  text='Add your first product to start building your catalog. Tip: create your categories first so you can pick them while adding.'
                  action={
                    <div className='flex justify-center gap-3 flex-wrap'>
                      <PrimaryButton icon='plus' onClick={openAddForm}>
                        Add product
                      </PrimaryButton>
                      <GhostButton onClick={() => goTo('categories')}>
                        Set up categories
                      </GhostButton>
                    </div>
                  }
                />
              )}

              {!needsProducts && panel === 'overview' && (
                <OverviewPanel
                  enquiries={enquiries}
                  products={products}
                  categoryCount={
                    categoriesMissing
                      ? new Set(products.map((p) => p.cat)).size
                      : categories.length
                  }
                  onOpenEnquiry={(id) => {
                    setFocusEnquiryId(id)
                    setPanel('enquiries')
                  }}
                  onGo={goTo}
                />
              )}
              {!needsProducts && panel === 'products' && (
                <ProductsPanel
                  products={products}
                  onDelete={setDeleteModalId}
                  onEdit={openEditForm}
                  onAdd={openAddForm}
                />
              )}
              {panel === 'categories' && (
                <CategoriesPanel
                  products={products}
                  categories={categories}
                  tableMissing={categoriesMissing}
                  onChanged={loadData}
                />
              )}
              {!needsProducts && panel === 'inventory' && (
                <InventoryPanel
                  products={products}
                  onAdjust={(id) => {
                    setStockModalId(id)
                    setStockValue('')
                  }}
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
              {!needsProducts && panel === 'analytics' && (
                <AnalyticsPanel products={products} enquiries={enquiries} />
              )}
            </>
          )}
        </div>
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
            {stockProduct && (
              <p className='text-[13px] text-muted mb-4'>
                <b className='text-navy'>{stockProduct.name}</b> · currently{' '}
                <b className='text-navy'>{stockProduct.stockQty}</b> in stock
              </p>
            )}
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
              className='w-full border border-line rounded-lg px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-forest/25 focus:border-forest'
            />
            <div className='flex justify-end gap-3 mt-6'>
              <GhostButton
                onClick={() => setStockModalId(null)}
                disabled={stockSaving}
              >
                Cancel
              </GhostButton>
              <PrimaryButton
                type='submit'
                disabled={stockSaving || stockValue.trim() === ''}
              >
                {stockSaving ? 'Saving…' : 'Save'}
              </PrimaryButton>
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
            Are you sure you want to delete{' '}
            <b className='text-navy'>
              {products.find((p) => p.id === deleteModalId)?.name ??
                'this product'}
            </b>
            ? This action can&apos;t be undone.
          </p>
          <div className='flex justify-end gap-3 mt-6'>
            <GhostButton
              onClick={() => setDeleteModalId(null)}
              disabled={deleting}
            >
              Cancel
            </GhostButton>
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
