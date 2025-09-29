"use client";

import ProductCard, { ProductUI } from './ProductCard'
import { mockProducts } from '@/components/marketplace/MarketplacePage'

const categories = ["Fruits", "Vegetables", "Dairy & Eggs", "Pantry"] as const

export default function CategorySections() {
  const byCategory: Record<string, ProductUI[]> = {}
  categories.forEach(cat => { byCategory[cat] = [] })

  mockProducts.forEach(p => {
    const cat = p.category
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push({
      id: String(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      description: p.description,
      rating: p.rating,
      reviews: p.reviews,
      vendorName: p.farmer,
    })
  })

  return (
    <div className="container-custom space-y-12">
      {categories.map(cat => (
        <section key={cat} aria-labelledby={`cat-${cat}`}>
          <div className="mb-5">
            <h2 id={`cat-${cat}`} className="text-2xl font-bold text-neutral-900 dark:text-white">
              {cat}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(byCategory[cat] || []).map((product, idx) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 70}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
} 