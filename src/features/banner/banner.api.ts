import { ProductListSchema } from '../products/schemas'
import fetchJson from '../../lib/api/axiosClient'
import { z } from 'zod'

export const BannerSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  image: z.string().optional(),
  title: z.string().optional(),
  link: z.string().optional(),
})

export const BannerListSchema = z.object({
  data: z.array(BannerSchema).optional()
}).passthrough()

export async function getBanners() {
  const res = await fetchJson('/frontend/banners')
  const parsed = BannerListSchema.safeParse(res)
  if (!parsed.success) return { data: [] }
  return parsed.data
}

export async function getFeaturedProducts() {
  const res = await fetchJson('/frontend/featured-category-products')
  const parsed = ProductListSchema.safeParse(res)
  if (!parsed.success) return { data: [] }
  return parsed.data
}
