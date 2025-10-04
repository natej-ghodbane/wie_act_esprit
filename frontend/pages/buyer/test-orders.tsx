"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { orderAPI } from '@/utils/api';

export default function TestOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setMessage('Updating order status...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        setMessage(`Order ${orderId} updated to ${status}`);
        fetchOrders(); // Refresh the list
      } else {
        setMessage('Failed to update order status');
      }
    } catch (e) {
      setMessage('Error updating order status');
      console.error(e);
    }
  };

  const testWebhook = async (orderId: string) => {
    try {
      setMessage('Testing webhook...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/payments/test-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ orderId })
      });
      
      if (response.ok) {
        setMessage(`Webhook test successful for order ${orderId}`);
        fetchOrders(); // Refresh the list
      } else {
        setMessage('Webhook test failed');
      }
    } catch (e) {
      setMessage('Error testing webhook');
      console.error(e);
    }
  };

  const markAllPaid = async () => {
    try {
      setMessage('Marking all orders as paid...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/payments/mark-all-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        fetchOrders(); // Refresh the list
      } else {
        setMessage('Failed to mark all orders as paid');
      }
    } catch (e) {
      setMessage('Error marking all orders as paid');
      console.error(e);
    }
  };

  return (
    <>
      <Head>
        <title>Test Orders | KOFTI</title>
      </Head>

      <main className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Test Orders</h1>
          
          <div className="mb-6 flex gap-4">
            <button
              onClick={markAllPaid}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Mark All Orders as Paid
            </button>
          </div>
          
          {message && (
            <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
              {message}
            </div>
          )}

          {isLoading ? (
            <div>Loading orders...</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border p-4 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">Order #{order._id.slice(-8)}</div>
                      <div className="text-sm text-gray-600">
                        Status: <span className="font-semibold">{order.status}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Total: ${order.totalAmount}
                      </div>
                      <div className="text-sm text-gray-600">
                        Items: {order.items?.length || 0}
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => updateOrderStatus(order._id, 'paid')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                      >
                        Mark as Paid
                      </button>
                      <button
                        onClick={() => testWebhook(order._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        Test Webhook
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
