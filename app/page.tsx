import { ProductListSchema } from '../src/features/products/schemas'
import { getProducts } from '../src/features/products/product.api'
import { getBanners, getFeaturedProducts } from '../src/features/banner/banner.api'
import ProductCard from '../src/components/ProductCard'

export const revalidate = 60 // ISR for 60s

export default async function LandingPage() {
  const [productsResp, bannersResp, featuredResp] = await Promise.all([
    getProducts({ page: 1, per_page: 9 }),
    getBanners(),
    getFeaturedProducts(),
  ])

  const products = productsResp?.data ?? []
  const banners = bannersResp?.data ?? []
  const featured = featuredResp?.data ?? []

  return (
    <main className="max-w-6xl mx-auto p-6">
      <section className="mb-8">
        {banners.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map((b: any) => (
              <div key={b.id} className="h-44 bg-gray-100 rounded overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt={b.title || 'banner'} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-44 bg-gray-200 rounded mb-4 flex items-center justify-center">Banner</div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((p: any) => (
            <ProductCard key={String(p.id)} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p: any) => (
            <ProductCard key={String(p.id)} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
