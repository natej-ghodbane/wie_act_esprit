import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function SimpleTestPage() {
  const [quantity, setQuantity] = useState(5);

  const showNotification = (type: string) => {
    if (type === 'low') {
      toast('⚠️ Low Stock Alert: Only ' + quantity + ' items left!', {
        duration: 5000,
      });
    } else if (type === 'out') {
      toast.error('🚨 OUT OF STOCK!', {
        duration: 5000,
      });
    } else if (type === 'restock') {
      toast.success('✅ Restocked successfully!', {
        duration: 4000,
      });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <Toaster position="top-right" />
      
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>
        Simple Notification Test
      </h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p><strong>Current Quantity:</strong> <span style={{ fontSize: '1.5rem', color: quantity <= 5 ? '#d97706' : '#059669' }}>{quantity}</span></p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Quick Test Buttons:</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setQuantity(2); showNotification('low'); }}
            style={{
              padding: '1rem',
              backgroundColor: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Set to 2 (Low Stock)
          </button>
          
          <button
            onClick={() => { setQuantity(0); showNotification('out'); }}
            style={{
              padding: '1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Set to 0 (Out of Stock)
          </button>
          
          <button
            onClick={() => { setQuantity(10); showNotification('restock'); }}
            style={{
              padding: '1rem',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Set to 10 (Restock)
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Manual Controls:</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            -1
          </button>
          
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              textAlign: 'center',
              width: '80px'
            }}
            min="0"
          />
          
          <button
            onClick={() => setQuantity(quantity + 1)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            +1
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Direct Notification Tests:</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => showNotification('low')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Show Low Stock
          </button>
          <button
            onClick={() => showNotification('out')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Show Out of Stock
          </button>
          <button
            onClick={() => showNotification('restock')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Show Restock
          </button>
        </div>
      </div>

      <div style={{ padding: '1rem', backgroundColor: '#dbeafe', border: '1px solid #3b82f6', borderRadius: '8px' }}>
        <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Instructions:</h4>
        <ul style={{ color: '#1e40af', fontSize: '0.9rem' }}>
          <li>Click any button to test notifications</li>
          <li>Notifications will appear in the top-right corner</li>
          <li>This page uses minimal dependencies</li>
          <li>If you see notifications here, the system works!</li>
        </ul>
      </div>
    </div>
  );
}