"use client";

import { useEffect, useMemo, useState } from 'react';
import ProductCard, { ProductUI } from './ProductCard';
import PaymentModal from './PaymentModal';
import { Button } from '@/components/ui/Button';

import { mockProducts } from './data/mockData';

// Map the mock data to match ProductUI type
const sampleProducts: ProductUI[] = mockProducts.map(product => ({
  id: String(product.id),
  name: product.name,
  price: product.price,
  image: product.image,
  category: product.category,
  description: product.description,
  rating: product.rating,
  reviews: product.reviews,
  vendorName: product.farmer
}));

interface CartItem { id: string; name: string; price: number; quantity: number; }

interface ProductGridProps {
  vendorName?: string;
}

export default function ProductGrid({ vendorName }: ProductGridProps) {
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredProducts = vendorName 
        ? sampleProducts.filter(p => p.vendorName === vendorName)
        : sampleProducts;
      setProducts(filteredProducts);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [vendorName]);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const addToCart = async (p: ProductUI) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id);
      if (existing) {
        return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: p.id, name: p.name, price: p.price, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-glass animate-pulse">
              <div className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Fresh Products</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Discover our premium selection of fresh, organic produce</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-neutral-700 dark:text-neutral-300">Items: {cart.reduce((s, i) => s + i.quantity, 0)}</div>
          <div className="text-sm font-semibold">Total: ${total.toFixed(2)}</div>
          <Button size="sm" disabled={cart.length === 0} onClick={() => setPaymentOpen(true)}>Checkout</Button>
          <Button size="sm" variant="outline" disabled={cart.length === 0} onClick={clearCart}>Clear</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
            <ProductCard product={product} onAdd={addToCart} />
          </div>
        ))}
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={total}
        items={cart}
        onSuccess={clearCart}
      />
    </div>
  );
} 