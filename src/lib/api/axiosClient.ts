import { z, ZodType } from 'zod'

const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://ecommerce.bdboibazer.com/api/v1'

export type FetchInit = RequestInit & { skipJsonParse?: boolean }

export async function fetchJson<T = any>(path: string, init: FetchInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${apiBase}${path}`
  const headers = Object.assign({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }, init.headers || {})

  const res = await fetch(url, {
    credentials: 'include', // send cookies (HttpOnly auth cookie)
    ...init,
    headers,
  })

  const text = await res.text()
  let data: any = undefined
  try {
    data = text ? JSON.parse(text) : null
  } catch (e) {
    // non-json response
    data = text
  }

  if (!res.ok) {
    // normalize
    const err = data || { message: res.statusText }
    // attach status for callers
    err.status = res.status
    throw err
  }

  return data as T
}

export function parseWithSchema<T>(schema: ZodType<T>, data: unknown): T {
  return schema.parse(data)
}

export default fetchJson
