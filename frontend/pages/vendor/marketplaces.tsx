import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Package,
  X,
  Save,
  Image as ImageIcon,
  ArrowLeft,
  BookOpen,
  Info
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

export default function MarketplacesManagement() {
  const router = useRouter();
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarketplace, setEditingMarketplace] = useState<Marketplace | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    city: '',
    address: '',
    categories: [] as string[],
  });
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(true);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    fetchMarketplaces();
  }, []);

  const fetchMarketplaces = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        router.push('/auth/login');
        return;
      }

      const user = JSON.parse(userData);
      console.log('Fetching marketplaces for user:', user);
      console.log('User ID:', user.id);
      console.log('User _id:', user._id);
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/marketplaces?vendorId=${user.id}`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Marketplaces response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched marketplaces:', data);
        setMarketplaces(data);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
      }
    } catch (err) {
      console.error('Error fetching marketplaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingMarketplace
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/marketplaces/${editingMarketplace._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/marketplaces`;

      const response = await fetch(url, {
        method: editingMarketplace ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          location: {
            country: formData.country,
            city: formData.city,
            address: formData.address,
          },
          categories: formData.categories,
        }),
      });

      if (response.ok) {
        fetchMarketplaces();
        closeModal();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save marketplace');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this marketplace? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/marketplaces/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchMarketplaces();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete marketplace');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const openCreateModal = () => {
    setEditingMarketplace(null);
    setFormData({
      name: '',
      description: '',
      country: '',
      city: '',
      address: '',
      categories: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (marketplace: Marketplace) => {
    setEditingMarketplace(marketplace);
    setFormData({
      name: marketplace.name,
      description: marketplace.description || '',
      country: marketplace.location?.country || '',
      city: marketplace.location?.city || '',
      address: marketplace.location?.address || '',
      categories: marketplace.categories || [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMarketplace(null);
    setError('');
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const categoryOptions = ['Fruits & Vegetables', 'Farming Tools', 'Meat & Livestock', 'Dairy Products'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          onClick={() => router.push('/vendor/dashboard')}
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              My Marketplaces
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your agricultural marketplaces
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Marketplace</span>
          </motion.button>
        </div>

        {/* Help / Manual for Marketplace Management */}
        <div className={`mb-8 rounded-3xl border backdrop-blur-xl ${
          isDarkMode ? 'bg-purple-900/30 border-purple-700/40' : 'bg-white/70 border-purple-200/60'
        }`}>
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="w-full flex items-center justify-between px-5 py-4"
            aria-expanded={isHelpOpen}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-600" />
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Marketplace Manual</h2>
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{isHelpOpen ? 'Hide' : 'Show'}</span>
          </button>
          <AnimatePresence initial={false}>
            {isHelpOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5"
              >
                <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-50/60'}`}>
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="w-4 h-4 mt-1 text-pink-600" />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      KOFTI uses a small, clear category set so buyers can find products easily and farmers can manage consistently.
                      Assign one or more categories to each marketplace based on what you plan to sell.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold mb-1">Categories</p>
                      <ul className={`list-disc ml-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        <li>Fruits & Vegetables – All fresh produce</li>
                        <li>Farming Tools – Tools and equipment for farming</li>
                        <li>Meat & Livestock – Meat, sheep, cattle</li>
                        <li>Dairy Products – Milk, cheese, yogurt, butter</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Management Tips</p>
                      <ul className={`list-disc ml-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        <li>Create a marketplace per brand or location you manage.</li>
                        <li>Use the categories above for consistent filtering across the app.</li>
                        <li>You can edit marketplace info anytime; buyers will see updated details.</li>
                        <li>You cannot delete a marketplace that still has products—move or delete products first.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Marketplaces Grid */}
        {marketplaces.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No marketplaces yet
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Create your first marketplace to start selling products
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              Create Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaces.map((marketplace, index) => (
              <motion.div
                key={marketplace._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-3xl p-6 backdrop-blur-xl border ${
                  isDarkMode
                    ? 'bg-purple-800/20 border-purple-700/30'
                    : 'bg-purple-50/60 border-purple-200/60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {marketplace.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {marketplace.productsCount || 0} products
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEditModal(marketplace)}
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(marketplace._id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {marketplace.description && (
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {marketplace.description}
                  </p>
                )}

                {marketplace.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {[marketplace.location.city, marketplace.location.country]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {marketplace.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-600"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/vendor/marketplaces/${marketplace._id}/products`)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Manage Products</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-3xl p-8 ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {editingMarketplace ? 'Edit Marketplace' : 'Create New Marketplace'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Marketplace Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="e.g., Fresh Farm Market"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Describe your marketplace..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="e.g., USA"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="e.g., New York"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-4 py-2 rounded-xl border transition-all ${
                          formData.categories.includes(category)
                            ? 'bg-purple-500 text-white border-purple-500'
                            : isDarkMode
                            ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-purple-500'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingMarketplace ? 'Update' : 'Create'} Marketplace</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
