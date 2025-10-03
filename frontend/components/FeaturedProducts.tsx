import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import { productAPI } from '@/utils/api'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  organic?: boolean;
  unit?: string;
  quantity?: number;
  stockThreshold?: number;
}

const FeaturedProducts: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await productAPI.getAll({ featured: true, limit: 4 })
        setFeatured(data)
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-glass animate-pulse">
                <div className="rounded-xl bg-gray-200 dark:bg-gray-700 h-40"></div>
                <div className="mt-4 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="featured-heading" className="section-padding">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-6">
          <h2 id="featured-heading" className="text-2xl md:text-3xl font-bold text-gradient">
            Featured Products
          </h2>
          <Link href="/marketplace" className="text-sm font-medium text-primary-600 dark:text-primary-400 focus-visible:focus-visible">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06 }}
              className="card-glass group"
              aria-label={`${p.name}, ${p.price} ${p.unit}`}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img src={p.image} alt={p.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-2 left-2 bg-green-600/90 text-white text-xs px-2 py-1 rounded-full">
                  {p.organic ? 'Organic' : 'Local'}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-neutral-900 dark:text-neutral-100 font-semibold leading-tight">
                  {p.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span className="text-neutral-700 dark:text-neutral-300">{p.rating}</span>
                  </div>
                  <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    ${p.price}
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className={`mt-4 inline-flex items-center gap-2 w-full justify-center btn btn-primary ${(p.quantity && p.quantity > 0) ? '' : 'opacity-50 pointer-events-none'}`}
                  aria-disabled={!p.quantity || p.quantity <= 0}
                >
                  <ShoppingCart className="w-4 h-4" /> Buy now
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 