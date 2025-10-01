import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserProfileDropdown from '../../components/UserProfileDropdown';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plus, 
  BarChart3,
  Leaf,
  Sun,
  Moon,
  Sparkles,
  Bell,
  Search,
  Settings,
  Eye,
  Edit,
  Star,
  Calendar,
  ArrowUpRight,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  farmLocation?: string;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
      if (parsedUser.role !== 'farmer') {
        router.push('/auth/login');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-700 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900' 
          : 'bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-fuchsia-50/50'
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
              className={`w-16 h-16 mx-auto rounded-full border-4 border-t-green-500 border-r-transparent border-b-green-300 border-l-transparent ${
                isDarkMode ? 'shadow-green-500/20' : 'shadow-green-500/30'
              } shadow-lg`}
            />
            <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />
          </div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2`}
          >
            Loading your farm dashboard...
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}
          >
            Preparing your agricultural business center
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
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
      
      {/* Advanced Navigation Bar with Glassmorphism */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed w-full top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
          isDarkMode 
            ? 'bg-purple-900/10 border-purple-700/30' 
            : 'bg-purple-100/30 border-purple-200/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Animation */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center space-x-3"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25"
              >
                <Leaf className="text-white w-5 h-5" />
              </motion.div>
              <span className="hidden sm:block">AGRI-HOPE</span>
            </motion.div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-purple-800/30 border-purple-700/50 text-purple-300' 
                    : 'bg-purple-100/40 border-purple-200/50 text-purple-900'
                }`}
              >
                <Search className="w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="bg-transparent outline-none text-sm w-32 lg:w-48"
                />
              </motion.div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-purple-800/30 border-purple-700/50 text-yellow-400' 
                    : 'bg-purple-100/40 border-purple-200/50 text-purple-900'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-purple-800/30 border-purple-700/50 text-purple-300' 
                    : 'bg-purple-100/40 border-purple-200/50 text-purple-900'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                />
              </motion.button>

              <UserProfileDropdown user={user} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <motion.h1 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-2`}
                >
                  Welcome, {user?.firstName}! 🌱
                </motion.h1>
                <motion.p 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Manage your farm products and grow your agricultural business
                </motion.p>
              </div>
              
              {/* Farm Location Badge */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`flex items-center space-x-2 mt-4 lg:mt-0 px-4 py-2 rounded-2xl backdrop-blur-xl border ${
                  isDarkMode 
                    ? 'bg-purple-800/30 border-purple-700/50 text-purple-300' 
                    : 'bg-purple-100/40 border-purple-200/50 text-purple-900'
                }`}
              >
                <Leaf className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">
                  {user?.farmLocation || 'Farm Location'}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Advanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { icon: Package, label: 'Total Products', value: '24', change: '+3', color: 'purple' },
              { icon: DollarSign, label: 'Monthly Revenue', value: '$2,840', change: '+15%', color: 'purple' },
              { icon: TrendingUp, label: 'Orders This Week', value: '18', change: '+22%', color: 'purple' },
              { icon: Users, label: 'Happy Customers', value: '156', change: '+8', color: 'purple' }
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
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stat.change.startsWith('+') 
                          ? `bg-green-500/20 text-green-600` 
                          : `bg-red-500/20 text-red-600`
                      }`}
                    >
                      {stat.change}
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

          {/* Quick Actions for Vendors */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Farm Management
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Store, label: 'My Marketplaces', route: '/vendor/marketplaces', color: 'purple' },
                { icon: Package, label: 'Manage Inventory', route: '/vendor/inventory', color: 'purple' }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(action.route)}
                  className={`group relative overflow-hidden p-6 rounded-3xl backdrop-blur-xl border transition-all duration-500 shadow-lg ${
                    isDarkMode 
                      ? 'bg-purple-900/40 border-purple-700/50 hover:bg-purple-900/50 hover:border-purple-600/50' 
                      : 'bg-white/60 border-purple-300/80 hover:bg-white/70 hover:border-purple-400/80 hover:shadow-xl'
                  }`}
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 flex items-center justify-center shadow-lg shadow-${action.color}-500/25`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {action.label}
                  </p>
                  <ArrowUpRight className={`absolute top-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Products & Sales Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Products */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`backdrop-blur-xl rounded-3xl border p-6 shadow-lg ${
                isDarkMode 
                  ? 'bg-purple-900/40 border-purple-700/50' 
                  : 'bg-white/60 border-purple-300/80'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Recent Products
                </h3>
                <Package className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Organic Tomatoes', status: 'active', sales: '23 sold', rating: 4.8 },
                  { name: 'Fresh Herbs Mix', status: 'low stock', sales: '12 sold', rating: 4.9 },
                  { name: 'Farm Honey', status: 'active', sales: '8 sold', rating: 5.0 }
                ].map((product, index) => (
                  <motion.div 
                    key={index}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + 0.1 * index }}
                    className={`flex items-center justify-between p-3 rounded-2xl backdrop-blur-sm ${
                      isDarkMode ? 'bg-purple-800/40' : 'bg-purple-200/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`w-3 h-3 rounded-full ${
                          product.status === 'active' 
                            ? 'bg-green-500' 
                            : 'bg-amber-500'
                        }`}
                      />
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {product.name}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {product.sales}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {product.rating}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sales Chart */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`backdrop-blur-xl rounded-3xl border p-6 shadow-lg ${
                isDarkMode 
                  ? 'bg-purple-900/40 border-purple-700/50' 
                  : 'bg-white/60 border-purple-300/80'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Sales Overview
                </h3>
                <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
              </div>
              
              <div className="space-y-4">
                {['This Week', 'Last Week', 'This Month', 'Last Month'].map((period, index) => (
                  <motion.div 
                    key={period}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1 + 0.2 * index, duration: 0.8 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                        {period}
                      </span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        ${Math.floor(Math.random() * 1000 + 200)}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-purple-900/50' : 'bg-purple-200/40'
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.floor(Math.random() * 80 + 20)}%` }}
                        transition={{ delay: 1.2 + 0.2 * index, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${
                          index === 0 ? 'from-purple-500 to-pink-500' :
                          index === 1 ? 'from-pink-500 to-fuchsia-500' :
                          index === 2 ? 'from-purple-500 to-fuchsia-500' :
                          'from-amber-500 to-orange-500'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}