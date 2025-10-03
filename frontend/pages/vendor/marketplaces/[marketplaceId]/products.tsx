import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  ArrowLeft,
  DollarSign,
  Image as ImageIcon,
  Tag,
  Minus,
  AlertTriangle,
  Settings,
  RefreshCw,
  BarChart3,
  Bell
} from 'lucide-react';
import { productAPI } from '../../../utils/api';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inventory: number;
  lowStockThreshold?: number;
  enableLowStockAlerts?: boolean;
  unit?: string;
  isActive: boolean;
}

interface Marketplace {
  _id: string;
  name: string;
  description?: string;
}

export default function ProductsManagement() {
  const router = useRouter();
  const { marketplaceId } = router.query;
  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    inventory: '',
    unit: '',
  });
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);
  const [thresholdValues, setThresholdValues] = useState<Record<string, number>>({});
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState<Record<string, number>>({});
  
  const LOW_STOCK_THRESHOLD = 5;

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (marketplaceId) {
      fetchMarketplace();
      fetchProducts();
    }
  }, [marketplaceId]);

  const fetchMarketplace = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/marketplaces/id/${marketplaceId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMarketplace(data.marketplace);
      }
    } catch (err) {
      console.error('Error fetching marketplace:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products?marketplaceId=${marketplaceId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingProduct
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products/${editingProduct._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products`;

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          inventory: parseInt(formData.inventory),
          unit: formData.unit,
          marketplaceId: marketplaceId,
        }),
      });

      if (response.ok) {
        fetchProducts();
        closeModal();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete product');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const beginEditQuantity = (product: Product) => {
    setEditingQuantity((prev) => ({ ...prev, [product._id]: product.inventory }));
  };

  const setQuantityFor = (id: string, value: number) => {
    if (Number.isNaN(value)) return;
    if (value < 0) value = 0;
    setEditingQuantity((prev) => ({ ...prev, [id]: value }));
  };

  const adjustQuantity = async (product: Product) => {
    const newQtyRaw = editingQuantity[product._id];
    const newQuantity = typeof newQtyRaw === 'number' ? Math.max(0, Math.floor(newQtyRaw)) : product.inventory;
    if (newQuantity === product.inventory) {
      toast('Quantity unchanged');
      return;
    }
    try {
      setUpdatingIds((prev) => ({ ...prev, [product._id]: true }));
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products/${product._id}/stock`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            newQuantity,
            reason: 'manual_adjustment',
            notes: 'Adjusted from marketplace dashboard',
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update stock');
      }
      const data = await response.json();
      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, inventory: data.product?.inventory ?? newQuantity } : p)));
      toast.success('Stock updated');
    } catch (err: any) {
      toast.error(err.message || 'Error updating stock');
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      inventory: '',
      unit: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      inventory: product.inventory.toString(),
      unit: product.unit || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setError('');
  };

  const categoryOptions = ['Vegetables', 'Fruits', 'Grains', 'Herbs', 'Dairy', 'Organic'];
  const unitOptions = ['kg', 'lb', 'piece', 'bunch', 'dozen', 'liter'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
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
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/vendor/marketplaces')}
            className={`flex items-center space-x-2 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-purple-600`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Marketplaces</span>
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {marketplace?.name || 'Marketplace'} Products
              </h1>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage products in this marketplace
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreateModal}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </motion.button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No products yet
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Start adding products to your marketplace
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
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
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {product.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-600">
                        {product.category}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {product.inventory} {product.unit || 'units'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEditModal(product)}
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {product.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {product.price}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      / {product.unit || 'unit'}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    product.isActive
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-red-500/20 text-red-600'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Inline stock management */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Inventory</div>
                    <div className="flex items-center space-x-2">
                      {editingQuantity[product._id] === undefined ? (
                        <button
                          onClick={() => beginEditQuantity(product)}
                          className="px-3 py-1 rounded-md bg-purple-600 text-white text-sm hover:bg-purple-700"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setQuantityFor(product._id, (editingQuantity[product._id] || 0) - 1)}
                            className="p-2 rounded-md bg-gray-200 dark:bg-gray-800"
                            disabled={!!updatingIds[product._id]}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={editingQuantity[product._id] ?? product.inventory}
                            onChange={(e) => setQuantityFor(product._id, parseInt(e.target.value, 10))}
                            className={`w-20 text-center px-3 py-2 rounded-md border ${
                              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            min={0}
                          />
                          <button
                            onClick={() => setQuantityFor(product._id, (editingQuantity[product._id] || 0) + 1)}
                            className="p-2 rounded-md bg-gray-200 dark:bg-gray-800"
                            disabled={!!updatingIds[product._id]}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => adjustQuantity(product)}
                            className="px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
                            disabled={!!updatingIds[product._id]}
                          >
                            {updatingIds[product._id] ? 'Saving...' : 'Save'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingQuantity[product._id] === undefined ? (
                    <div className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Current: {product.inventory} {product.unit || 'units'}
                    </div>
                  ) : null}
                </div>
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
              } max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="e.g., Organic Tomatoes"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="">Select unit</option>
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Inventory *
                    </label>
                    <input
                      type="number"
                      value={formData.inventory}
                      onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="0"
                    />
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
                    <span>{editingProduct ? 'Update' : 'Add'} Product</span>
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
