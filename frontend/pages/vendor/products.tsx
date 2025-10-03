import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Plus, Minus, Trash2, RefreshCw, AlertTriangle, Settings, BarChart3 } from 'lucide-react';
import { productAPI } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Toaster, toast } from 'react-hot-toast';
import StockAnalytics from '@/components/StockAnalytics';
import NotificationBell from '@/components/NotificationBell';

interface User {
  id: string;
  role: 'farmer' | 'buyer' | 'admin' | string;
}

interface ProductItem {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  category?: string;
  inventory?: number;
  lowStockThreshold?: number;
  enableLowStockAlerts?: boolean;
  unit?: string;
  createdAt?: string;
}

const LOW_STOCK_THRESHOLD = 5;

export default function VendorProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsRefreshTrigger, setAnalyticsRefreshTrigger] = useState(0);
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);
  const [thresholdValues, setThresholdValues] = useState<Record<string, number>>({});

  // Auth check and load user
  useEffect(() => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('authToken') || localStorage.getItem('token')) : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }
    try {
      const parsed: User = JSON.parse(userData);
      if (parsed.role !== 'farmer') {
        router.push('/auth/login');
        return;
      }
      setUser(parsed);
    } catch {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  const fetchProducts = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { data } = await productAPI.getAll({ vendorId: user.id });
      const items = Array.isArray(data) ? data : [];
      setProducts(items);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load products', e);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const totalInventory = useMemo(() =>
    products.reduce((sum, p) => sum + (Number(p.inventory) || 0), 0),
  [products]);

  const lowStockCount = useMemo(() => products.filter(p => (p.inventory ?? 0) < (p.lowStockThreshold ?? LOW_STOCK_THRESHOLD)).length, [products]);

  const displayedProducts = useMemo(() =>
    products.filter(p => !showLowOnly || (p.inventory ?? 0) < (p.lowStockThreshold ?? LOW_STOCK_THRESHOLD)),
  [products, showLowOnly]);

  const setUpdating = (id: string, val: boolean) => setUpdatingIds(prev => ({ ...prev, [id]: val }));

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      await fetchProducts();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Delete failed', e);
      alert('Failed to delete product');
    }
  };

  const handleAdjust = async (id: string, delta: number) => {
    const current = products.find(p => p._id === id);
    if (!current) return;
    const newVal = Math.max(0, Number(current.inventory || 0) + delta);
    await handleSaveInventory(id, newVal);
  };

  const handleSaveInventory = async (id: string, newValue: number) => {
    const product = products.find(p => p._id === id);
    if (!product) return;

    const previousQuantity = product.inventory ?? 0;
    const threshold = product.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
    
    console.log('💾 Saving inventory:', {
      productId: id,
      productTitle: product.title,
      previousQuantity,
      newValue,
      threshold,
      shouldShowLowStock: newValue <= threshold && newValue > 0,
      shouldShowOutOfStock: newValue === 0
    });

    // Optimistic update
    setProducts(prev => prev.map(p => p._id === id ? { ...p, inventory: newValue } : p));
    setUpdating(id, true);
    
    // Always show notifications regardless of API success/failure
    const showNotifications = () => {
      if (newValue === 0 && previousQuantity > 0) {
        console.log('🚨 Showing OUT OF STOCK notification');
        toast.error(`🚨 ${product.title} is now OUT OF STOCK!`, {
          duration: 6000,
          style: {
            background: '#fee2e2',
            color: '#dc2626',
            fontWeight: 'bold'
          }
        });
      } else if (newValue <= threshold && newValue > 0 && previousQuantity > threshold) {
        console.log('⚠️ Showing LOW STOCK notification');
        toast(`⚠️ ${product.title} is LOW STOCK! Only ${newValue} left (threshold: ${threshold})`, {
          duration: 5000,
          style: {
            background: '#fef3c7',
            color: '#d97706',
            fontWeight: 'bold'
          }
        });
      } else if (newValue > threshold && previousQuantity <= threshold && previousQuantity > 0) {
        console.log('✅ Showing RESTOCK notification');
        toast.success(`✅ ${product.title} restocked successfully! Now has ${newValue} items`, {
          duration: 4000,
          style: {
            background: '#dcfce7',
            color: '#16a34a',
            fontWeight: 'bold'
          }
        });
      } else {
        console.log('ℹ️ Showing general update notification');
        toast.success(`Inventory updated: ${product.title} now has ${newValue} items`);
      }
    };

    try {
      // Try to update via API
      if (productAPI.adjustStock) {
        await productAPI.adjustStock(id, {
          newQuantity: newValue,
          reason: 'manual_adjustment',
          notes: 'Updated via product management'
        });
        console.log('✅ API update successful');
      } else {
        // Fallback to regular update if adjustStock doesn't exist
        console.log('⚠️ Using fallback API update');
        await productAPI.update(id, { inventory: newValue });
      }
      
      // Show notifications after successful API call
      showNotifications();
      
      // Trigger analytics refresh
      setAnalyticsRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.error('❌ API update failed:', e);
      
      // Still show notifications even if API fails
      showNotifications();
      
      // Show error toast
      toast.error('Failed to save to server, but notifications are working!');
      
      // Revert on failure
      await fetchProducts();
    } finally {
      setUpdating(id, false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setAnalyticsRefreshTrigger(prev => prev + 1);
    setIsRefreshing(false);
  };

  const handleThresholdEdit = (productId: string, currentThreshold: number) => {
    setEditingThreshold(productId);
    setThresholdValues(prev => ({ ...prev, [productId]: currentThreshold }));
  };

  const handleThresholdSave = async (productId: string) => {
    const newThreshold = thresholdValues[productId];
    if (newThreshold === undefined || newThreshold < 0) {
      toast.error('Please enter a valid threshold');
      return;
    }

    try {
      await productAPI.updateThreshold(productId, { threshold: newThreshold });

      setProducts(prev => prev.map(p => 
        p._id === productId 
          ? { ...p, lowStockThreshold: newThreshold }
          : p
      ));
      setEditingThreshold(null);
      toast.success('Threshold updated successfully');
      setAnalyticsRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to update threshold:', error);
      toast.error('Failed to update threshold');
    }
  };

  const handleThresholdCancel = () => {
    setEditingThreshold(null);
    setThresholdValues({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Toaster position="top-right" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">My Products</h1>
            <p className="text-sm text-gray-700">Manage your listings, inventory, and pricing</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Button size="sm" variant={showAnalytics ? 'default' : 'outline'} onClick={() => setShowAnalytics(!showAnalytics)}>
              <BarChart3 className="w-4 h-4 mr-1" />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </Button>
            <Button size="sm" variant={showLowOnly ? 'default' : 'outline'} onClick={() => setShowLowOnly(!showLowOnly)}>
              {showLowOnly ? 'Showing Low Stock' : 'Show Low Stock Only'}
            </Button>
            <Button size="sm" variant="outline" onClick={handleRefresh} className={isRefreshing ? 'animate-pulse' : ''}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-4">
            <div className="text-sm text-gray-600">Total Products</div>
            <div className="text-2xl font-bold">{products.length}</div>
          </div>
          <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-4">
            <div className="text-sm text-gray-600">Total Inventory</div>
            <div className="text-2xl font-bold">{totalInventory}</div>
          </div>
          <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-4">
            <div className="text-sm text-gray-600">Low Stock Items</div>
            <div className="text-2xl font-bold">{lowStockCount}</div>
          </div>
        </div>

        {/* Analytics */}
        {showAnalytics && (
          <div className="mb-6">
            <StockAnalytics refreshTrigger={analyticsRefreshTrigger} />
          </div>
        )}

        {/* Quick Notification Test (for debugging) */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">🔔 Test Notifications:</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                toast('⚠️ Test Low Stock Alert!', {
                  duration: 5000,
                  style: { background: '#fef3c7', color: '#d97706', fontWeight: 'bold' }
                });
              }}
              className="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600"
            >
              Test Low Stock
            </button>
            <button
              onClick={() => {
                toast.error('🚨 Test Out of Stock Alert!', {
                  duration: 5000,
                  style: { background: '#fee2e2', color: '#dc2626', fontWeight: 'bold' }
                });
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Test Out of Stock
            </button>
            <button
              onClick={() => {
                toast.success('✅ Test Restock Alert!', {
                  duration: 4000,
                  style: { background: '#dcfce7', color: '#16a34a', fontWeight: 'bold' }
                });
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
            >
              Test Restock
            </button>
          </div>
          <p className="text-xs text-blue-700 mt-2">Click these buttons to test if notifications are working. Check browser console for debug logs.</p>
        </div>

        {/* List */}
        {isLoading ? (
          <div>Loading...</div>
        ) : products.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-8 text-center">
            <p className="text-gray-700">No products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((p) => (
              <div key={p._id} className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-4">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                ) : (
                  <div className="w-full h-40 bg-white/60 rounded-xl mb-3 flex items-center justify-center">🌾</div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.title}</h3>
                    <p className="text-xs text-gray-600">{p.category}</p>
                  </div>
                  <div className="text-pink-600 font-bold">${Number(p.price).toFixed(2)}</div>
                </div>

                {/* Stock management */}
                <div className="mt-3 border-t border-white/50 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {(p.inventory ?? 0) < (p.lowStockThreshold ?? LOW_STOCK_THRESHOLD) && (p.inventory ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                          <AlertTriangle className="w-3 h-3" /> Low stock
                        </span>
                      )}
                      {(p.inventory ?? 0) === 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                          <AlertTriangle className="w-3 h-3" /> Out of stock
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-700">Unit: {p.unit || '-'}</div>
                  </div>

                  {/* Threshold Management */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-600">Low Stock Alert:</div>
                    {editingThreshold === p._id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          value={thresholdValues[p._id] ?? (p.lowStockThreshold ?? LOW_STOCK_THRESHOLD)}
                          onChange={(e) => setThresholdValues(prev => ({ ...prev, [p._id]: Number(e.target.value) }))}
                          className="w-16 text-xs text-center rounded border border-gray-300 px-1 py-0.5"
                        />
                        <Button size="sm" onClick={() => handleThresholdSave(p._id)} className="px-2 py-1 text-xs">
                          ✓
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleThresholdCancel} className="px-2 py-1 text-xs">
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-700">{p.lowStockThreshold ?? LOW_STOCK_THRESHOLD}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleThresholdEdit(p._id, p.lowStockThreshold ?? LOW_STOCK_THRESHOLD)}
                          className="px-1.5 py-0.5"
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" disabled={updatingIds[p._id] || (p.inventory ?? 0) <= 0} onClick={() => handleAdjust(p._id, -1)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <input
                      type="number"
                      min={0}
                      value={p.inventory ?? 0}
                      onChange={(e) => {
                        const v = Math.max(0, Number(e.target.value || 0));
                        setProducts(prev => prev.map(x => x._id === p._id ? { ...x, inventory: v } : x));
                      }}
                      className="w-20 text-center rounded border border-white/70 bg-white/70 py-1"
                    />
                    <Button size="sm" variant="outline" disabled={updatingIds[p._id]} onClick={() => handleAdjust(p._id, +1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button size="sm" disabled={updatingIds[p._id]} onClick={() => handleSaveInventory(p._id, Number(p.inventory || 0))}>
                      {updatingIds[p._id] ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-700">Inv: {p.inventory ?? 0}</div>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(p._id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
