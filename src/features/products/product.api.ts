import fetchJson, { parseWithSchema } from '../../lib/api/axiosClient'
import { ProductListSchema, ProductList } from './schemas'

export async function getProducts({ page = 1, per_page = 12, search = '' } = {}): Promise<ProductList> {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('per_page', String(per_page))
  if (search) params.set('search', search)

  const res = await fetchJson(`/frontend/product-items?${params.toString()}`)
  return parseWithSchema(ProductListSchema, res)
}
