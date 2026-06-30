'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../src/features/products/product.api'
import { Product } from '../../src/features/products/schemas'

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useQuery(['products', page], () => getProducts({ page }))

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {isLoading && <div>Loading...</div>}
      {isError && <div className="text-red-600">Failed to load products</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.data?.map((p: Product) => (
          <div key={String(p.id)} className="bg-white p-4 rounded shadow">
            <div className="h-40 bg-gray-100 flex items-center justify-center mb-3">
              {p.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumbnail} alt={p.name || p.title} className="max-h-40 object-contain" />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>
            <h3 className="text-sm font-medium">{p.name || p.title}</h3>
            <p className="mt-2 text-sm text-gray-600">${p.price ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((s) => Math.max(1, s - 1))}
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={page === 1}
        >
          Prev
        </button>
        <div>Page {page}</div>
        <button
          onClick={() => setPage((s) => s + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  )
}
