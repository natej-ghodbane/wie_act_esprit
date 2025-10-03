import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function NotificationTestPage() {
  const [quantity, setQuantity] = useState(5);
  const [threshold, setThreshold] = useState(5);

  const showLowStockNotification = () => {
    toast((t) => (
      <div className="text-sm">
        <strong>⚠️ Low Stock Alert:</strong> Product quantity is {quantity} (threshold: {threshold})
        <div className="mt-1 text-xs text-gray-600">This is a test notification</div>
      </div>
    ), { 
      icon: '⚠️',
      duration: 5000,
      style: {
        background: '#fef3c7',
        color: '#d97706',
      }
    });
  };

  const showOutOfStockNotification = () => {
    toast.error('🚨 OUT OF STOCK: Product needs immediate restocking!', {
      duration: 5000,
      style: {
        background: '#fee2e2',
        color: '#dc2626',
        fontWeight: 'bold'
      }
    });
  };

  const showRestockNotification = () => {
    toast.success('✅ Product restocked successfully!', {
      duration: 4000,
      style: {
        background: '#dcfce7',
        color: '#16a34a',
        fontWeight: 'bold'
      }
    });
  };

  const testQuantityChange = (newQuantity: number) => {
    const previousQuantity = quantity;
    setQuantity(newQuantity);

    // Simulate the notification logic
    if (newQuantity === 0) {
      showOutOfStockNotification();
    } else if (newQuantity <= threshold && previousQuantity > threshold) {
      showLowStockNotification();
    } else if (newQuantity > threshold && previousQuantity <= threshold) {
      showRestockNotification();
    } else {
      toast.success(`Quantity updated to ${newQuantity}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🔔 Notification Test Page
          </h1>

          {/* Current Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Current Quantity:</span>
              <span className={`text-2xl font-bold ${
                quantity === 0 ? 'text-red-600' : 
                quantity <= threshold ? 'text-amber-600' : 
                'text-green-600'
              }`}>
                {quantity}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Threshold:</span>
              <span className="text-lg font-semibold">{threshold}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6 text-center">
            {quantity === 0 && (
              <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
                🚨 OUT OF STOCK
              </span>
            )}
            {quantity > 0 && quantity <= threshold && (
              <span className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold">
                ⚠️ LOW STOCK
              </span>
            )}
            {quantity > threshold && (
              <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                ✅ HEALTHY STOCK
              </span>
            )}
          </div>

          {/* Test Buttons */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Test Notifications:</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => testQuantityChange(2)}
                className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold"
              >
                Set to 2
                <div className="text-xs">Low Stock Alert</div>
              </button>
              
              <button
                onClick={() => testQuantityChange(0)}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Set to 0
                <div className="text-xs">Out of Stock</div>
              </button>
              
              <button
                onClick={() => testQuantityChange(10)}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Set to 10
                <div className="text-xs">Restock Alert</div>
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-600 mb-3">Manual Controls:</h3>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => testQuantityChange(Math.max(0, quantity - 1))}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={quantity <= 0}
                >
                  -1
                </button>
                
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => testQuantityChange(Number(e.target.value))}
                  min="0"
                  className="w-16 text-center border rounded px-2 py-1"
                />
                
                <button
                  onClick={() => testQuantityChange(quantity + 1)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +1
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-600 mb-3">Threshold Setting:</h3>
              <div className="flex items-center justify-center gap-3">
                <label className="font-medium">Threshold:</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  min="0"
                  className="w-16 text-center border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-600 mb-3">Direct Notification Tests:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={showLowStockNotification}
                  className="px-3 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600"
                >
                  Show Low Stock
                </button>
                <button
                  onClick={showOutOfStockNotification}
                  className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Show Out of Stock
                </button>
                <button
                  onClick={showRestockNotification}
                  className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Show Restock
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Click the test buttons to trigger different notification types</li>
              <li>• Notifications will appear in the top-right corner</li>
              <li>• This page tests notifications without API calls</li>
              <li>• Use this to verify that notifications work correctly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}