import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BookOpen, Leaf, ArrowLeft } from 'lucide-react';

export default function VendorHelpPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Auth: must be logged in and role === 'farmer'
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRaw = localStorage.getItem('user');
      if (!token || !userRaw) {
        setIsAuthorized(false);
        router.push('/auth/login');
        return;
      }
      const user = JSON.parse(userRaw || '{}');
      if (user?.role !== 'farmer') {
        setIsAuthorized(false);
        router.push('/auth/login');
        return;
      }
      setIsAuthorized(true);
    } catch {
      setIsAuthorized(false);
      router.push('/auth/login');
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, [router]);

  if (isAuthorized === null) {
    return null;
  }
  if (isAuthorized === false) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/vendor/dashboard')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border backdrop-blur-xl transition-colors ${
              isDarkMode ? 'border-purple-700/40 text-purple-200 hover:bg-purple-800/30' : 'border-purple-200/60 text-purple-900 hover:bg-purple-100/50'
            }`}
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border backdrop-blur-xl ${
            isDarkMode ? 'border-purple-700/40 text-purple-200' : 'border-purple-200/60 text-purple-900'
          }`}>
            <Leaf className="w-4 h-4 text-green-500" /> KOFTI
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-3">
            <BookOpen className="w-8 h-8" /> Farmer Manual
          </h1>
          <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
            A short guide to organizing your marketplace and managing products effectively.
          </p>
        </div>

        {/* Content */}
        <div className={`rounded-3xl border shadow-lg backdrop-blur-xl ${
          isDarkMode ? 'bg-purple-900/30 border-purple-700/40' : 'bg-white/70 border-purple-200/60'
        }`}>
          <div className="p-6 space-y-8">
            {/* TOC */}
            <div>
              <h2 className="text-xl font-bold mb-2">Contents</h2>
              <ul className="list-disc pl-6 text-sm">
                <li><a className="text-pink-600" href="#roles">Roles</a></li>
                <li><a className="text-pink-600" href="#taxonomy">Category taxonomy</a></li>
                <li><a className="text-pink-600" href="#marketplaces">Manage marketplaces</a></li>
                <li><a className="text-pink-600" href="#products">Manage products</a></li>
                <li><a className="text-pink-600" href="#best">Best practices</a></li>
                <li><a className="text-pink-600" href="#errors">Common errors</a></li>
              </ul>
            </div>

            <section id="roles">
              <h2 className="text-xl font-bold mb-2">1) Roles</h2>
              <ul className="list-disc pl-6 text-sm">
                <li><strong>Farmer (Vendor)</strong>: Create your own marketplace(s) and products. You can only edit and delete your own data.</li>
                <li><strong>Buyer</strong>: Browse and purchase products.</li>
                <li><strong>Admin</strong>: Oversees the platform and helps with moderation.</li>
              </ul>
            </section>

            <section id="taxonomy">
              <h2 className="text-xl font-bold mb-2">2) Category taxonomy</h2>
              <p className="text-sm mb-2">Use one of these categories for every product to keep browsing clean and simple:</p>
              <ul className="list-disc pl-6 text-sm">
                <li>fruits_vegetables – All fruits and vegetables</li>
                <li>farming_tools – Tools and equipment</li>
                <li>meat_livestock – Meat, sheep, cows</li>
                <li>dairy_products – Milk, cheese, yogurt, butter, etc.</li>
              </ul>
            </section>

            <section id="marketplaces">
              <h2 className="text-xl font-bold mb-2">3) Manage marketplaces</h2>
              <p className="text-sm">Go to <strong>Vendor Dashboard → My Marketplaces</strong>.</p>
              <ul className="list-disc pl-6 text-sm mt-2">
                <li><strong>Create</strong>: Provide name, description, (optional) location, and categories.</li>
                <li><strong>Edit</strong>: You can update details anytime.</li>
                <li><strong>Delete</strong>: Only possible if no products remain in the marketplace.</li>
              </ul>
            </section>

            <section id="products">
              <h2 className="text-xl font-bold mb-2">4) Manage products</h2>
              <p className="text-sm">Go to <strong>Vendor Dashboard → Manage Products</strong>.</p>
              <ul className="list-disc pl-6 text-sm mt-2">
                <li><strong>Add</strong>: Title, description, price, category, marketplace are required. Images, inventory, unit are optional.</li>
                <li><strong>Update</strong>: Edit price, inventory, category, images as needed.</li>
                <li><strong>Move</strong>: You can move a product to another of your marketplaces.</li>
              </ul>
              <p className="text-xs mt-2">Tip: Choose the correct category so buyers can find items quickly.</p>
            </section>

            <section id="best">
              <h2 className="text-xl font-bold mb-2">5) Best practices</h2>
              <ul className="list-disc pl-6 text-sm">
                <li>Keep product names short and descriptive (e.g., “Organic Tomatoes”).</li>
                <li>Use consistent units (kg, piece, dozen).</li>
                <li>Use high-quality images, with the best one first.</li>
                <li>Keep marketplace info accurate (location and categories).</li>
              </ul>
            </section>

            <section id="errors">
              <h2 className="text-xl font-bold mb-2">6) Common errors</h2>
              <ul className="list-disc pl-6 text-sm">
                <li><strong>400 Bad Request</strong> when adding a product: ensure all required fields are set and marketplace belongs to you.</li>
                <li><strong>Product not visible</strong>: check category filters and that the product is active.</li>
                <li><strong>Cannot delete marketplace</strong>: remove or move existing products first.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
