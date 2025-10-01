import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  Sun,
  Moon,
  Leaf,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  unit: string;
  inventory: number;
  marketplaceId: string;
  isActive: boolean;
  images?: string[];
}

export default function VendorInventory() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', parsedUser);
      console.log('User ID:', parsedUser.id);
      console.log('User role:', parsedUser.role);
      
      if (parsedUser.role !== 'farmer') {
        router.push('/auth/login');
        return;
      }
      setUser(parsedUser);
      fetchProducts(parsedUser.id);
    } catch (error) {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    // Filter products based on search and status
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'low') {
      filtered = filtered.filter(product => 
        product.inventory > 0 && product.inventory < 10
      );
    } else if (filterStatus === 'out') {
      filtered = filtered.filter(product => product.inventory === 0);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, filterStatus, products]);

  const fetchProducts = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      console.log('=== FETCHING PRODUCTS ===');
      console.log('User ID from parameter:', userId);
      console.log('Token:', token ? 'Token exists' : 'No token');
      
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products?vendorId=${userId}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products count:', data.length);
        console.log('Fetched products data:', data);
        setProducts(data);
        setFilteredProducts(data);
      } else {
        const errorText = await response.text();
        console.error('Error response status:', response.status);
        console.error('Error response text:', errorText);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (available: number) => {
    if (available === 0) return { status: 'Out of Stock', color: 'red', icon: AlertCircle };
    if (available < 10) return { status: 'Low Stock', color: 'amber', icon: AlertCircle };
    return { status: 'In Stock', color: 'green', icon: CheckCircle };
  };

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.inventory > 0 && p.inventory < 10).length;
  const outOfStockCount = products.filter(p => p.inventory === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.inventory), 0);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-700 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
          : 'bg-gradient-to-br from-purple-100 via-pink-100 to-fuchsia-100'
      }`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-300 border-l-transparent shadow-lg"
            />
            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-500" />
          </div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
          >
            Loading inventory...
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
        : 'bg-gradient-to-br from-purple-100 via-pink-100 to-fuchsia-100'
    }`}>
      {/* Animated gradient blobs for light mode */}
      {!isDarkMode && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-400/40 to-rose-400/40 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.button
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/vendor/dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl mb-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm' 
                : 'bg-white/60 hover:bg-white/70 text-gray-700 shadow-lg border border-purple-300/80'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </motion.button>

          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-2"
              >
                Inventory Management
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
              >
                Monitor and manage your product stock levels
              </motion.p>
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-purple-800/30 border-purple-700/50 text-yellow-400' 
                  : 'bg-white/60 border-purple-300/80 text-purple-900'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Package, label: 'Total Products', value: totalProducts, change: '+0', color: 'purple' },
            { icon: CheckCircle, label: 'In Stock', value: totalProducts - lowStockCount - outOfStockCount, change: `${totalProducts - lowStockCount - outOfStockCount}`, color: 'green' },
            { icon: AlertCircle, label: 'Low Stock', value: lowStockCount, change: `${lowStockCount}`, color: 'amber' },
            { icon: AlertCircle, label: 'Out of Stock', value: outOfStockCount, change: `${outOfStockCount}`, color: 'red' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative overflow-hidden backdrop-blur-xl rounded-3xl border transition-all duration-500 group shadow-lg ${
                isDarkMode 
                  ? 'bg-purple-900/40 border-purple-700/50 hover:bg-purple-900/50 hover:border-purple-600/50' 
                  : 'bg-white/60 border-purple-300/80 hover:bg-white/70 hover:border-purple-400/80 hover:shadow-xl'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center shadow-lg shadow-${stat.color}-500/25`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.label}
                </h3>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
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
                  : 'bg-white/60 text-gray-900 placeholder-gray-500 border border-purple-300/80 focus:bg-white/70'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-xl shadow-lg`}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Products', value: 'all' as const },
              { label: 'Low Stock', value: 'low' as const },
              { label: 'Out of Stock', value: 'out' as const }
            ].map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filterStatus === filter.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-white/60 text-gray-700 hover:bg-white/70 border border-purple-300/80'
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {searchQuery || filterStatus !== 'all' 
                ? 'No products found' 
                : 'No products yet'}
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add products to your marketplace to see them here'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`backdrop-blur-xl rounded-3xl border shadow-lg overflow-hidden ${
              isDarkMode 
                ? 'bg-purple-900/40 border-purple-700/50' 
                : 'bg-white/60 border-purple-300/80'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDarkMode ? 'bg-purple-800/40' : 'bg-purple-100/50'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Product
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Price
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Stock
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => {
                      const stockInfo = getStockStatus(product.inventory);
                      const StockIcon = stockInfo.icon;
                      
                      return (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-t ${
                            isDarkMode ? 'border-purple-700/30 hover:bg-purple-800/20' : 'border-purple-200/40 hover:bg-purple-50/50'
                          } transition-colors duration-200`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {product.title}
                              </span>
                            </div>
                          </td>
                          <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {product.category}
                          </td>
                          <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            ${product.price.toFixed(2)}/{product.unit}
                          </td>
                          <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {product.inventory} units
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                              stockInfo.color === 'green' ? 'bg-green-500/20 text-green-600' :
                              stockInfo.color === 'amber' ? 'bg-amber-500/20 text-amber-600' :
                              'bg-red-500/20 text-red-600'
                            }`}>
                              <StockIcon className="w-3 h-3" />
                              <span>{stockInfo.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-purple-500/20 text-purple-600 hover:bg-purple-500/30 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
