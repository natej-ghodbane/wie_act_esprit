'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal, 
  Star, 
  MapPin,
  Heart,
  ShoppingCart,
  Search,
  X,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import UserProfileDropdown from '@/components/UserProfileDropdown'
import { cn } from '@/utils/cn'
import ProductGrid from './ProductGrid'
import VendorsGrid from './VendorsGrid'
import { productAPI, marketplaceAPI } from '@/utils/api'

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

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
}

interface MarketplacePageProps {
  className?: string;
  user?: User;
}

export function MarketplacePage({ className, user }: MarketplacePageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [likedProducts, setLikedProducts] = useState<string[]>([])
  
  // API state
  const [products, setProducts] = useState<Product[]>([])
  const [marketplaces, setMarketplaces] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch products and marketplaces in parallel
        const [productsResponse, marketplacesResponse] = await Promise.all([
          productAPI.getAll(),
          marketplaceAPI.getAll()
        ])
        
        setProducts(productsResponse.data || [])
        setMarketplaces(marketplacesResponse.data || [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load products and marketplaces')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div className={cn('min-h-screen pt-20 pb-10', className)}>
      {/* Hero Section (navbar provided by buyer layout; keep space with padding) */}

      <section className="relative py-16 mt-16 bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#0a0a0a]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              className="text-4xl lg:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Fresh from Farm to Table
            </motion.h1>
            <motion.p
              className="text-xl text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Discover the finest organic produce from local farmers in your area
            </motion.p>
            <motion.div
              className="max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                placeholder="Search for products, farmers, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                inputSize="lg"
                className="text-center"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="py-20">
          <div className="container-custom">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-4" />
              <p className="text-gray-600">Loading products and marketplaces...</p>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      {!isLoading && !error && (
        <section className="py-10">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Fresh Products ({filteredProducts.length})
              </h2>
              
              {/* Filters and Search */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-label="Filter by category"
                    title="Select product category"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-label="Sort products"
                    title="Sort products by"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
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
                          <span className="text-2xl font-bold text-primary-600">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          className="w-full" 
                          disabled={product.inventory === 0}
                        >
                          {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
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
