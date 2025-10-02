import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function DebugInventoryPage() {
  const [inventory, setInventory] = useState(5);
  const [threshold, setThreshold] = useState(5);

  const testNotificationLogic = (newValue: number) => {
    console.log('Testing notification logic:');
    console.log('- New value:', newValue);
    console.log('- Threshold:', threshold);
    console.log('- Condition (newValue <= threshold && newValue > 0):', newValue <= threshold && newValue > 0);

    setInventory(newValue);

    // This is the exact logic from your vendor products page
    if (newValue <= threshold && newValue > 0) {
      console.log('✅ Should show LOW STOCK notification');
      toast((t) => (
        <div className="text-sm">
          <strong>Low stock:</strong> This product has {newValue} left. Consider restocking.
          <div className="mt-1 text-xs text-gray-600">Threshold is {threshold}.</div>
        </div>
      ), { icon: '⚠️' });
    } else if (newValue === 0) {
      console.log('✅ Should show OUT OF STOCK notification');
      toast((t) => (
        <div className="text-sm">
          <strong>Out of stock:</strong> This product needs immediate restocking!
        </div>
      ), { icon: '🚨' });
    } else {
      console.log('✅ Should show SUCCESS notification');
      toast.success('Inventory updated');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Toaster position="top-right" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
          🔍 Inventory Notification Debug
        </h1>

        {/* Current Status */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#555', marginBottom: '1rem' }}>Current Status:</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <strong>Inventory:</strong> 
              <span style={{ 
                fontSize: '2rem', 
                marginLeft: '0.5rem',
                color: inventory === 0 ? '#dc2626' : inventory <= threshold ? '#d97706' : '#059669',
                fontWeight: 'bold'
              }}>
                {inventory}
              </span>
            </div>
            <div>
              <strong>Threshold:</strong> 
              <span style={{ fontSize: '1.5rem', marginLeft: '0.5rem', color: '#6b7280' }}>
                {threshold}
              </span>
            </div>
          </div>
          
          {/* Status Badge */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            {inventory === 0 && (
              <span style={{ 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                padding: '0.5rem 1rem', 
                borderRadius: '9999px', 
                fontWeight: 'bold' 
              }}>
                🚨 OUT OF STOCK
              </span>
            )}
            {inventory > 0 && inventory <= threshold && (
              <span style={{ 
                backgroundColor: '#fef3c7', 
                color: '#d97706', 
                padding: '0.5rem 1rem', 
                borderRadius: '9999px', 
                fontWeight: 'bold' 
              }}>
                ⚠️ LOW STOCK
              </span>
            )}
            {inventory > threshold && (
              <span style={{ 
                backgroundColor: '#dcfce7', 
                color: '#059669', 
                padding: '0.5rem 1rem', 
                borderRadius: '9999px', 
                fontWeight: 'bold' 
              }}>
                ✅ HEALTHY STOCK
              </span>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#555', marginBottom: '1rem' }}>Test Scenarios:</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => testNotificationLogic(2)}
              style={{
                padding: '1rem',
                backgroundColor: '#d97706',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Set to 2
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Should trigger LOW STOCK</div>
            </button>
            
            <button
              onClick={() => testNotificationLogic(0)}
              style={{
                padding: '1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Set to 0
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Should trigger OUT OF STOCK</div>
            </button>
            
            <button
              onClick={() => testNotificationLogic(10)}
              style={{
                padding: '1rem',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Set to 10
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Should show SUCCESS</div>
            </button>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <h3 style={{ color: '#555', marginBottom: '1rem' }}>Manual Input:</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
              <label style={{ fontWeight: 'bold' }}>Set inventory to:</label>
              <input
                type="number"
                min="0"
                placeholder="Enter quantity"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '100px',
                  textAlign: 'center'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = Number((e.target as HTMLInputElement).value);
                    testNotificationLogic(value);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  const value = Number(input.value);
                  testNotificationLogic(value);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Test
              </button>
            </div>
          </div>
        </div>

        {/* Threshold Control */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#555', marginBottom: '1rem' }}>Threshold Setting:</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <label style={{ fontWeight: 'bold' }}>Low stock threshold:</label>
            <input
              type="number"
              min="0"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '80px',
                textAlign: 'center'
              }}
            />
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              (Items ≤ this number will show low stock alert)
            </span>
          </div>
        </div>

        {/* Debug Info */}
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '1rem', 
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Debug Instructions:</h3>
          <ul style={{ color: '#6b7280', margin: 0, paddingLeft: '1.5rem' }}>
            <li>Open your browser's console (F12) to see debug logs</li>
            <li>Click "Set to 2" - you should see a low stock notification</li>
            <li>If notifications don't appear, check for console errors</li>
            <li>This page uses the exact same logic as your main inventory page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}