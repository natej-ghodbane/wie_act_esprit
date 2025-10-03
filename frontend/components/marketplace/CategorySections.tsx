"use client";

import { useEffect, useState } from 'react';
import ProductCard, { ProductUI } from './ProductCard'
import apiClient from '@/utils/api';

const categories = ["Fruits", "Vegetables", "Dairy & Eggs", "Pantry"] as const

export default function CategorySections() {
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [loading, setLoading] = useState(true);
  const byCategory: Record<string, ProductUI[]> = {}
  categories.forEach(cat => { byCategory[cat] = [] })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  products.forEach(p => {
    const cat = p.category
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push({
      id: String(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      description: p.description,
      rating: p.rating,
      reviews: p.reviews,
      vendorName: p.vendorName,
    })
  })

  return (
    <div className="container-custom space-y-12">
      {categories.map(cat => (
        <section key={cat} aria-labelledby={`cat-${cat}`}>
          <div className="mb-5">
            <h2 id={`cat-${cat}`} className="text-2xl font-bold text-neutral-900 dark:text-white">
              {cat}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(byCategory[cat] || []).map((product, idx) => (
              <div key={product.id} className={`animate-fade-in-up delay-${idx}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
} 