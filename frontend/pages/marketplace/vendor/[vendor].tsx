import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import BuyerSidebar from '../../../components/BuyerSidebar'
import ProductCard, { ProductUI } from '../../../components/marketplace/ProductCard'
import { marketplaceAPI, productAPI } from '@/utils/api'

function normalizeSlug(input: string): string {
  return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

const VendorMarketplace: React.FC = () => {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { vendor } = router.query

  const [vendorName, setVendorName] = useState<string>('Marketplace')
  const [products, setProducts] = useState<ProductUI[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const slug = typeof vendor === 'string' ? vendor : ''
    if (!slug) return
    let active = true
    const fetchData = async () => {
      try {
        console.log('Fetching marketplace and products for slug:', slug)
        const { data } = await marketplaceAPI.getBySlug(slug, 'products')
        console.log('Marketplace data:', data)
        if (!active) return
        
        setVendorName(data?.marketplace?.name || slug)
        
        // If we have products in the response, use them
        if (data?.products && Array.isArray(data.products)) {
          const mapped: ProductUI[] = data.products.map((p: any) => ({
            id: String(p._id || p.id),
            name: p.title,
            price: Number(p.price || 0),
            image: p.images?.[0] || '/placeholder.png',
            category: p.category,
            description: p.description,
            rating: 4.5,
            reviews: 12,
            vendorName: data?.marketplace?.name,
          }))
          setProducts(mapped)
        } else {
          // Fallback: fetch products by marketplaceId if available
          const marketplaceId = data?.marketplace?._id
          if (marketplaceId) {
            console.log('Fetching products by marketplaceId:', marketplaceId)
            const { data: productsData } = await productAPI.getAll({ marketplaceId: String(marketplaceId) })
            console.log('Products by marketplaceId:', productsData)
            const mapped: ProductUI[] = Array.isArray(productsData)
              ? productsData.map((p: any) => ({
                  id: String(p._id || p.id),
                  name: p.title,
                  price: Number(p.price || 0),
                  image: p.images?.[0] || '/placeholder.png',
                  category: p.category,
                  description: p.description,
                  rating: 4.5,
                  reviews: 12,
                  vendorName: data?.marketplace?.name,
                }))
              : []
            setProducts(mapped)
          } else {
            setProducts([])
          }
        }
      } catch (e) {
        console.error('Error fetching marketplace data:', e)
        setProducts([])
      } finally {
        if (active) setLoading(false)
      }
    }
    setLoading(true)
    fetchData()
    return () => { active = false }
  }, [vendor])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }
    try {
      const parsed = JSON.parse(userData)
      if (parsed.role !== 'buyer') {
        router.push('/auth/login')
      }
    } catch {
      router.push('/auth/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200">
      <Head>
        <title>{vendorName} | Marketplace</title>
      </Head>
      <div className="flex">
        <BuyerSidebar onLogout={handleLogout} onOpenChange={setSidebarOpen} />
        <main className={'flex-1 pt-8 pb-12 ' + (sidebarOpen ? 'md:ml-64' : '')}>
          <div className="container-custom">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{vendorName}</h1>
              <p className="text-neutral-600 dark:text-neutral-400">Vendor marketplace</p>
            </div>
            {loading ? (
              <div className="text-neutral-600 dark:text-neutral-400">Loading...</div>
            ) : products.length === 0 ? (
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
      </div>
    </div>
  )
}

export default VendorMarketplace 