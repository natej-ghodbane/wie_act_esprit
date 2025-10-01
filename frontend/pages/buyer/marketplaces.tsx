import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  MapPin,
  Package,
  ArrowRight,
  Search,
  Filter,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';

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

export default function BuyerMarketplaces() {
  const router = useRouter();
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

    fetchMarketplaces();
  }, []);

  const fetchMarketplaces = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/marketplaces`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched marketplaces:', data);
        setMarketplaces(data.filter((m: Marketplace) => m.isActive));
      }
    } catch (err) {
      console.error('Error fetching marketplaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMarketplaces = marketplaces.filter(marketplace => {
    const matchesSearch = marketplace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marketplace.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
      marketplace.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const allCategories = ['All', ...Array.from(new Set(marketplaces.flatMap(m => m.categories)))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-fuchsia-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplaces...</p>
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
          onClick={() => router.push('/buyer/dashboard')}
          className={`mb-6 flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm' 
              : 'bg-white/80 hover:bg-white text-gray-700 shadow-md hover:shadow-lg'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Explore Marketplaces
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover fresh produce from local farmers
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search marketplaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:bg-white/20'
                  : 'bg-white text-gray-900 placeholder-gray-500 shadow-md focus:shadow-lg'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* Category Filter */}
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
        </div>

        {/* Marketplaces Grid */}
        {filteredMarketplaces.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {searchQuery || selectedCategory !== 'All' 
                ? 'No marketplaces found' 
                : 'No marketplaces available yet'}
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Check back later for new marketplaces'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMarketplaces.map((marketplace) => (
                <motion.div
                  key={marketplace._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                      : 'bg-white shadow-md hover:shadow-xl'
                  }`}
                  onClick={() => router.push(`/buyer/marketplaces/${marketplace.slug}`)}
                >
                  {/* Banner Image */}
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 relative">
                    {marketplace.bannerImage ? (
                      <img 
                        src={marketplace.bannerImage} 
                        alt={marketplace.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    {/* Logo */}
                    {marketplace.logoImage && (
                      <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                        <img 
                          src={marketplace.logoImage} 
                          alt={marketplace.name}
                          className="w-16 h-16 rounded-full border-4 border-white object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-8">
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {marketplace.name}
                    </h3>
                    
                    {marketplace.description && (
                      <p className={`mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {marketplace.description}
                      </p>
                    )}

                    {/* Location */}
                    {marketplace.location && (
                      <div className="flex items-center mb-3">
                        <MapPin className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {[marketplace.location.city, marketplace.location.country]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Products Count */}
                    <div className="flex items-center mb-4">
                      <Package className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {marketplace.productsCount || 0} products available
                      </span>
                    </div>

                    {/* Categories */}
                    {marketplace.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {marketplace.categories.slice(0, 3).map((category, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isDarkMode
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {category}
                          </span>
                        ))}
                        {marketplace.categories.length > 3 && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            +{marketplace.categories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Products Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/buyer/marketplaces/${marketplace.slug}`);
                      }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="font-medium">View Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
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
