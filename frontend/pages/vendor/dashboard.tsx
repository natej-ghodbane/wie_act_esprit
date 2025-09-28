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
  farmLocation?: string;
}

export default function VendorDashboard() {
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
      if (parsedUser.role !== 'farmer') {
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
              <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 font-medium text-sm">
                Add Product
              </button>
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
              🌾 Vendor Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your agricultural products and sales</p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-pink-200/20 p-6 hover:bg-white/20 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
            <p className="text-3xl font-bold text-pink-600">12</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-pink-200/20 p-6 hover:bg-white/20 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800">Active Orders</h3>
            <p className="text-3xl font-bold text-rose-600">8</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-pink-200/20 p-6 hover:bg-white/20 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">$2,450</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-pink-200/20">
          <div className="px-6 py-4 border-b border-pink-200/20">
            <h3 className="text-lg font-semibold text-gray-800">Recent Products</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700">Your agricultural products will appear here...</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}