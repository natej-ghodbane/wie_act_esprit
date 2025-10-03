import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { productAPI } from '../utils/api';

interface Product {
  _id: string;
  title: string;
  inventory: number;
  lowStockThreshold: number;
}

interface SimpleInventoryManagerProps {
  productId: string;
  initialInventory?: number;
  initialThreshold?: number;
  productTitle?: string;
}

export default function SimpleInventoryManager({ 
  productId, 
  initialInventory = 0, 
  initialThreshold = 5,
  productTitle = "Product"
}: SimpleInventoryManagerProps) {
  const [inventory, setInventory] = useState(initialInventory);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to update inventory and show notifications
  const updateInventory = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setIsUpdating(true);
    const previousQuantity = inventory;
    
    try {
      // Update inventory via API
      await productAPI.adjustStock(productId, {
        newQuantity,
        reason: 'manual_adjustment',
        notes: 'Simple inventory update'
      });

      // Update local state
      setInventory(newQuantity);

      // Show appropriate notifications
      if (newQuantity === 0) {
        toast.error(`🚨 ${productTitle} is now OUT OF STOCK!`, {
          duration: 5000,
          style: {
            background: '#fee2e2',
            color: '#dc2626',
            fontWeight: 'bold'
          }
        });
      } else if (newQuantity <= threshold && previousQuantity > threshold) {
        toast.warning(`⚠️ ${productTitle} is now LOW STOCK! Only ${newQuantity} left (threshold: ${threshold})`, {
          duration: 5000,
          style: {
            background: '#fef3c7',
            color: '#d97706',
            fontWeight: 'bold'
          }
        });
      } else if (newQuantity > threshold && previousQuantity <= threshold) {
        toast.success(`✅ ${productTitle} restocked successfully! Now has ${newQuantity} items`, {
          duration: 4000,
          style: {
            background: '#dcfce7',
            color: '#16a34a',
            fontWeight: 'bold'
          }
        });
      } else {
        toast.success(`Inventory updated: ${productTitle} now has ${newQuantity} items`);
      }

    } catch (error) {
      toast.error('Failed to update inventory');
      console.error('Error updating inventory:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to update threshold
  const updateThreshold = async (newThreshold: number) => {
    try {
      await productAPI.updateThreshold(productId, { threshold: newThreshold });
      setThreshold(newThreshold);
      toast.success(`Threshold updated to ${newThreshold}`);
    } catch (error) {
      toast.error('Failed to update threshold');
      console.error('Error updating threshold:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{productTitle}</h3>
      
      {/* Current Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="flex justify-between items-center">
          <span>Current Inventory:</span>
          <span className={`font-bold text-lg ${
            inventory === 0 ? 'text-red-600' : 
            inventory <= threshold ? 'text-amber-600' : 
            'text-green-600'
          }`}>
            {inventory}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span>Low Stock Threshold:</span>
          <span className="font-semibold">{threshold}</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mb-4">
        {inventory === 0 && (
          <div className="bg-red-100 text-red-800 p-2 rounded text-center font-semibold">
            🚨 OUT OF STOCK
          </div>
        )}
        {inventory > 0 && inventory <= threshold && (
          <div className="bg-amber-100 text-amber-800 p-2 rounded text-center font-semibold">
            ⚠️ LOW STOCK
          </div>
        )}
        {inventory > threshold && (
          <div className="bg-green-100 text-green-800 p-2 rounded text-center font-semibold">
            ✅ HEALTHY STOCK
          </div>
        )}
      </div>

      {/* Inventory Controls */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Update Inventory:</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateInventory(Math.max(0, inventory - 1))}
            disabled={isUpdating || inventory <= 0}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            -1
          </button>
          
          <input
            type="number"
            value={inventory}
            onChange={(e) => setInventory(Number(e.target.value))}
            min="0"
            className="w-20 text-center border rounded px-2 py-1"
          />
          
          <button
            onClick={() => updateInventory(inventory + 1)}
            disabled={isUpdating}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            +1
          </button>
          
          <button
            onClick={() => updateInventory(inventory)}
            disabled={isUpdating}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Quick Actions:</label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => updateInventory(0)}
            disabled={isUpdating}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
          >
            Set to 0 (Out of Stock)
          </button>
          <button
            onClick={() => updateInventory(2)}
            disabled={isUpdating}
            className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 text-sm"
          >
            Set to 2 (Low Stock)
          </button>
          <button
            onClick={() => updateInventory(10)}
            disabled={isUpdating}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            Set to 10 (Restock)
          </button>
        </div>
      </div>

      {/* Threshold Controls */}
      <div>
        <label className="block text-sm font-medium mb-2">Update Threshold:</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            min="0"
            className="w-20 text-center border rounded px-2 py-1"
          />
          <button
            onClick={() => updateThreshold(threshold)}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Update Threshold
          </button>
        </div>
      </div>
    </div>
  );
}