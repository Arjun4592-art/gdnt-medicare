'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/products'
import { addProduct, updateProduct } from '@/lib/actions/products'
import { createClient } from '@/lib/supabase/client'

interface Props {
  onCancel: () => void
  onSaved: () => void
  editingProduct?: Product | null
}

const TYPES = ['Tablets', 'Capsules', 'Syrup', 'Ointment']
const MAX_IMAGES = 4

const TABS = [
  { id: 'details', label: 'Product Details' },
  { id: 'media', label: 'Media' },
  { id: 'pricing', label: 'Pricing & Inventory' },
  { id: 'seo', label: 'SEO' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function ProductFormPage({
  onCancel,
  onSaved,
  editingProduct,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('details')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '',
    category: '',
    type: 'Tablets',
    pack_size: '',
    composition: '',
    description: '',
    usage_dosage: '',
    safety_info: '',
    price: '',
    mrp: '',
    stock_quantity: '',
    reorder_level: '15',
    meta_title: '',
    meta_description: '',
  })

  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [imageError, setImageError] = useState('')

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        category: editingProduct.cat,
        type: editingProduct.type,
        pack_size: editingProduct.pack,
        composition: editingProduct.salt,
        description: editingProduct.desc,
        usage_dosage: editingProduct.usageDosage,
        safety_info: editingProduct.safetyInfo,
        price: String(editingProduct.price),
        mrp: String(editingProduct.mrp),
        stock_quantity: editingProduct.stock === 'In Stock' ? '50' : '5',
        reorder_level: '15',
        meta_title: editingProduct.metaTitle || '',
        meta_description: editingProduct.metaDescription || '',
      })
      setImages(editingProduct.images ?? [])
    } else {
      setForm({
        name: '',
        category: '',
        type: 'Tablets',
        pack_size: '',
        composition: '',
        description: '',
        usage_dosage: '',
        safety_info: '',
        price: '',
        mrp: '',
        stock_quantity: '',
        reorder_level: '15',
        meta_title: '',
        meta_description: '',
      })
      setImages([])
    }
    setError('')
    setImageError('')
    setActiveTab('details')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct])

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return
    setImageError('')

    const remainingSlots = MAX_IMAGES - images.length
    if (remainingSlots <= 0) {
      setImageError(`You can upload up to ${MAX_IMAGES} images per product.`)
      return
    }

    const picked = Array.from(files).slice(0, remainingSlots)
    const invalid = picked.find((f) => !f.type.startsWith('image/'))
    if (invalid) {
      setImageError('Only image files are allowed.')
      return
    }
    const tooBig = picked.find((f) => f.size > 5 * 1024 * 1024)
    if (tooBig) {
      setImageError('Each image must be under 5MB.')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const uploadedUrls: string[] = []

      for (const file of picked) {
        const ext = file.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw new Error(uploadError.message)

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(path)
        uploadedUrls.push(data.publicUrl)
      }

      setImages((prev) => [...prev, ...uploadedUrls])
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : "Couldn't upload image. Make sure the 'product-images' storage bucket exists in Supabase.",
      )
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url))
  }

  // Which tabs currently have a required field left empty — used to show a
  // small warning dot on the tab so admins don't miss anything before saving.
  const tabErrors: Record<TabId, boolean> = {
    details:
      !form.name || !form.category || !form.pack_size || !form.composition,
    media: false,
    pricing: !form.price || !form.mrp || !form.stock_quantity,
    seo: false,
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Jump to the first tab that's missing a required field, rather than
    // letting the native form validation silently fail on a hidden tab.
    const firstInvalid = TABS.find((t) => tabErrors[t.id])
    if (firstInvalid) {
      setActiveTab(firstInvalid.id)
      setError('Please fill in the required fields highlighted below.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const payload = {
        name: form.name,
        category: form.category,
        type: form.type,
        pack_size: form.pack_size,
        composition: form.composition,
        description: form.description || null,
        usage_dosage: form.usage_dosage || null,
        safety_info: form.safety_info || null,
        price: parseFloat(form.price),
        mrp: parseFloat(form.mrp),
        stock_quantity: parseInt(form.stock_quantity) || 0,
        reorder_level: parseInt(form.reorder_level) || 15,
        rating: editingProduct?.rating ?? 4.5,
        reviews_count: editingProduct?.reviews ?? 0,
        image_url: images[0] ?? null,
        images,
        is_active: true,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
      }

      if (editingProduct) {
        await updateProduct(String(editingProduct.id), payload)
      } else {
        await addProduct(payload)
      }
      onSaved()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Make sure Supabase is connected and you're logged in.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className='flex items-center gap-2 text-[13px] font-bold text-muted hover:text-forest transition-colors mb-5'
      >
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
          <path
            d='M15 19l-7-7 7-7'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        Back to Products
      </button>

      <div className='mb-6'>
        <h1 className='text-2xl font-extrabold text-navy'>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className='text-[13.5px] text-muted mt-1'>
          {editingProduct
            ? 'Update details for this product.'
            : 'Fill in the details to add a product to your catalog.'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='bg-white border border-line rounded-2xl max-w-[800px] overflow-hidden'>
          {/* Tab bar */}
          <div className='flex overflow-x-auto overflow-y-hidden border-b border-line bg-bg-soft/60'>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type='button'
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 px-5 py-3.5 text-[13px] font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-forest bg-white'
                    : 'text-muted hover:text-navy'
                }`}
              >
                <span className='inline-flex items-center gap-1.5'>
                  {tab.label}
                  {tabErrors[tab.id] && (
                    <span
                      className='w-1.5 h-1.5 rounded-full bg-[#C0392B]'
                      title='Missing required field'
                    />
                  )}
                </span>
                {activeTab === tab.id && (
                  <span className='absolute left-0 right-0 -bottom-px h-[2px] bg-forest' />
                )}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className='p-6 md:p-8 space-y-5'>
            {activeTab === 'details' && (
              <>
                <Field label='Product Name' required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className='input'
                    placeholder='e.g. Amlogard 5mg'
                  />
                </Field>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <Field label='Category' required>
                    <input
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className='input'
                      placeholder='e.g. Cardiac Care'
                    />
                  </Field>
                  <Field label='Form' required>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      className='input'
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <Field label='Pack Size' required>
                    <input
                      required
                      value={form.pack_size}
                      onChange={(e) =>
                        setForm({ ...form, pack_size: e.target.value })
                      }
                      className='input'
                      placeholder='e.g. 10x10'
                    />
                  </Field>
                  <Field label='Composition / Salt' required>
                    <input
                      required
                      value={form.composition}
                      onChange={(e) =>
                        setForm({ ...form, composition: e.target.value })
                      }
                      className='input'
                      placeholder='e.g. Amlodipine 5mg'
                    />
                  </Field>
                </div>

                <Field label='Description'>
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className='input'
                    placeholder='Short description shown in the Description tab'
                  />
                </Field>

                <Field label='Usage & Dosage'>
                  <textarea
                    rows={3}
                    value={form.usage_dosage}
                    onChange={(e) =>
                      setForm({ ...form, usage_dosage: e.target.value })
                    }
                    className='input resize-y'
                    placeholder='e.g. Take one tablet twice daily after meals, or as directed by the physician.'
                  />
                </Field>

                <Field label='Safety Info'>
                  <textarea
                    rows={3}
                    value={form.safety_info}
                    onChange={(e) =>
                      setForm({ ...form, safety_info: e.target.value })
                    }
                    className='input resize-y'
                    placeholder='e.g. Avoid in patients with known hypersensitivity. Store away from direct sunlight.'
                  />
                </Field>
              </>
            )}

            {activeTab === 'media' && (
              <Field label={`Product Images (up to ${MAX_IMAGES})`}>
                <div className='flex gap-3 flex-wrap'>
                  {images.map((url) => (
                    <div
                      key={url}
                      className='relative w-[92px] h-[92px] rounded-lg overflow-hidden border border-line group'
                    >
                      <Image
                        src={url}
                        alt='Product'
                        fill
                        sizes='92px'
                        className='object-contain p-1 bg-white'
                      />
                      <button
                        type='button'
                        onClick={() => removeImage(url)}
                        className='absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                        title='Remove image'
                      >
                        <svg
                          width='10'
                          height='10'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M6 6l12 12M18 6L6 18'
                            stroke='#fff'
                            strokeWidth='2.2'
                            strokeLinecap='round'
                          />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {images.length < MAX_IMAGES && (
                    <button
                      type='button'
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className='w-[92px] h-[92px] rounded-lg border-2 border-dashed border-line flex flex-col items-center justify-center gap-1 text-muted hover:border-forest hover:text-forest transition-colors disabled:opacity-60'
                    >
                      {uploading ? (
                        <span className='text-[10px] font-semibold'>
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path
                              d='M12 5v14M5 12h14'
                              stroke='currentColor'
                              strokeWidth='1.8'
                              strokeLinecap='round'
                            />
                          </svg>
                          <span className='text-[10px] font-semibold'>
                            Add photo
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  multiple
                  className='hidden'
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                {imageError && (
                  <p className='text-[#C0392B] text-[12px] font-semibold mt-2'>
                    {imageError}
                  </p>
                )}
                {images.length === 0 && !imageError && (
                  <p className='text-muted text-[11.5px] mt-2'>
                    No images yet — the product will show a placeholder icon
                    instead.
                  </p>
                )}
              </Field>
            )}

            {activeTab === 'pricing' && (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <Field label='Price (₹)' required>
                    <input
                      required
                      type='number'
                      step='0.01'
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className='input'
                    />
                  </Field>
                  <Field label='MRP (₹)' required>
                    <input
                      required
                      type='number'
                      step='0.01'
                      value={form.mrp}
                      onChange={(e) =>
                        setForm({ ...form, mrp: e.target.value })
                      }
                      className='input'
                    />
                  </Field>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <Field label='Stock Quantity' required>
                    <input
                      required
                      type='number'
                      value={form.stock_quantity}
                      onChange={(e) =>
                        setForm({ ...form, stock_quantity: e.target.value })
                      }
                      className='input'
                    />
                  </Field>
                  <Field label='Reorder Level'>
                    <input
                      type='number'
                      value={form.reorder_level}
                      onChange={(e) =>
                        setForm({ ...form, reorder_level: e.target.value })
                      }
                      className='input'
                    />
                  </Field>
                </div>
                <p className='text-muted text-[11.5px]'>
                  Stock shows as &quot;Low Stock&quot; on the site once quantity
                  drops to or below the reorder level.
                </p>
              </>
            )}

            {activeTab === 'seo' && (
              <>
                <Field label='Meta Title'>
                  <input
                    value={form.meta_title}
                    onChange={(e) =>
                      setForm({ ...form, meta_title: e.target.value })
                    }
                    className='input'
                    placeholder={form.name || 'Defaults to the product name'}
                    maxLength={70}
                  />
                  <p className='text-muted text-[11px] mt-1.5'>
                    Shown as the page title in Google search results and browser
                    tabs. {form.meta_title.length}/70 characters. Leave blank to
                    use the product name.
                  </p>
                </Field>

                <Field label='Meta Description'>
                  <textarea
                    rows={3}
                    value={form.meta_description}
                    onChange={(e) =>
                      setForm({ ...form, meta_description: e.target.value })
                    }
                    className='input resize-y'
                    placeholder='A short, compelling summary shown under the title in search results.'
                    maxLength={160}
                  />
                  <p className='text-muted text-[11px] mt-1.5'>
                    {form.meta_description.length}/160 characters. Leave blank
                    to auto-generate from the composition and description.
                  </p>
                </Field>

                <div className='bg-bg-soft border border-line rounded-xl p-4'>
                  <p className='text-[11px] font-extrabold text-muted uppercase tracking-wide mb-2'>
                    Search Preview
                  </p>
                  <p className='text-[#1a0dab] text-[16px] leading-snug truncate'>
                    {form.meta_title || form.name || 'Product name'}
                  </p>
                  <p className='text-[#006621] text-[12px] mt-0.5'>
                    gdntmedicare.com › product
                  </p>
                  <p className='text-[13px] text-[#545454] mt-1 line-clamp-2'>
                    {form.meta_description ||
                      `${form.composition || 'Composition'} — ${
                        form.description || 'Product description'
                      }.`}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <p className='text-[#C0392B] text-[13px] font-semibold mt-4 max-w-[800px]'>
            {error}
          </p>
        )}

        <div className='flex gap-3 pt-5 max-w-[800px]'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 sm:flex-none sm:px-8 border border-line py-3 rounded-lg font-bold text-sm text-navy'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading || uploading}
            className='flex-1 sm:flex-none sm:px-8 bg-forest text-white py-3 rounded-lg font-bold text-sm disabled:opacity-60'
          >
            {loading
              ? 'Saving...'
              : uploading
                ? 'Uploading images...'
                : editingProduct
                  ? 'Save Changes'
                  : 'Add Product'}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 14px;
          background: white;
        }
        .input:focus {
          outline: none;
          border-color: var(--forest);
          box-shadow: 0 0 0 3px var(--forest-pale);
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  children,
  required,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <div>
      <label className='block text-xs font-bold text-navy mb-1.5'>
        {label}
        {required && <span className='text-[#C0392B]'> *</span>}
      </label>
      {children}
    </div>
  )
}
