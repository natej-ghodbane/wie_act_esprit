import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BuyerSidebar from '../../components/BuyerSidebar';
import { productAPI } from '../../utils/api';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export default function BuyerProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'buyer') {
        router.push('/auth/login');
        return;
      }
    } catch {
      router.push('/auth/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await productAPI.getAll();
        setProducts(res.data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200">
      <div className="flex">
        <BuyerSidebar onLogout={handleLogout} onOpenChange={setSidebarOpen} />
        <main className={"flex-1 p-6 md:p-8 " + (sidebarOpen ? 'md:ml-64' : '')}>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-6">Products</h1>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p._id} className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-4">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover rounded-xl mb-3" />
                  ) : (
                    <div className="w-full h-40 bg-white/60 rounded-xl mb-3 flex items-center justify-center">🌾</div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{p.name}</h3>
                      <p className="text-sm text-gray-700 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="text-pink-600 font-bold">${p.price}</div>
                  </div>
                  <button className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg">Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


