import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/data'

const BASE_URL = 'https://gdntmedicare.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const products = await getProducts()
    productRoutes = products.map((p) => ({
      url: `${BASE_URL}/product/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // If product data isn't available at build time (e.g. Supabase not yet
    // configured), fall back to just the static routes below.
  }

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...productRoutes,
  ]
}
