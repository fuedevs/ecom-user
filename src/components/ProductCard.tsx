'use client'

import Link from 'next/link'
import { Product } from '../../features/products/schemas'

export default function ProductCard({ product }: { product: Product }) {
  const img = product.thumbnail || product.image || product?.image || null
  return (
    <Link href={`/products/${product.id}`} className="block bg-white p-4 rounded shadow hover:shadow-md transition">
      <div className="h-40 bg-gray-100 flex items-center justify-center mb-3">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.name || ''} className="max-h-40 object-contain" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <h3 className="text-sm font-medium">{product.name || product.title}</h3>
      <p className="mt-2 text-sm text-gray-600">${product.price ?? '—'}</p>
    </Link>
  )
}
