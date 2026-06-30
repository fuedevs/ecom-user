import { getProductById } from '../../../src/features/products/product.api'
import { ProductSchema } from '../../../src/features/products/schemas'

export const revalidate = 60

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const id = params.id
  let product
  try {
    product = await getProductById(id)
  } catch (e) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-lg font-semibold">Product not found</h2>
        <p className="text-sm text-gray-600">Unable to fetch product details.</p>
      </div>
    )
  }

  const img = product.thumbnail || product.image || null

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="h-96 bg-gray-100 flex items-center justify-center">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={product.name || ''} className="max-h-96 object-contain" />
            ) : (
              <div className="text-gray-400">No image</div>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold">{product.name || product.title}</h1>
          <p className="mt-2 text-xl text-gray-800">${product.price ?? '—'}</p>
          <div className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: product.description ?? '' }} />

          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Add to cart</button>
          </div>
        </div>
      </div>
    </main>
  )
}
