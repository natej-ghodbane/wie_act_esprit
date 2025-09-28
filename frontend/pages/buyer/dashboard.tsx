import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserProfileDropdown from '../../components/UserProfileDropdown';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'buyer') {
        router.push('/auth/login');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200">
        <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200">
      {/* Fixed Navigation Bar */}
      <nav className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span>AGRI-HOPE</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden lg:block">Welcome back!</span>
              <UserProfileDropdown user={user} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with proper top margin */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              🏪 Buyer Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Discover and purchase fresh agricultural products</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                    🛒
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
                  <p className="text-3xl font-bold text-pink-600">5</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    💰
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Total Spent</h3>
                  <p className="text-3xl font-bold text-rose-600">$320</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                    ⭐
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Favorite Products</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">8</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-300 font-medium">
              🌾 Browse Products
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-300 font-medium">
              🛒 View Cart
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-300 font-medium">
              📋 Order History
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-300 font-medium">
              👤 Profile Settings
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-gray-600">
              <p>No recent activity found.</p>
              <p className="text-sm mt-2">Start browsing products to see your activity here!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}