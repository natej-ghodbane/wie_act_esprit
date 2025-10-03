'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import VendorsGrid from './VendorsGrid'
import { cn } from '@/utils/cn'

// Product interface matching backend schema
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  inventory: number;
  vendorId: string;
  marketplaceId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = ["All", "Fruits", "Vegetables", "Dairy & Eggs", "Pantry", "Grains", "Herbs", "Meat"]
const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
]

export function MarketplacePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)

  // API state
  const [products, setProducts] = useState<Product[]>([])
  const [marketplaces, setMarketplaces] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products and marketplaces
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [productsRes, marketplacesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/marketplaces'),
        ])

        if (!productsRes.ok) throw new Error('Failed to fetch products')
        if (!marketplacesRes.ok) throw new Error('Failed to fetch marketplaces')

        const productsData = await productsRes.json()
        const marketplacesData = await marketplacesRes.json()

        setProducts(productsData || [])
        setMarketplaces(marketplacesData || [])
        console.log('Products:', productsData)
        console.log('Marketplaces:', marketplacesData)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesStock = !showOnlyInStock || product.inventory > 0
      const matchesActive = product.isActive
      return matchesSearch && matchesCategory && matchesStock && matchesActive
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.title.localeCompare(b.title)
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default: return 0
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, sortBy, showOnlyInStock])

  return (
    <div className={cn('min-h-screen pt-20 pb-10')}>
      {/* Hero Section */}
      <section className="relative py-16 mt-16 bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#0a0a0a]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <motion.h1 className="text-4xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Fresh from Farm to Table
          </motion.h1>
          <motion.p className="text-xl text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Discover the finest organic produce from local farmers in your area
          </motion.p>
          <Input
            placeholder="Search for products, farmers, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            inputSize="lg"
            className="max-w-xl mx-auto text-center"
          />
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <section className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading products and marketplaces...</p>
        </section>
      )}

      {/* Error */}
      {error && (
        <section className="py-20 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </section>
      )}

      {/* Products */}
      {!isLoading && !error && (
        <section className="py-10 container-custom">
          <h2 className="text-2xl font-bold mb-4">Fresh Products ({filteredProducts.length})</h2>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="flex-1"
            />

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card key={product._id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={product.image || '/placeholder.png'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">{product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" disabled={product.inventory === 0}>
                      {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No products found matching your criteria.</p>
          )}
        </section>
      )}
      {/* Vendors overview - distinct market cards */}
      {!isLoading && !error && (
        <section className="py-10">
          <VendorsGrid />
        </section>
      )}

    </div>
  )
}
