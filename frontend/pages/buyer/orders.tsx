"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, Calendar } from 'lucide-react';
import { orderAPI } from '@/utils/api';

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Handle successful payment and clear cart
    if (window.location.search.includes('status=success')) {
      // Clear the cart
      localStorage.removeItem('cartItems');
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent('cart:updated'));
    }

    let active = true;
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await orderAPI.getAll();
        if (!active) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!active) return;
        setError('Failed to load your orders. Please ensure you are logged in.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchOrders();
    return () => {
      active = false;
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (n: number) => `$${Number(n || 0).toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        // Refresh orders
        const { data } = await orderAPI.getAll();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        alert('Failed to update order status');
      }
    } catch (e) {
      alert('Error updating order status');
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <Head>
        <title>Order History | KOFTI</title>
        <meta name="description" content="View your order history and track your purchases" />
      </Head>

      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container-custom py-24">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">Order History</h1>
                <p className="text-gray-700 dark:text-gray-200">
                  Track your purchases and order status
                </p>
              </div>
              <Link 
                href="/buyer/dashboard" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow hover:shadow-md text-gray-700 border"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>

            {isLoading ? (
              <div className="card-glass p-8 flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" /> Loading your orders...
              </div>
            ) : error ? (
              <div className="card-glass p-6 text-red-600">{error}</div>
            ) : orders.length === 0 ? (
              <div className="card-glass p-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">No orders yet</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Start shopping to see your orders here.</p>
                <Link href="/buyer/marketplaces" className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">Browse Marketplaces</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">Order #{order._id.slice(-8)}</div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(order.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order._id, 'paid')}
                              disabled={updating === order._id}
                              className="mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
                            >
                              {updating === order._id ? 'Updating...' : 'Mark as Paid'}
                            </button>
                          )}
                        </div>
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</div>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-600" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      Product {String(item.productId).slice(-6)}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {formatCurrency(item.unitPrice * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
