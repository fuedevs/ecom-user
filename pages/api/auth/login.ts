import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import cookie from 'cookie'

const API_BASE = process.env.API_BASE || 'https://ecommerce.bdboibazer.com/api/v1'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  try {
    // proxy credentials to Laravel
    const { data } = await axios.post(`${API_BASE}/customer-login`, req.body, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })

    // Expect the Laravel response to include a token in data.token (adjust as needed)
    const token = data?.token
    if (!token) {
      return res.status(500).json({ message: 'No token returned from API' })
    }

    // Set HttpOnly cookie
    const cookieSerialized = cookie.serialize('ecom_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    res.setHeader('Set-Cookie', cookieSerialized)
    // Return minimal payload to the client
    return res.status(200).json({ message: 'ok' })
  } catch (err: any) {
    const status = err?.response?.status || 500
    const payload = err?.response?.data || { message: err.message }
    return res.status(status).json(payload)
  }
}
