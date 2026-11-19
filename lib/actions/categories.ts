'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CategoryRow {
  id: string
  name: string
}

export interface CategoriesResult {
  categories: CategoryRow[]
  // true when the `categories` table has not been created yet (supabase/categories.sql not run)
  tableMissing: boolean
}

function refresh() {
  revalidatePath('/admin')
  revalidatePath('/shop')
}

function clean(name: string) {
  return name.replace(/\s+/g, ' ').trim()
}

// All categories in the master list (admin only — requires session for writes, reads are public)
export async function getCategories(): Promise<CategoriesResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) return { categories: [], tableMissing: true }
  return { categories: data ?? [], tableMissing: false }
}

export async function addCategory(
  rawName: string,
): Promise<{ ok: true; category: CategoryRow } | { ok: false; error: string }> {
  const name = clean(rawName)
  if (!name) return { ok: false, error: "Category name can't be empty." }
  if (name.length > 60)
    return {
      ok: false,
      error: 'Category name is too long (max 60 characters).',
    }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select('id, name')
    .single()

  if (error) {
    if (error.code === '23505')
      return { ok: false, error: `"${name}" already exists.` }
    return { ok: false, error: error.message }
  }
  refresh()
  return { ok: true, category: data }
}

// Rename a category and move every product that used the old name over to the new one.
export async function renameCategory(
  id: string,
  oldName: string,
  rawName: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = clean(rawName)
  if (!name) return { ok: false, error: "Category name can't be empty." }
  if (name.length > 60)
    return {
      ok: false,
      error: 'Category name is too long (max 60 characters).',
    }

  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
  if (error) {
    if (error.code === '23505')
      return { ok: false, error: `"${name}" already exists.` }
    return { ok: false, error: error.message }
  }

  if (name !== oldName) {
    const { error: pErr } = await supabase
      .from('products')
      .update({ category: name })
      .eq('category', oldName)
    if (pErr)
      return {
        ok: false,
        error: `Renamed, but couldn't update products: ${pErr.message}`,
      }
  }
  refresh()
  return { ok: true }
}

// Delete a category. Refuses if any product still uses it, so no product is left without a category.
export async function deleteCategory(
  id: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()
  const { count, error: cErr } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category', name)
  if (cErr) return { ok: false, error: cErr.message }
  if (count && count > 0) {
    return {
      ok: false,
      error: `${count} product${count === 1 ? ' is' : 's are'} still in "${name}". Move or delete them first.`,
    }
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  refresh()
  return { ok: true }
}
