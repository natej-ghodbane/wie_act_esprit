import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BuyerSidebarProps {
  onLogout?: () => void;
  onOpenChange?: (open: boolean) => void;
}

const BuyerSidebar: React.FC<BuyerSidebarProps> = ({ onLogout, onOpenChange }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(true);

  const nav = [
    { href: '/buyer/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/buyer/products', label: 'Products', icon: '🛍️' },
    { href: '/buyer/marketplace', label: 'Marketplace', icon: '🏪' },
    { href: '/buyer/checkout', label: 'Checkout', icon: '💳' },
    { href: '/buyer/orders', label: 'My Orders', icon: '🧾' },
  ];

  return (
    <>
    {/* Sidebar panel */}
    <aside className={`fixed left-0 top-0 z-40 hidden md:flex md:flex-col h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Enhanced glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-white/60 backdrop-blur-xl" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-rose-50/30 to-purple-50/40" />
      
      {/* Clean border */}
      <div className="absolute inset-0 border-r border-pink-200/50" />
      
      {/* Content container */}
      <div className="relative flex flex-col h-full p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            {!collapsed && (
              <span className="text-base font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                AGRI-HOPE
              </span>
            )}
          </div>
          <button
            aria-label="Toggle sidebar"
            onClick={() => {
              if (open) {
                setCollapsed(true);
                setTimeout(() => { setOpen(false); onOpenChange && onOpenChange(false); }, 0);
              } else {
                setOpen(true);
                setTimeout(() => setCollapsed(false), 200);
                onOpenChange && onOpenChange(true);
              }
            }}
            className="p-2 rounded-lg hover:bg-pink-100/50 text-gray-600 hover:text-gray-900 transition-all duration-200"
            title={open ? 'Hide sidebar' : 'Show sidebar'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75z" />
            </svg>
          </button>
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
              Navigation
            </div>
            <div className="h-px bg-gradient-to-r from-pink-200 via-rose-200 to-transparent" />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-2">
          {nav.map((item, index) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'
                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                {/* Active indicator */}
                {active && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                )}
                
                {/* Icon */}
                <span className={`text-lg transition-transform group-hover:scale-110 ${active ? 'drop-shadow-sm' : ''}`}>
                  {item.icon}
                </span>
                
                {/* Label */}
                {!collapsed && (
                  <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="mt-6 pt-4 border-t border-pink-200/50">
          <button 
            onClick={onLogout} 
            className={`w-full px-4 py-3 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-200 font-medium text-sm flex items-center gap-2 ${collapsed ? 'justify-center' : 'justify-center'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>

    {/* Floating open button when sidebar is hidden */}
    {!open && (
      <button
        aria-label="Show sidebar"
        onClick={() => { setOpen(true); onOpenChange && onOpenChange(true); setTimeout(() => setCollapsed(false), 200); }}
        className="hidden md:flex fixed left-4 top-4 z-30 p-3 rounded-xl bg-white/90 backdrop-blur-md text-gray-700 shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:bg-white transition-all duration-200 hover:scale-105 border border-pink-200/50"
        title="Show sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75z" />
        </svg>
      </button>
    )}
    </>
  );
};

export default BuyerSidebar;