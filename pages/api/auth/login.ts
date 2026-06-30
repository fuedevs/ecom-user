import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

const API_BASE = process.env.API_BASE || 'https://ecommerce.bdboibazer.com/api/v1'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  try {
    const response = await fetch(`${API_BASE}/customer-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(req.body),
    })

    const data = await (async () => {
      try { return await response.json() } catch (_) { return null }
    })()

    if (!response.ok) {
      return res.status(response.status).json(data || { message: response.statusText })
    }

    // Try to locate token in common locations
    const token = data?.token ?? data?.data?.token ?? data?.access_token ?? data?.meta?.token
    if (!token) {
      // return the api response so we can diagnose shape
      return res.status(500).json({ message: 'No token returned from API', returned: data })
    }

    const cookieSerialized = cookie.serialize('ecom_token', String(token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })

    res.setHeader('Set-Cookie', cookieSerialized)
    return res.status(200).json({ message: 'ok' })
  } catch (err: any) {
    const message = err?.message || 'Unknown error'
    return res.status(500).json({ message })
  }
}
