"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { paymentsAPI } from '@/utils/api';
import { useCart } from '@/components/CartProvider';
import { Stripe } from '@stripe/stripe-js';
import stripePromise from '@/utils/stripe';

interface CartLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: CartLineItem[];
  onSuccess?: () => void;
}

export default function PaymentModal({ isOpen, onClose, total, items, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCart();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Get current user email
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Create checkout session
      const response = await paymentsAPI.createCheckout({
        items,
        successUrl: `${window.location.origin}/buyer/orders?status=success`,
        cancelUrl: `${window.location.origin}/buyer/marketplace?status=cancel`,
        customerEmail: user.email
      });

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Redirect to checkout
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }


    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-neutral-800/20">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Payment</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close payment modal">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 border-b border-white/20 dark:border-neutral-800/20">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Order Summary</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">{item.name} × {item.quantity}</span>
                <span className="text-neutral-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold text-lg mt-3 pt-3 border-t border-white/20 dark:border-neutral-800/20">
            <span className="text-neutral-900 dark:text-white">Total:</span>
            <span className="text-neutral-900 dark:text-white">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-6">
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing} 
            className="w-full" 
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              `Proceed to Checkout • $${total.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
