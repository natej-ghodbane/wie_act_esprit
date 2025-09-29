"use client";

import { useState } from 'react';
import { X, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
  const [paymentMethod, setPaymentMethod] = useState<'card'|'mobile'|'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: ''
  });

  const methods = [
    { id: 'card' as const, icon: CreditCard, label: 'Card' },
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
    { id: 'wallet' as const, icon: Wallet, label: 'Wallet' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSuccess?.();
      onClose();
    }, 1800);
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

        {isSuccess ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Payment Successful!</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Your order has been confirmed and will be processed shortly.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/20 dark:border-neutral-800/20">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Order Summary</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.map(item => (
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

            <div className="p-6 border-b border-white/20 dark:border-neutral-800/20">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-2">
                {methods.map((m) => (
                  <Button
                    key={m.id}
                    variant={paymentMethod === m.id ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod(m.id)}
                  >
                    <m.icon className="w-4 h-4 mr-1" /> {m.label}
                  </Button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium">Card Number</label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={(e) => handleInputChange('cardNumber', e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium">Expiry Date</label>
                      <Input id="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={(e) => handleInputChange('expiryDate', e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium">CVV</label>
                      <Input id="cvv" placeholder="123" value={formData.cvv} onChange={(e) => handleInputChange('cvv', e.target.value)} required />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium">Delivery Address</label>
                <Input id="address" placeholder="123 Main St, City, Country" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
              </div>

              <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 