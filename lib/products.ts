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
  rating: number
  reviews: number
  tagColor: string
  icon: ProductIcon
  images: string[]
}

// Discount % off MRP, derived from price vs mrp (rounded down). Returns 0 if no real discount.
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
