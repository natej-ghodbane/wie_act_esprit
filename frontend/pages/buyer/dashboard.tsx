import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserProfileDropdown from '../../components/UserProfileDropdown';
import { userAPI, orderAPI, productAPI } from '@/utils/api';
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
  Sparkles,
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
}

interface Order {
  id: string;
  status: string;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface OrderStats {
  total: number;
  pending: number;
  completed: number; // includes paid or completed
  paid: number; // strictly paid
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Dashboard data states
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    completed: 0,
    paid: 0,
  });
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch user profile
        const { data: profileData } = await userAPI.getProfile();
        setUser(profileData);

        // Fetch recent orders
        console.log('Fetching orders...');
        const { data: ordersData } = await orderAPI.getAll();
        console.log('Orders data received:', ordersData);
        
        const rawOrders = Array.isArray(ordersData) ? ordersData : [];
        const orders: Order[] = rawOrders.map((o: any) => ({
          id: o.id || o._id || '',
          status: o.status || 'pending',
          total: typeof o.totalAmount === 'number' ? o.totalAmount : (typeof o.total === 'number' ? o.total : 0),
          items: Array.isArray(o.items) ? o.items : [],
          createdAt: o.createdAt || new Date().toISOString(),
        }));
        setRecentOrders(orders.slice(0, 5)); // Get last 5 orders

        // Calculate order statistics
        const stats = orders.reduce((acc: OrderStats, order: Order) => {
          acc.total++;
          if (order.status === 'paid') acc.paid++;
          if (order.status === 'paid' || order.status === 'completed') acc.completed++;
          if (order.status === 'pending') acc.pending++;
          return acc;
        }, { total: 0, pending: 0, completed: 0, paid: 0 });
        console.log('Calculated stats:', stats);
        setOrderStats(stats);

        // Fetch favorite/recommended products
        const { data: productsData } = await productAPI.getAll();
        setFavoriteProducts(productsData.slice(0, 4)); // Get 4 recommended products

        // Fetch analytics
        const { data: analyticsData } = await orderAPI.getAnalytics();
        setAnalytics(analyticsData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

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

  const refreshDashboard = async () => {
    try {
      setIsLoading(true);
      console.log('Refreshing dashboard data...');
      
      // Fetch recent orders
      const { data: ordersData } = await orderAPI.getAll();
      console.log('Refreshed orders data:', ordersData);
      
      const rawOrders = Array.isArray(ordersData) ? ordersData : [];
      const orders: Order[] = rawOrders.map((o: any) => ({
        id: o.id || o._id || '',
        status: o.status || 'pending',
        total: typeof o.totalAmount === 'number' ? o.totalAmount : (typeof o.total === 'number' ? o.total : 0),
        items: Array.isArray(o.items) ? o.items : [],
        createdAt: o.createdAt || new Date().toISOString(),
      }));
      setRecentOrders(orders.slice(0, 5));

      // Calculate order statistics
      const stats = orders.reduce((acc: OrderStats, order: Order) => {
        acc.total++;
        if (order.status === 'paid') acc.paid++;
        if (order.status === 'paid' || order.status === 'completed') acc.completed++;
        if (order.status === 'pending') acc.pending++;
        return acc;
      }, { total: 0, pending: 0, completed: 0, paid: 0 });
      setOrderStats(stats);

      // Fetch analytics
      const { data: analyticsData } = await orderAPI.getAnalytics();
      setAnalytics(analyticsData);
      
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-700 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50'
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
              className={`w-16 h-16 mx-auto rounded-full border-4 border-t-purple-500 border-r-transparent border-b-pink-300 border-l-transparent ${
                isDarkMode ? 'shadow-purple-500/20' : 'shadow-purple-500/30'
              } shadow-lg`}
            />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-500" />
          </div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2`}
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
        : 'bg-gradient-to-br from-purple-100 via-pink-50 to-fuchsia-100'
    }`}>
      {/* Purple tinted overlay for light mode */}
      {!isDarkMode && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-200/20 via-pink-100/10 to-fuchsia-200/20 pointer-events-none z-0" />
      )}
      
      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Orders Card */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Orders</h3>
              <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{orderStats.total}</p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed: {orderStats.completed}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending: {orderStats.pending}</span>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 shadow-lg backdrop-blur-sm col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
              <button 
                onClick={() => router.push('/buyer/orders')} 
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                View all orders
              </button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order, idx) => (
                <div key={order.id || idx} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order #{(order.id || '').slice(-6) || '—'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(order.items?.length || 0)} items • ${Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    (order.status === 'completed' || order.status === 'paid')
                      ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                      : 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
                  }`}>
                    {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                  </span>
                </div>
              ))}

              {recentOrders.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                  <button 
                    onClick={() => router.push('/buyer/marketplace')} 
                    className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Browse products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
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
                  className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-2`}
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
                <motion.button
                  onClick={refreshDashboard}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Refresh Data
                </motion.button>
              </div>
              
              {/* Timeframe Selector */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`flex items-center space-x-2 mt-4 lg:mt-0 p-1 rounded-2xl backdrop-blur-xl border ${
                  isDarkMode 
                    ? 'bg-purple-800/30 border-purple-700/50' 
                    : 'bg-purple-100/40 border-purple-200/50'
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
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
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
              { icon: ShoppingBag, label: 'Total Orders', value: orderStats.total.toString(), change: '+12%', color: 'emerald' },
              { icon: Package, label: 'Active Orders', value: orderStats.paid.toString(), change: '+5%', color: 'blue' },
              { icon: Heart, label: 'Wishlist Items', value: '0', change: '+8%', color: 'rose' },
              { icon: TrendingUp, label: 'Total Spent', value: analytics ? `$${analytics.totalSpent.toFixed(0)}` : '$0', change: '+15%', color: 'amber' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative overflow-hidden backdrop-blur-xl rounded-3xl border transition-all duration-500 group ${
                  isDarkMode 
                    ? 'bg-purple-800/20 border-purple-700/30 hover:bg-purple-800/30' 
                    : 'bg-purple-50/60 border-purple-200/60 hover:bg-purple-100/70'
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
                          ? `bg-purple-500/20 text-purple-600` 
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
                { icon: Store, label: 'Browse Marketplaces', route: '/buyer/marketplaces', color: 'emerald' },
                { icon: ShoppingBag, label: 'My Cart', route: '/buyer/cart', color: 'blue' },
                { icon: Package, label: 'Order History', route: '/buyer/orders', color: 'purple' },
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
                      ? 'bg-purple-800/20 border-purple-700/30 hover:bg-purple-800/40' 
                      : 'bg-purple-50/60 border-purple-200/60 hover:bg-purple-100/70'
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
                  ? 'bg-purple-800/20 border-purple-700/30' 
                  : 'bg-purple-50/60 border-purple-200/60'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Recent Activity
                </h3>
                <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
              </div>
              
              <div className="space-y-4">
                {recentOrders.length > 0 ? recentOrders.slice(0, 3).map((order, index) => (
                  <motion.div 
                    key={order.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + 0.1 * index }}
                    className={`flex items-center space-x-4 p-3 rounded-2xl ${
                      isDarkMode ? 'bg-purple-800/30' : 'bg-purple-100/40'
                    }`}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`w-2 h-2 rounded-full ${
                        order.status === 'paid' || order.status === 'completed' 
                          ? 'bg-green-500' 
                          : order.status === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Order #{order.id.slice(-6)} - ${order.total.toFixed(2)}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {new Date(order.createdAt).toLocaleDateString()} • {order.status}
                      </p>
                    </div>
                    <Star className={`w-4 h-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  </motion.div>
                )) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                    <button 
                      onClick={() => router.push('/buyer/marketplaces')} 
                      className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Start shopping
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Analytics Chart Placeholder */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`backdrop-blur-xl rounded-3xl border p-6 ${
                isDarkMode 
                  ? 'bg-purple-800/20 border-purple-700/30' 
                  : 'bg-purple-50/60 border-purple-200/60'
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
                      isDarkMode ? 'bg-purple-800/50' : 'bg-purple-100/40'
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