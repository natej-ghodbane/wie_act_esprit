import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import SimpleInventoryManager from '../components/SimpleInventoryManager';
import { productAPI } from '../utils/api';

export default function TestInventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products. Make sure you are logged in.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Inventory Modification Test
          </h1>
          <p className="text-gray-600">
            Test inventory modifications and notifications
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No products found. Create some products first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <SimpleInventoryManager
                key={product._id}
                productId={product._id}
                initialInventory={product.inventory || 0}
                initialThreshold={product.lowStockThreshold || 5}
                productTitle={product.title}
              />
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            📋 How to Test Notifications:
          </h2>
          <ul className="text-blue-800 space-y-2">
            <li>• Click "Set to 2 (Low Stock)" to trigger a low stock notification</li>
            <li>• Click "Set to 0 (Out of Stock)" to trigger an out-of-stock alert</li>
            <li>• Click "Set to 10 (Restock)" to trigger a restock notification</li>
            <li>• Use +/- buttons or type directly in the input field</li>
            <li>• Notifications will appear in the top-right corner</li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Debug Info:</h3>
          <p className="text-sm text-gray-600">
            Found {products.length} products | 
            Backend URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}
          </p>
        </div>
      </div>
    </div>
  );
}