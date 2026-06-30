import fetchJson, { parseWithSchema } from '../../lib/api/axiosClient'
import { ProductListSchema, ProductList, ProductSchema, Product } from './schemas'

export async function getProducts({ page = 1, per_page = 12, search = '' } = {}): Promise<ProductList> {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('per_page', String(per_page))
  if (search) params.set('search', search)

  const res = await fetchJson(`/frontend/product-items?${params.toString()}`)
  return parseWithSchema(ProductListSchema, res)
}

export async function getProductById(id: string | number): Promise<Product> {
  // Try common product detail shapes
  try {
    const res = await fetchJson(`/frontend/product-item/${id}`)
    return parseWithSchema(ProductSchema, res)
  } catch (e) {
    // Fallback to query param style
    const res = await fetchJson(`/frontend/product-item?id=${id}`)
    // Some APIs return { data: { ... } }
    const payload = (res && res.data) ? res.data : res
    return parseWithSchema(ProductSchema, payload)
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const res = await fetchJson(`/frontend/product-item?slug=${encodeURIComponent(slug)}`)
    const payload = (res && res.data) ? res.data : res
    return parseWithSchema(ProductSchema, payload)
  } catch (e) {
    throw e
  }
}
