import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BuyerSidebar from '../../components/BuyerSidebar';
import CheckoutStandalone from '../checkout';
import UserProfileDropdown from '../../components/UserProfileDropdown';

export default function BuyerCheckoutPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'buyer') {
        router.push('/auth/login');
      }
      setUser(parsed);
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200">
      <div className="flex">
        <BuyerSidebar onLogout={handleLogout} onOpenChange={setSidebarOpen} />
        <main className={"flex-1 " + (sidebarOpen ? 'md:ml-64' : '')}>
          <nav className="sticky top-0 z-20 bg-white/10 backdrop-blur-xl border-b border-white/20">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-end items-center h-16">
                {user && <UserProfileDropdown user={user} />}
              </div>
            </div>
          </nav>
          {/* Reuse the existing checkout UI inside the buyer shell */}
          <CheckoutStandalone />
        </main>
      </div>
    </div>
  );
}


