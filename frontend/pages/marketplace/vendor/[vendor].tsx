import React, { useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { mockProducts } from '@/components/marketplace/MarketplacePage'
import ProductCard, { ProductUI } from '@/components/marketplace/ProductCard'

function normalizeSlug(input: string): string {
  return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

const VendorMarketplace: React.FC = () => {
  const router = useRouter()
  const { vendor } = router.query

  const { vendorName, products } = useMemo(() => {
    const slug = typeof vendor === 'string' ? vendor : ''
    const matched = mockProducts.filter(p => normalizeSlug(p.farmer) === slug)
    const mapped: ProductUI[] = matched.map(p => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      description: p.description,
      rating: p.rating,
      reviews: p.reviews,
      vendorName: p.farmer,
    }))
    return { vendorName: matched[0]?.farmer || slug, products: mapped }
  }, [vendor])

  return (
    <>
      <Head>
        <title>{vendorName} | Marketplace</title>
      </Head>
      <main className="min-h-screen pt-24 pb-12">
        <div className="container-custom">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{vendorName}</h1>
            <p className="text-neutral-600 dark:text-neutral-400">Vendor marketplace</p>
          </div>
          {products.length === 0 ? (
            <div className="text-neutral-600 dark:text-neutral-400">No products found for this vendor.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default VendorMarketplace 