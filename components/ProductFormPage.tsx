'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Product, priceUnit, FORMS } from '@/lib/products'
import { addProduct, updateProduct } from '@/lib/actions/products'
import { addCategory } from '@/lib/actions/categories'
import { createClient } from '@/lib/supabase/client'
import {
  DEFAULT_RESIZE,
  MAX_CUSTOM_SIZE,
  MIN_CUSTOM_SIZE,
  SIZE_PRESETS,
  formatBytes,
  resizeImage,
  type ResizeFormat,
  type ResizeOptions,
} from '@/lib/image-resize'

interface Props {
  onCancel: () => void
  onSaved: () => void
  editingProduct?: Product | null
  /** category names to offer in the dropdown */
  categories?: string[]
  /** false until the `categories` table exists — falls back to free text */
  categoriesReady?: boolean
  onCategoriesChanged?: () => void | Promise<void>
}

const NEW_CATEGORY = '__new__'

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
  categories = [],
  categoriesReady = true,
  onCategoriesChanged,
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

  // image resize settings + last result summary
  const [resizeOn, setResizeOn] = useState(true)
  const [resizeOpts, setResizeOpts] = useState<ResizeOptions>(DEFAULT_RESIZE)
  const [resizeNote, setResizeNote] = useState('')
  const [customMode, setCustomMode] = useState(false)
  const [customSize, setCustomSize] = useState('1000')

  // inline "add new category"
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [categoryBusy, setCategoryBusy] = useState(false)
  const [categoryError, setCategoryError] = useState('')

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
        stock_quantity: String(editingProduct.stockQty),
        reorder_level: String(editingProduct.reorderLevel),
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
    setResizeNote('')
    setAddingCategory(false)
    setNewCategory('')
    setCategoryError('')
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
    // Raw originals can be big when we are going to shrink them anyway.
    const limit = resizeOn ? 25 * 1024 * 1024 : 5 * 1024 * 1024
    const tooBig = picked.find((f) => f.size > limit)
    if (tooBig) {
      setImageError(
        resizeOn
          ? 'Each image must be under 25MB.'
          : 'Each image must be under 5MB — turn on “Resize before upload” to shrink it automatically.',
      )
      return
    }

    setUploading(true)
    setResizeNote('')
    try {
      const supabase = createClient()
      const uploadedUrls: string[] = []
      let before = 0
      let after = 0

      for (const original of picked) {
        let file = original
        if (resizeOn) {
          const res = await resizeImage(original, resizeOpts)
          file = res.file
          before += res.originalBytes
          after += res.newBytes
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            `“${original.name}” is still over 5MB after resizing. Pick a smaller size or lower quality.`,
          )
        }

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
      if (resizeOn && before > 0) {
        const saved = Math.max(0, Math.round((1 - after / before) * 100))
        setResizeNote(
          `Resized ${uploadedUrls.length} image${uploadedUrls.length === 1 ? '' : 's'}: ${formatBytes(before)} → ${formatBytes(after)}${saved > 0 ? ` (${saved}% smaller)` : ''}`,
        )
      }
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

  async function handleAddCategory() {
    setCategoryBusy(true)
    setCategoryError('')
    try {
      const res = await addCategory(newCategory)
      if (!res.ok) {
        setCategoryError(res.error)
        return
      }
      setForm((f) => ({ ...f, category: res.category.name }))
      setAddingCategory(false)
      setNewCategory('')
      await onCategoriesChanged?.()
    } catch {
      setCategoryError('Could not add the category. Please try again.')
    } finally {
      setCategoryBusy(false)
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
    pricing: !form.mrp || !(parseFloat(form.mrp) > 0) || !form.stock_quantity,
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
        // The dashboard only asks for MRP; the legacy `price` column is kept equal to it.
        price: parseFloat(form.mrp),
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
        Back to products
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
                    {categoriesReady ? (
                      <>
                        <select
                          required
                          value={addingCategory ? NEW_CATEGORY : form.category}
                          onChange={(e) => {
                            if (e.target.value === NEW_CATEGORY) {
                              setAddingCategory(true)
                              setCategoryError('')
                            } else {
                              setAddingCategory(false)
                              setForm({ ...form, category: e.target.value })
                            }
                          }}
                          className='input'
                        >
                          <option value='' disabled>
                            Select a category
                          </option>
                          {Array.from(
                            new Set(
                              form.category &&
                                !categories.includes(form.category)
                                ? [...categories, form.category]
                                : categories,
                            ),
                          ).map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                          <option value={NEW_CATEGORY}>
                            ＋ Add new category…
                          </option>
                        </select>
                        {addingCategory && (
                          <div className='mt-2.5 flex gap-2'>
                            <input
                              autoFocus
                              value={newCategory}
                              maxLength={60}
                              onChange={(e) => setNewCategory(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  if (newCategory.trim()) handleAddCategory()
                                }
                              }}
                              placeholder='New category name'
                              className='input'
                            />
                            <button
                              type='button'
                              onClick={handleAddCategory}
                              disabled={
                                categoryBusy || newCategory.trim() === ''
                              }
                              className='shrink-0 bg-forest text-white px-4 rounded-lg text-[13px] font-bold disabled:opacity-50'
                            >
                              {categoryBusy ? 'Adding…' : 'Add'}
                            </button>
                          </div>
                        )}
                        {categoryError && (
                          <p className='text-[#C0392B] text-[12px] font-semibold mt-1.5'>
                            {categoryError}
                          </p>
                        )}
                      </>
                    ) : (
                      <input
                        required
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        className='input'
                        placeholder='e.g. Cardiac Care'
                      />
                    )}
                  </Field>
                  <Field label='Form' required>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      className='input'
                    >
                      {FORMS.map((t) => (
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
                {/* Image resize settings */}
                <div className='mb-4 rounded-xl border border-line bg-bg-soft/70 p-4'>
                  <label className='flex items-start gap-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={resizeOn}
                      onChange={(e) => setResizeOn(e.target.checked)}
                      className='mt-0.5 w-4 h-4 accent-[#0F6E4E]'
                    />
                    <span>
                      <span className='block text-[13px] font-bold text-navy'>
                        Resize before upload
                      </span>
                      <span className='block text-[11.5px] text-muted mt-0.5'>
                        Shrinks big photos in your browser first — faster
                        uploads and a faster website. Never enlarges small
                        images.
                      </span>
                    </span>
                  </label>

                  {resizeOn && (
                    <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                      <div>
                        <label className='block text-[11.5px] font-bold text-navy mb-1.5'>
                          Longest side
                        </label>
                        <select
                          value={
                            customMode
                              ? 'custom'
                              : (resizeOpts.maxSize ?? 'original')
                          }
                          onChange={(e) => {
                            const v = e.target.value
                            if (v === 'custom') {
                              setCustomMode(true)
                              setResizeOpts({
                                ...resizeOpts,
                                maxSize: Number(customSize) || 1000,
                              })
                            } else {
                              setCustomMode(false)
                              setResizeOpts({
                                ...resizeOpts,
                                maxSize: v === 'original' ? null : Number(v),
                              })
                            }
                          }}
                          className='input'
                        >
                          {SIZE_PRESETS.map((o) => (
                            <option key={o.label} value={o.value ?? 'original'}>
                              {o.label}
                            </option>
                          ))}
                          <option value='custom'>Custom size…</option>
                        </select>
                        {customMode && (
                          <div className='mt-2'>
                            <div className='flex items-center gap-2'>
                              <input
                                type='number'
                                min={MIN_CUSTOM_SIZE}
                                max={MAX_CUSTOM_SIZE}
                                step={50}
                                value={customSize}
                                onChange={(e) => {
                                  setCustomSize(e.target.value)
                                  const n = Number(e.target.value)
                                  if (
                                    n >= MIN_CUSTOM_SIZE &&
                                    n <= MAX_CUSTOM_SIZE
                                  ) {
                                    setResizeOpts({ ...resizeOpts, maxSize: n })
                                  }
                                }}
                                className='input'
                                aria-label='Custom longest side in pixels'
                              />
                              <span className='text-[12px] text-muted font-semibold'>
                                px
                              </span>
                            </div>
                            <p className='text-[11px] text-muted mt-1'>
                              {MIN_CUSTOM_SIZE}–{MAX_CUSTOM_SIZE} px. Smaller
                              number = smaller image, bigger number = larger
                              image.
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className='block text-[11.5px] font-bold text-navy mb-1.5'>
                          Format
                        </label>
                        <select
                          value={resizeOpts.format}
                          onChange={(e) =>
                            setResizeOpts({
                              ...resizeOpts,
                              format: e.target.value as ResizeFormat,
                            })
                          }
                          className='input'
                        >
                          <option value='webp'>WebP (smallest)</option>
                          <option value='jpeg'>JPEG (most compatible)</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-[11.5px] font-bold text-navy mb-1.5'>
                          Quality: {Math.round(resizeOpts.quality * 100)}%
                        </label>
                        <input
                          type='range'
                          min={60}
                          max={100}
                          step={5}
                          value={Math.round(resizeOpts.quality * 100)}
                          onChange={(e) =>
                            setResizeOpts({
                              ...resizeOpts,
                              quality: Number(e.target.value) / 100,
                            })
                          }
                          className='w-full accent-[#0F6E4E]'
                        />
                      </div>
                      <label
                        className={`flex items-center gap-2.5 text-[12.5px] font-semibold text-navy sm:pt-6 ${
                          resizeOpts.maxSize ? 'cursor-pointer' : 'opacity-50'
                        }`}
                      >
                        <input
                          type='checkbox'
                          disabled={!resizeOpts.maxSize}
                          checked={resizeOpts.square && !!resizeOpts.maxSize}
                          onChange={(e) =>
                            setResizeOpts({
                              ...resizeOpts,
                              square: e.target.checked,
                            })
                          }
                          className='w-4 h-4 accent-[#0F6E4E]'
                        />
                        Fit in a square (white background)
                      </label>
                      <label
                        className={`flex items-start gap-2.5 text-[12.5px] font-semibold text-navy sm:col-span-2 ${
                          resizeOpts.maxSize ? 'cursor-pointer' : 'opacity-50'
                        }`}
                      >
                        <input
                          type='checkbox'
                          disabled={!resizeOpts.maxSize}
                          checked={
                            resizeOpts.allowUpscale && !!resizeOpts.maxSize
                          }
                          onChange={(e) =>
                            setResizeOpts({
                              ...resizeOpts,
                              allowUpscale: e.target.checked,
                            })
                          }
                          className='w-4 h-4 mt-0.5 accent-[#0F6E4E]'
                        />
                        <span>
                          Also make small images bigger
                          <span className='block text-[11px] font-normal text-muted'>
                            Enlarges photos smaller than the size above. They
                            may look slightly blurry.
                          </span>
                        </span>
                      </label>
                    </div>
                  )}
                </div>

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
                          {resizeOn ? 'Resizing…' : 'Uploading…'}
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
                {resizeNote && !imageError && (
                  <p className='text-forest text-[12px] font-bold mt-2'>
                    ✓ {resizeNote}
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
                <Field label='MRP (₹)' required>
                  <div className='relative max-w-[320px]'>
                    <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-[14px] font-semibold'>
                      ₹
                    </span>
                    <input
                      required
                      type='number'
                      min='0'
                      step='0.01'
                      value={form.mrp}
                      onChange={(e) =>
                        setForm({ ...form, mrp: e.target.value })
                      }
                      className='input'
                      style={{ paddingLeft: 30 }}
                      placeholder='0.00'
                    />
                  </div>
                  <p className='text-muted text-[11.5px] mt-1.5'>
                    Maximum retail price per {priceUnit(form.type)} — this is
                    the price shown on the website.
                  </p>
                </Field>

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
