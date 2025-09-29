'use client'

import React, { useState, useMemo } from 'react'
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
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import UserProfileDropdown from '@/components/UserProfileDropdown'
import { cn } from '@/utils/cn'
import ProductGrid from './ProductGrid'
import VendorsGrid from './VendorsGrid'

// Mock data for products
export const mockProducts = [
  {
    id: 1,
    name: "Organic Tomatoes",
    description: "Fresh, locally grown organic tomatoes",
    price: 4.99,
    unit: "per kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
    farmer: "John's Farm",
    location: "California, USA",
    rating: 4.8,
    reviews: 124,
    category: "Vegetables",
    inStock: true,
    organic: true
  },
  {
    id: 2,
    name: "Fresh Strawberries",
    description: "Sweet and juicy strawberries from local farms",
    price: 8.99,
    unit: "per basket",
    image: "https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=400&h=300&fit=crop",
    farmer: "Berry Fields",
    location: "Oregon, USA",
    rating: 4.9,
    reviews: 89,
    category: "Fruits",
    inStock: true,
    organic: true
  },
  {
    id: 3,
    name: "Farm Fresh Eggs",
    description: "Free-range eggs from happy chickens",
    price: 6.49,
    unit: "per dozen",
    image: "https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400&h=300&fit=crop",
    farmer: "Sunrise Farm",
    location: "Iowa, USA",
    rating: 4.7,
    reviews: 156,
    category: "Dairy & Eggs",
    inStock: true,
    organic: false
  },
  {
    id: 4,
    name: "Artisanal Honey",
    description: "Raw wildflower honey harvested locally",
    price: 12.99,
    unit: "per jar",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop",
    farmer: "Golden Hive",
    location: "Montana, USA",
    rating: 4.9,
    reviews: 78,
    category: "Pantry",
    inStock: true,
    organic: true
  },
  {
    id: 5,
    name: "Fresh Lettuce Mix",
    description: "Crispy mixed greens perfect for salads",
    price: 3.99,
    unit: "per bag",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    farmer: "Green Valley",
    location: "Vermont, USA",
    rating: 4.6,
    reviews: 201,
    category: "Vegetables",
    inStock: false,
    organic: true
  },
  {
    id: 6,
    name: "Heritage Apples",
    description: "Heirloom apple varieties with rich flavors",
    price: 5.99,
    unit: "per kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
    farmer: "Orchard Hills",
    location: "Washington, USA",
    rating: 4.8,
    reviews: 143,
    category: "Fruits",
    inStock: true,
    organic: true
  },
]

const categories = ["All", "Fruits", "Vegetables", "Dairy & Eggs", "Pantry"]
const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
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
  const [likedProducts, setLikedProducts] = useState<number[]>([])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesStock = !showOnlyInStock || product.inStock
      const matchesOrganic = !showOnlyOrganic || product.organic
      return matchesSearch && matchesCategory && matchesStock && matchesOrganic
    })
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'reviews': return b.reviews - a.reviews
        default: return 0
      }
    })
    return filtered
  }, [searchQuery, selectedCategory, sortBy, showOnlyInStock, showOnlyOrganic])

  return (
    <div className={cn('min-h-screen pt-20 pb-10', className)}>
      {/* Hero Section */}
      <nav className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span>AGRI-HOPE</span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/buyer/marketplace')}
                className="text-white hover:text-pink-500 transition-colors"
              >
                Marketplace
              </button>
              <button
                onClick={() => router.push('/buyer/checkout')}
                className="text-white hover:text-pink-500 transition-colors"
              >
                Checkout
              </button>
              {user && <UserProfileDropdown user={user} />}
            </div>
          </div>
        </div>
      </nav>

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

      {/* Vendors overview - distinct market cards */}
      <section className="py-10">
        <VendorsGrid />
      </section>


    </div>
  )
}
