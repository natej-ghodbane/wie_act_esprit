import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserProfileDropdown from '../../components/UserProfileDropdown';
import { 
  ShoppingBag, 
  Heart, 
  TrendingUp, 
  Package, 
  Search, 
  Bell, 
  Bookmark,
  Star,
  ArrowUpRight,
  Calendar,
  Filter,
  Grid3X3,
  BarChart3,
  Leaf,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
}

export default function BuyerDashboard() {
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
      if (parsedUser.role !== 'buyer') {
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
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
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
              className={`w-16 h-16 mx-auto rounded-full border-4 border-t-emerald-500 border-r-transparent border-b-emerald-300 border-l-transparent ${
                isDarkMode ? 'shadow-emerald-500/20' : 'shadow-emerald-500/30'
              } shadow-lg`}
            />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
          </div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2`}
          >
            Loading your dashboard...
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}
          >
            Preparing your agricultural marketplace
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
        : 'bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50'
    }`}>
      {/* Advanced Navigation Bar with Glassmorphism */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed w-full top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
          isDarkMode 
            ? 'bg-slate-900/10 border-slate-700/30' 
            : 'bg-white/10 border-white/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Animation */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center space-x-3"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25"
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
                    ? 'bg-slate-800/30 border-slate-700/50 text-slate-300' 
                    : 'bg-white/20 border-white/30 text-slate-700'
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
                    ? 'bg-slate-800/30 border-slate-700/50 text-yellow-400' 
                    : 'bg-white/20 border-white/30 text-slate-600'
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
                    ? 'bg-slate-800/30 border-slate-700/50 text-slate-300' 
                    : 'bg-white/20 border-white/30 text-slate-600'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                />
              </motion.button>

              <UserProfileDropdown user={user} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section with Micro-interactions */}
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
                  className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2`}
                >
                  Welcome back, {user?.firstName}! 👋
                </motion.h1>
                <motion.p 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Discover fresh, sustainable agricultural products from local farmers
                </motion.p>
              </div>
              
              {/* Timeframe Selector */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`flex items-center space-x-2 mt-4 lg:mt-0 p-1 rounded-2xl backdrop-blur-xl border ${
                  isDarkMode 
                    ? 'bg-slate-800/30 border-slate-700/50' 
                    : 'bg-white/20 border-white/30'
                }`}
              >
                {['day', 'week', 'month'].map((period) => (
                  <motion.button
                    key={period}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTimeframe === period
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                        : isDarkMode 
                          ? 'text-slate-400 hover:text-slate-200' 
                          : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Advanced Stats Cards with Neumorphism */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { icon: ShoppingBag, label: 'Total Orders', value: '24', change: '+12%', color: 'emerald' },
              { icon: Package, label: 'Active Orders', value: '3', change: '+5%', color: 'blue' },
              { icon: Heart, label: 'Wishlist Items', value: '12', change: '+8%', color: 'rose' },
              { icon: TrendingUp, label: 'Saved Amount', value: '$840', change: '+15%', color: 'amber' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative overflow-hidden backdrop-blur-xl rounded-3xl border transition-all duration-500 group ${
                  isDarkMode 
                    ? 'bg-slate-800/20 border-slate-700/30 hover:bg-slate-800/30' 
                    : 'bg-white/30 border-white/40 hover:bg-white/40'
                }`}
                style={{
                  boxShadow: isDarkMode 
                    ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)' 
                    : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
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
                          ? `bg-emerald-500/20 text-emerald-600` 
                          : `bg-rose-500/20 text-rose-600`
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
                
                {/* Gradient overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-r from-${stat.color}-500/5 to-${stat.color}-600/5 rounded-3xl`}
                />
              </motion.div>
            ))}
          </div>

          {/* Quick Actions with Fluid Design */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Search, label: 'Browse Products', route: '/marketplace', color: 'emerald' },
                { icon: ShoppingBag, label: 'My Cart', route: '/cart', color: 'blue' },
                { icon: Package, label: 'Order History', route: '/orders', color: 'purple' },
                { icon: Bookmark, label: 'Saved Items', route: '/saved', color: 'rose' }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(action.route)}
                  className={`group relative overflow-hidden p-6 rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-slate-800/20 border-slate-700/30 hover:bg-slate-800/40' 
                      : 'bg-white/30 border-white/40 hover:bg-white/50'
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

          {/* Recent Activity & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`backdrop-blur-xl rounded-3xl border p-6 ${
                isDarkMode 
                  ? 'bg-slate-800/20 border-slate-700/30' 
                  : 'bg-white/30 border-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Recent Activity
                </h3>
                <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
              </div>
              
              <div className="space-y-4">
                {[
                  { action: 'Ordered Organic Tomatoes', time: '2 hours ago', status: 'completed' },
                  { action: 'Added Fresh Herbs to wishlist', time: '5 hours ago', status: 'active' },
                  { action: 'Reviewed Local Honey', time: '1 day ago', status: 'completed' }
                ].map((activity, index) => (
                  <motion.div 
                    key={index}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + 0.1 * index }}
                    className={`flex items-center space-x-4 p-3 rounded-2xl ${
                      isDarkMode ? 'bg-slate-800/30' : 'bg-white/20'
                    }`}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`w-2 h-2 rounded-full ${
                        activity.status === 'completed' 
                          ? 'bg-emerald-500' 
                          : 'bg-amber-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {activity.action}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {activity.time}
                      </p>
                    </div>
                    <Star className={`w-4 h-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Analytics Chart Placeholder */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`backdrop-blur-xl rounded-3xl border p-6 ${
                isDarkMode 
                  ? 'bg-slate-800/20 border-slate-700/30' 
                  : 'bg-white/30 border-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Purchase Analytics
                </h3>
                <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
              </div>
              
              <div className="space-y-4">
                {['Vegetables', 'Fruits', 'Herbs', 'Grains'].map((category, index) => (
                  <motion.div 
                    key={category}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1 + 0.2 * index, duration: 0.8 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                        {category}
                      </span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {Math.floor(Math.random() * 50 + 10)}%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-slate-800/50' : 'bg-white/30'
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.floor(Math.random() * 80 + 20)}%` }}
                        transition={{ delay: 1.2 + 0.2 * index, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${
                          index === 0 ? 'from-emerald-500 to-teal-500' :
                          index === 1 ? 'from-blue-500 to-cyan-500' :
                          index === 2 ? 'from-purple-500 to-pink-500' :
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