export type ProductIcon = 'tablet' | 'syrup' | 'capsule' | 'ointment'

export interface Product {
  id: number
  name: string
  cat: string
  type: string
  pack: string
  salt: string
  desc: string
  usageDosage: string
  safetyInfo: string
  price: number
  mrp: number
  stock: 'In Stock' | 'Low Stock'
  stockQty: number
  reorderLevel: number
  rating: number
  reviews: number
  tagColor: string
  icon: ProductIcon
  images: string[]
  metaTitle?: string
  metaDescription?: string
}

// Discount % off MRP, derived from price vs mrp (rounded down). Returns 0 if no real discount.
/**
 * The price we store is for ONE unit, not the whole carton.
 * Tablets and capsules are sold per strip; everything else (syrup, ointment, etc.) per box.
 */
export function priceUnit(type: string): string {
  const t = type.toLowerCase()
  if (t === 'tablets' || t === 'capsules') return 'strip'
  return 'box'
}

export function getDiscountPercent(price: number, mrp: number): number {
  if (!mrp || mrp <= price) return 0
  return Math.floor(((mrp - price) / mrp) * 100)
}

// Suggested categories shown in the Shop page filter sidebar.
// These are independent of whatever categories exist in your live product data —
// edit this list to match the categories you actually use.
export const CATEGORIES = [
  'Cardiac Care',
  'Diabetes Care',
  'Respiratory',
  'Gastro Care',
  'Wellness',
  'Antibiotics',
  'Skin Care',
  'Pain Relief',
  'Cold & Allergy',
]

// Product forms — used by BOTH the shop "Form" filter and the admin Add/Edit
// Product "Form" dropdown, so the two can never drift apart.
export const FORMS = [
  'Tablets',
  'Capsules',
  'Syrup',
  'Injection',
  'Ointment',
  'Powder',
]

/**
 * Single source of truth for the category list. The shop filter sidebar and the
 * admin Add/Edit Product dropdown BOTH build their list with this function:
 * categories saved in the `categories` table + any category a product already
 * uses (case-insensitive de-dupe, A-Z).
 */
export function mergeCategoryNames(
  tableNames: string[] = [],
  productCats: string[] = [],
): string[] {
  const seen = new Map<string, string>()
  for (const raw of [...tableNames, ...productCats]) {
    const name = (raw ?? '').replace(/\s+/g, ' ').trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (!seen.has(key)) seen.set(key, name)
  }
  return Array.from(seen.values()).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  )
}
