import { NextApiRequest, NextApiResponse } from 'next'
import { createProxyHandler } from '../../../src/pages/api/_proxy'

// Proxy example for protected endpoint: /customer/my-orders
export default createProxyHandler((req: NextApiRequest) => {
  // Preserve query string if present
  const qs = req.url?.split('?')[1]
  return `/customer/my-orders${qs ? `?${qs}` : ''}`
})
