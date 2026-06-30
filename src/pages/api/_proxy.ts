import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

const API_BASE = process.env.API_BASE || 'https://ecommerce.bdboibazer.com/api/v1'

export function createProxyHandler(getTargetUrl: (req: NextApiRequest) => string) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const cookies = cookie.parse(req.headers.cookie || '')
      const token = cookies['ecom_token']

      const targetUrl = getTargetUrl(req)

      const headers: Record<string, string> = {
        Accept: 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      // Copy content-type if present
      if (req.headers['content-type']) headers['Content-Type'] = String(req.headers['content-type'])

      const fetchRes = await fetch(`${API_BASE}${targetUrl}`, {
        method: req.method,
        headers,
        body: ['GET', 'HEAD'].includes(String(req.method)) ? undefined : JSON.stringify(req.body),
      })

      const text = await fetchRes.text()
      let body: any = null
      try { body = text ? JSON.parse(text) : null } catch { body = text }

      // If unauthorized, clear cookie
      if (fetchRes.status === 401 || fetchRes.status === 403) {
        const cookieSerialized = cookie.serialize('ecom_token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 0,
        })
        res.setHeader('Set-Cookie', cookieSerialized)
      }

      // Forward status and body
      res.status(fetchRes.status).json(body)
    } catch (err: any) {
      const message = err?.message || 'Proxy error'
      res.status(500).json({ message })
    }
  }
}
