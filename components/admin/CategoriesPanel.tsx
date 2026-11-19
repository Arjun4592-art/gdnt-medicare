'use client'

import { useState, type FormEvent } from 'react'
import { Product, priceUnit } from '@/lib/products'
import {
  addCategory,
  deleteCategory,
  renameCategory,
  type CategoryRow,
} from '@/lib/actions/categories'
import {
  Badge,
  Card,
  EmptyState,
  GhostButton,
  Icon,
  IconButton,
  Modal,
  PageHeader,
  PrimaryButton,
  Td,
  Th,
  useToast,
} from './ui'
import Thumb from './Thumb'

interface Row {
  id: string | null // null = only exists on products (table not set up yet)
  name: string
  items: Product[]
}

export default function CategoriesPanel({
  products,
  categories,
  tableMissing,
  onChanged,
}: {
  products: Product[]
  categories: CategoryRow[]
  tableMissing: boolean
  onChanged: () => Promise<void> | void
}) {
  const toast = useToast()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<Row | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renameError, setRenameError] = useState('')
  const [deleting, setDeleting] = useState<Row | null>(null)
  const [busy, setBusy] = useState(false)

  const byName = products.reduce<Record<string, Product[]>>((acc, p) => {
    ;(acc[p.cat] ||= []).push(p)
    return acc
  }, {})

  // Master list = categories table. Before the table exists, fall back to what products use.
  const rows: Row[] = tableMissing
    ? Object.keys(byName)
        .sort()
        .map((name) => ({ id: null, name, items: byName[name] }))
    : categories.map((c) => ({ id: c.id, name: c.name, items: byName[c.name] ?? [] }))

  const active = rows.find((r) => r.name === selected) ?? rows[0] ?? null
  const unlisted = tableMissing
    ? []
    : Object.keys(byName).filter(
        (n) => !categories.some((c) => c.name.toLowerCase() === n.toLowerCase()),
      )

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setAdding(true)
    setAddError('')
    try {
      const res = await addCategory(newName)
      if (!res.ok) {
        setAddError(res.error)
        return
      }
      setNewName('')
      setSelected(res.category.name)
      toast.success(`Category “${res.category.name}” added`)
      await onChanged()
    } catch {
      setAddError('Something went wrong. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  async function addUnlisted(name: string) {
    const res = await addCategory(name)
    if (!res.ok) return toast.error(res.error)
    toast.success(`Category “${name}” added to the list`)
    await onChanged()
  }

  async function confirmRename(e: FormEvent) {
    e.preventDefault()
    if (!renaming?.id) return
    setBusy(true)
    setRenameError('')
    try {
      const res = await renameCategory(renaming.id, renaming.name, renameValue)
      if (!res.ok) {
        setRenameError(res.error)
        return
      }
      toast.success('Category renamed')
      setSelected(renameValue.replace(/\s+/g, ' ').trim())
      setRenaming(null)
      await onChanged()
    } catch {
      setRenameError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function confirmDelete() {
    if (!deleting?.id) return
    setBusy(true)
    try {
      const res = await deleteCategory(deleting.id, deleting.name)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success(`Category “${deleting.name}” deleted`)
      setSelected(null)
      setDeleting(null)
      await onChanged()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title='Categories'
        subtitle='Create and organise the categories used by your products and the shop filters.'
      />

      {tableMissing && (
        <div className='mb-6 flex gap-3 bg-[#FDF3E3] border border-[#C79A48]/40 text-[#7A5410] rounded-xl px-4 py-3.5 text-[13px]'>
          <Icon name='alert' size={18} className='shrink-0 mt-0.5' />
          <p>
            <b>One-time setup needed.</b> Open Supabase → SQL Editor and run the
            file <code className='font-mono'>supabase/categories.sql</code>. After
            that you can add, rename and delete categories here. Until then the
            list below is read-only and built from your existing products.
          </p>
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className='mb-6 bg-white border border-line rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-start gap-3 shadow-[0_1px_2px_rgba(20,24,31,0.04)]'
      >
        <div className='flex-1'>
          <label
            htmlFor='new-category'
            className='block text-[12px] font-bold text-navy mb-1.5'
          >
            New category
          </label>
          <input
            id='new-category'
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value)
              setAddError('')
            }}
            disabled={tableMissing || adding}
            maxLength={60}
            placeholder='e.g. Vitamins & Supplements'
            className='w-full border border-line rounded-lg px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-forest/25 focus:border-forest disabled:bg-bg-soft'
          />
          {addError && (
            <p role='alert' className='text-[#C0392B] text-[12px] font-semibold mt-1.5'>
              {addError}
            </p>
          )}
        </div>
        <div className='sm:pt-[26px]'>
          <PrimaryButton
            type='submit'
            icon='plus'
            disabled={tableMissing || adding || newName.trim() === ''}
          >
            {adding ? 'Adding…' : 'Add category'}
          </PrimaryButton>
        </div>
      </form>

      {unlisted.length > 0 && (
        <div className='mb-6 bg-white border border-line rounded-xl px-4 py-3.5 text-[13px]'>
          <p className='font-bold text-navy mb-2'>
            Used by products but not in your list yet:
          </p>
          <div className='flex flex-wrap gap-2'>
            {unlisted.map((n) => (
              <button
                key={n}
                onClick={() => addUnlisted(n)}
                className='inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-full border border-dashed border-forest text-forest hover:bg-forest-pale transition-colors'
              >
                <Icon name='plus' size={12} /> {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState
          icon='categories'
          title='No categories yet'
          text='Add your first category above, then pick it when you add a product.'
        />
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-5 items-start'>
          <Card flush>
            <table className='w-full'>
              <thead>
                <tr>
                  <Th>Category</Th>
                  <Th>Products</Th>
                  <Th className='text-right'>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isActive = active?.name === r.name
                  return (
                    <tr
                      key={r.name}
                      onClick={() => setSelected(r.name)}
                      className={`cursor-pointer transition-colors ${
                        isActive ? 'bg-forest-pale/70' : 'hover:bg-bg-soft/70'
                      }`}
                    >
                      <Td
                        className={`font-bold ${isActive ? 'text-forest' : 'text-navy'}`}
                      >
                        {r.name}
                      </Td>
                      <Td>
                        <Badge tone={r.items.length ? 'navy' : 'gray'}>
                          {r.items.length}
                        </Badge>
                      </Td>
                      <Td>
                        <div
                          className='flex gap-2 justify-end'
                          onClick={(e) => e.stopPropagation()}
                        >
                          {r.id && (
                            <>
                              <IconButton
                                icon='edit'
                                title='Rename'
                                onClick={() => {
                                  setRenaming(r)
                                  setRenameValue(r.name)
                                  setRenameError('')
                                }}
                              />
                              <IconButton
                                icon='trash'
                                title='Delete'
                                tone='danger'
                                onClick={() => setDeleting(r)}
                              />
                            </>
                          )}
                        </div>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>

          {active && (
            <Card
              title={active.name}
              action={
                <Badge tone='green'>
                  {active.items.length}{' '}
                  {active.items.length === 1 ? 'product' : 'products'}
                </Badge>
              }
              flush
            >
              {active.items.length === 0 ? (
                <p className='px-6 py-10 text-center text-[13.5px] text-muted'>
                  No products in this category yet.
                </p>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full min-w-[460px]'>
                    <thead>
                      <tr>
                        <Th>Product</Th>
                        <Th>MRP</Th>
                        <Th>Stock</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.items.map((p) => (
                        <tr key={p.id} className='hover:bg-bg-soft/70'>
                          <Td>
                            <div className='flex items-center gap-3'>
                              <Thumb product={p} size={34} />
                              <span className='font-bold text-navy'>{p.name}</span>
                            </div>
                          </Td>
                          <Td>
                            <b className='text-navy'>₹{p.mrp.toLocaleString('en-IN')}</b>{' '}
                            <span className='text-[11px] text-muted'>
                              / {priceUnit(p.type)}
                            </span>
                          </Td>
                          <Td>
                            <Badge tone={p.stock === 'In Stock' ? 'green' : 'red'} dot>
                              {p.stock}
                            </Badge>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {renaming && (
        <Modal title='Rename category' onClose={() => !busy && setRenaming(null)}>
          <form onSubmit={confirmRename}>
            <label className='block text-[12.5px] font-bold text-navy mb-2'>
              Category name
            </label>
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              maxLength={60}
              className='w-full border border-line rounded-lg px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-forest/25 focus:border-forest'
            />
            {renaming.items.length > 0 && (
              <p className='text-[12px] text-muted mt-2'>
                {renaming.items.length} product
                {renaming.items.length === 1 ? '' : 's'} will move to the new name
                automatically.
              </p>
            )}
            {renameError && (
              <p role='alert' className='text-[#C0392B] text-[12.5px] font-semibold mt-2'>
                {renameError}
              </p>
            )}
            <div className='flex justify-end gap-3 mt-6'>
              <GhostButton onClick={() => setRenaming(null)} disabled={busy}>
                Cancel
              </GhostButton>
              <PrimaryButton
                type='submit'
                disabled={busy || renameValue.trim() === ''}
              >
                {busy ? 'Saving…' : 'Save'}
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal title='Delete category' onClose={() => !busy && setDeleting(null)}>
          {deleting.items.length > 0 ? (
            <p className='text-[13.5px] text-muted'>
              “{deleting.name}” still has {deleting.items.length} product
              {deleting.items.length === 1 ? '' : 's'}. Move{' '}
              {deleting.items.length === 1 ? 'it' : 'them'} to another category
              (or delete {deleting.items.length === 1 ? 'it' : 'them'}) before
              removing this category.
            </p>
          ) : (
            <p className='text-[13.5px] text-muted'>
              Delete “{deleting.name}”? This can&apos;t be undone.
            </p>
          )}
          <div className='flex justify-end gap-3 mt-6'>
            <GhostButton onClick={() => setDeleting(null)} disabled={busy}>
              {deleting.items.length > 0 ? 'Close' : 'Cancel'}
            </GhostButton>
            {deleting.items.length === 0 && (
              <button
                type='button'
                onClick={confirmDelete}
                disabled={busy}
                className='bg-[#C0392B] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50'
              >
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
