import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Store,
  Package,
  ShoppingCart,
  Heart,
  Star,
  Search,
  Filter,
  Grid3x3,
  List
} from 'lucide-react';
import { addItem, getCart } from '@/utils/cart';

interface Marketplace {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  location?: {
    country?: string;
    city?: string;
    address?: string;
  };
  bannerImage?: string;
  logoImage?: string;
  categories: string[];
  productsCount?: number;
  isActive: boolean;
}

interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  unit: string;
  category: string;
  images: string[];
  inventory: {
    quantity: number;
    available: number;
  };
  isActive: boolean;
  marketplaceId: string;
  vendorId: string;
}

export default function MarketplaceProducts() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'buyer') {
      router.push('/auth/login');
      return;
    }

    if (slug) {
      fetchMarketplaceAndProducts();
    }
  }, [slug]);

  const fetchMarketplaceAndProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/marketplaces/${slug}?include=products`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched marketplace and products:', data);
        setMarketplace(data.marketplace);
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching marketplace:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = (productId: string) => {
    setLikedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory && product.isActive;
  });

  const allCategories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleAddToCart = (p: Product) => {
    if ((p as any).inventory === 0) return;
    addItem({ id: p._id, name: p.title, price: p.price, quantity: 1 });
    const exists = getCart().some(i => i.id === p._id);
    if (exists) {
      setJustAddedId(p._id);
      setTimeout(() => setJustAddedId(prev => (prev === p._id ? null : prev)), 1200);
    } else {
      alert('Could not add to cart. Please check browser storage settings.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-fuchsia-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  if (!marketplace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-fuchsia-100">
        <div className="text-center">
          <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Marketplace not found</h3>
          <button
            onClick={() => router.push('/buyer/marketplaces')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
          >
            Back to Marketplaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
        : 'bg-gradient-to-br from-purple-100 via-pink-50 to-fuchsia-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/buyer/marketplaces')}
          className={`mb-6 flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm' 
              : 'bg-white/80 hover:bg-white text-gray-700 shadow-md hover:shadow-lg'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Marketplaces</span>
        </motion.button>

        {/* Marketplace Header */}
        <div className={`rounded-2xl overflow-hidden mb-8 ${
          isDarkMode
            ? 'bg-white/10 backdrop-blur-md border border-white/20'
            : 'bg-white shadow-lg'
        }`}>
          {/* Banner */}
          <div className="h-64 bg-gradient-to-br from-purple-500 to-pink-500 relative">
            {marketplace.bannerImage ? (
              <img 
                src={marketplace.bannerImage} 
                alt={marketplace.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="w-24 h-24 text-white/50" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {marketplace.logoImage && (
                  <img 
                    src={marketplace.logoImage} 
                    alt={marketplace.name}
                    className="w-20 h-20 rounded-full border-4 border-white object-cover mb-4"
                  />
                )}
                <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {marketplace.name}
                </h1>
                {marketplace.description && (
                  <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {marketplace.description}
                  </p>
                )}
                {marketplace.location && (
                  <div className="flex items-center mb-4">
                    <MapPin className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {[marketplace.location.address, marketplace.location.city, marketplace.location.country]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
                {/* Categories */}
                {marketplace.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {marketplace.categories.map((category, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={`text-center px-6 py-4 rounded-xl ${
                isDarkMode ? 'bg-white/10' : 'bg-gray-50'
              }`}>
                <Package className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {products.length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:bg-white/20'
                    : 'bg-white text-gray-900 placeholder-gray-500 shadow-md focus:shadow-lg'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : isDarkMode
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-white text-gray-700 shadow-md'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : isDarkMode
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-white text-gray-700 shadow-md'
                }`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Category Filter */}
          {allCategories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                      : 'bg-white text-gray-700 hover:shadow-md'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {searchQuery || selectedCategory !== 'All' 
                ? 'No products found' 
                : 'No products available yet'}
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filters'
                : 'This marketplace hasn\'t added any products yet'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                      : 'bg-white shadow-md hover:shadow-xl'
                  } ${viewMode === 'list' ? 'flex' : ''}`}
                >
                  {/* Product Image */}
                  <div className={`bg-gradient-to-br from-purple-400 to-pink-400 ${
                    viewMode === 'grid' ? 'h-48' : 'w-48 h-48'
                  } relative`}>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    {/* Like Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleLike(product._id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          likedProducts.includes(product._id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600'
                        }`}
                      />
                    </motion.button>
                    {/* Stock Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (product as any).inventory > 0
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {(product as any).inventory > 0 
                          ? `${(product as any).inventory} in stock`
                          : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {product.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                    
                    {product.description && (
                      <p className={`mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-end justify-between">
                      <div>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${product.price.toFixed(2)}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {product.unit}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={(product as any).inventory === 0}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                          (product as any).inventory === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : justAddedId === product._id
                              ? 'bg-green-600'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg'
                        } text-white`}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{justAddedId === product._id ? 'Added' : 'Add to Cart'}</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
