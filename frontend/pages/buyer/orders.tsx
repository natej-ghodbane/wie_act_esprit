import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BuyerSidebar from '../../components/BuyerSidebar';
import { orderAPI } from '../../utils/api';

interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
}

export default function BuyerOrdersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
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

    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getAll();
        setOrders(res.data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
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
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-6">My Orders</h1>
          {isLoading ? (
            <div>Loading...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6">No orders yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Order #{o._id.slice(-6)}</div>
                    <div className="text-sm text-gray-700">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="px-3 py-1 rounded-full bg-white text-gray-800 border border-white/60">{o.status}</span>
                    <span className="text-pink-600 font-bold">${o.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


