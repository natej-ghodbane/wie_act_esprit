import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';
import { productAPI } from '@/utils/api';

interface StockAnalytics {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventory: number;
  averageInventoryPerProduct: number;
}

interface StockMovement {
  _id: string;
  productId: {
    _id: string;
    title: string;
    images: string[];
  };
  previousQuantity: number;
  newQuantity: number;
  change: number;
  reason: string;
  notes?: string;
  createdAt: string;
}

interface StockAnalyticsProps {
  refreshTrigger?: number;
}

export default function StockAnalytics({ refreshTrigger }: StockAnalyticsProps) {
  const [analytics, setAnalytics] = useState<StockAnalytics | null>(null);
  const [recentMovements, setRecentMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger]);

  const fetchAnalytics = async () => {
    const isInitialLoad = !analytics;
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [analyticsResponse, movementsResponse] = await Promise.all([
        productAPI.getStockAnalytics(),
        productAPI.getStockMovements({ limit: 10 })
      ]);

      setAnalytics(analyticsResponse.data);
      setRecentMovements(movementsResponse.data);
    } catch (error) {
      console.error('Failed to fetch stock analytics:', error);
      if (isInitialLoad) {
        toast.error('Failed to load stock analytics');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Package className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case 'sale': return 'bg-blue-100 text-blue-800';
      case 'restock': return 'bg-green-100 text-green-800';
      case 'damage': return 'bg-red-100 text-red-800';
      case 'theft': return 'bg-red-100 text-red-800';
      case 'manual_adjustment': return 'bg-amber-100 text-amber-800';
      case 'correction': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-40 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
        <p className="text-gray-600">Failed to load analytics data.</p>
        <Button onClick={fetchAnalytics} className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900">Stock Analytics</h3>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={fetchAnalytics}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Products</div>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</div>
        </div>

        <div className="bg-white/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Inventory</div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalInventory.toLocaleString()}</div>
        </div>

        <div className="bg-white/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Low Stock</div>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{analytics.lowStockProducts}</div>
        </div>

        <div className="bg-white/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Out of Stock</div>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{analytics.outOfStockProducts}</div>
        </div>
      </div>

      {/* Recent Stock Movements */}
      <div className="border-t border-white/50 pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Stock Movements</h4>
        {recentMovements.length === 0 ? (
          <p className="text-gray-600 text-sm">No recent stock movements</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentMovements.map((movement) => (
              <div
                key={movement._id}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  {movement.productId.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={movement.productId.images[0]} 
                      alt={movement.productId.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      🌾
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {movement.productId.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getReasonBadgeColor(movement.reason)}`}>
                        {movement.reason.replace('_', ' ')}
                      </span>
                      {movement.notes && (
                        <span className="text-xs text-gray-500 truncate" title={movement.notes}>
                          {movement.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {getChangeIcon(movement.change)}
                      <span className={`text-sm font-medium ${getChangeColor(movement.change)}`}>
                        {movement.change > 0 ? '+' : ''}{movement.change}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {movement.previousQuantity} → {movement.newQuantity}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-right">
                    {new Date(movement.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(movement.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}