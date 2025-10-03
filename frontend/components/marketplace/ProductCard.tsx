"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { addItem } from '@/utils/cart';

export interface ProductUI {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  vendorName?: string;
}

interface ProductCardProps {
  product: ProductUI;
  onAdd?: (product: ProductUI) => Promise<void> | void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(product.image || '/placeholder.png');
  const safePrice = Number.isFinite(Number(product?.price)) ? Number(product.price) : 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      if (onAdd) {
        await Promise.resolve(onAdd(product));
      } else {
        addItem({ id: product.id, name: product.name, price: safePrice, quantity: 1 });
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card-glass group overflow-hidden">
      <div className="relative overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          unoptimized
          onError={() => setImgSrc('/placeholder.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Button
          variant="glass"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full transition-all duration-300 ${
            isLiked ? 'text-red-500' : 'text-white'
          }`}
          aria-label={`${isLiked ? 'Remove from' : 'Add to'} favorites`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
        <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 dark:bg-neutral-900/90 rounded-full text-xs font-medium text-neutral-900 dark:text-white">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        {product.vendorName && (
          <a
            href={`/marketplace/vendor/${encodeURIComponent(product.vendorName.toLowerCase().replace(/\s+/g, '-'))}`}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            {product.vendorName}
          </a>
        )}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-neutral-300 dark:text-neutral-600'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-neutral-900 dark:text-white">
            ${safePrice.toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={isAdding ? 'animate-pulse' : ''}
            size="sm"
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 