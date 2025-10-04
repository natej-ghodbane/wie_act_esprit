"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { paymentsAPI, orderAPI } from '@/utils/api';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

export default function BuyerCartPage() {
  const { items, setItems, total } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);
    setItems(newItems as any[]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (!items.length || isPaying) return;
    setIsPaying(true);
    try {
      // First create an order with pending status
      const orderPayload = {
        items: items.map(i => ({ 
          productId: i.id, 
          quantity: i.quantity, 
          unitPrice: i.price 
        }))
      };
      
      const orderResponse = await orderAPI.create(orderPayload);
      console.log('Order created:', orderResponse.data);
      
      // Get current user email
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Then create Stripe checkout session
      const payload = {
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        successUrl: `${window.location.origin}/buyer/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/buyer/cart?status=cancel`,
        orderId: orderResponse.data._id || orderResponse.data.id, // Pass the order ID
        customerEmail: user.email, // Pass customer email for webhook processing
      };
      
      const { data } = await paymentsAPI.createCheckout(payload);
      if (data?.url) {
        // Store session ID with the order (we'll need to update the order)
        // For now, the webhook will use fallback method
        window.location.href = data.url as string;
      }
    } catch (e) {
      console.error('Checkout error:', e);
      // eslint-disable-next-line no-alert
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      <Head>
        <title>Your Cart | KOFTI</title>
        <meta name="description" content="Review and manage your cart items" />
      </Head>

      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container-custom py-24">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">Your Cart</h1>
                <p className="text-gray-700 dark:text-gray-200">
                  {items.length 
                    ? `You have ${items.length} item${items.length === 1 ? '' : 's'} in your cart`
                    : 'Your cart is empty'}
                </p>
              </motion.div>
            </header>

            {isLoading ? (
              <div className="card-glass p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-900 dark:text-white">Loading your cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="card-glass p-10 text-center">
                <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Your cart is empty</h2>
                <p className="text-gray-900 dark:text-white mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Link href="/buyer/marketplaces" className="btn btn-primary">Browse Products</Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="card-glass divide-y divide-neutral-100 dark:divide-neutral-800 rounded-2xl overflow-hidden">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 flex items-center gap-4 bg-white dark:bg-gray-800"
                    >
                      <div className="relative w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden ring-1 ring-neutral-100 dark:ring-neutral-800">
                        <Image
                          src={'/placeholder.png'}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="transition-transform hover:scale-110 object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-9 h-9 p-0 rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-9 h-9 p-0 rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right min-w-[110px]">
                        <div className="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors mt-1"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="card-glass p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Link href="/buyer/marketplaces" className="btn btn-outline">Continue Shopping</Link>
                    <button 
                      onClick={handleCheckout}
                      disabled={isPaying}
                      className="btn btn-primary inline-flex items-center disabled:opacity-70"
                    >
                      {isPaying ? 'Redirecting...' : 'Checkout'} <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}


