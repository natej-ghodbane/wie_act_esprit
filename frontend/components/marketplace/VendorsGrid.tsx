"use client";

import Link from 'next/link'
import { mockProducts } from './data/mockData'
import { Star, MapPin, Boxes } from 'lucide-react'

function normalizeSlug(input: string): string {
  return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

interface VendorCardData {
  name: string
  slug: string
  image: string
  location?: string
  productsCount: number
  avgRating: number
  categories: string[]
}

export default function VendorsGrid() {
  const vendorMap = new Map<string, VendorCardData>()

  mockProducts.forEach(p => {
    const name = p.farmer
    const slug = normalizeSlug(name)
    const existing = vendorMap.get(name)
    if (!existing) {
      vendorMap.set(name, {
        name,
        slug,
        image: p.image,
        location: p.location,
        productsCount: 1,
        avgRating: p.rating,
        categories: [p.category],
      })
    } else {
      existing.productsCount += 1
      existing.avgRating = (existing.avgRating + p.rating) / 2
      if (!existing.categories.includes(p.category)) existing.categories.push(p.category)
    }
  })

  const vendors = Array.from(vendorMap.values())

  return (
    <div className="container-custom py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Explore Local Markets</h2>
        <p className="text-white/80">Discover vendors and enter their marketplaces</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vendors.map((v, idx) => (
          <Link key={v.slug} href={`/marketplace/vendor/${v.slug}`} className="group">
            <article
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 dark:bg-black/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_50px_rgb(236,72,153,0.25)] hover:-translate-y-0.5"
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md">
                  {v.categories.join(' • ')}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{v.name}</h3>
                {v.location && (
                  <div className="flex items-center gap-1 text-white/80 text-xs mb-2">
                    <MapPin className="w-3.5 h-3.5" /> {v.location}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span className="text-white/90">{v.avgRating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Boxes className="w-4 h-4" />
                    <span>{v.productsCount} products</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/10 to-rose-500/10 blur-2xl" />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
} 