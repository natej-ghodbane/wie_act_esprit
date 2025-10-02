# Inventory Modification System - Usage Guide

## ✅ System Status
Your inventory modification system is now **FULLY OPERATIONAL** with the following features:

## 🔧 Core Inventory Modification Features

### 1. **Individual Product Inventory Updates**
- **Location**: Vendor Products Page (`/vendor/products`)
- **How to use**:
  1. Navigate to your products page as a farmer/vendor
  2. Each product shows current inventory with +/- buttons
  3. You can:
     - Click `-` to decrease quantity by 1
     - Click `+` to increase quantity by 1
     - Type directly in the quantity input field
     - Click `Save` to apply changes

### 2. **Custom Low Stock Thresholds**
- **Location**: Same products page
- **How to use**:
  1. Look for "Low Stock Alert" section on each product card
  2. Click the ⚙️ (Settings) icon next to the threshold number
  3. Enter your desired threshold (e.g., 3, 5, 10)
  4. Click ✓ to save or ✕ to cancel

### 3. **Automatic Notifications**
- **Location**: Bell icon 🔔 in the top navigation
- **Triggers**:
  - When inventory drops to/below threshold → ⚠️ Low Stock Alert
  - When inventory reaches 0 → 🚨 Out of Stock Alert  
  - When restocking above threshold → ✅ Restock Notification

### 4. **Stock Analytics Dashboard**
- **Location**: Click "Show Analytics" button on products page
- **Shows**:
  - Total products count
  - Total inventory across all products
  - Number of low stock items
  - Number of out-of-stock items
  - Recent stock movement history

## 🚀 API Endpoints for Inventory Modification

### Primary Inventory Update Endpoint:
```
PUT /api/products/:id/stock
Body: {
  "newQuantity": 15,
  "reason": "manual_adjustment", 
  "notes": "Updated inventory"
}
```

### Threshold Update Endpoint:
```
PUT /api/products/:id/threshold
Body: {
  "threshold": 5
}
```

### Bulk Inventory Update:
```
POST /api/products/stock/bulk-update
Body: {
  "updates": [
    {
      "productId": "product1_id",
      "newQuantity": 20,
      "reason": "restock",
      "notes": "Weekly restock"
    }
  ]
}
```

## 🎯 How to Test the System

### Method 1: Through Frontend (Recommended)
1. **Start the applications**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Access the system**:
   - Go to `http://localhost:3000`
   - Login as a farmer/vendor
   - Navigate to products page

3. **Test inventory modifications**:
   - Reduce quantity of a product to 2 (below default threshold of 5)
   - Check the bell icon for low stock notification
   - Reduce to 0 to trigger out-of-stock alert
   - Increase back to 10+ to trigger restock notification

### Method 2: Through Test Script
```bash
cd backend
node test-inventory.js
```

## 📊 Stock Movement Tracking

Every inventory change creates a record in the `stockmovements` collection with:
- **Previous quantity**
- **New quantity** 
- **Change amount** (+/-)
- **Reason** (manual_adjustment, sale, restock, damage, etc.)
- **User who made the change**
- **Timestamp**
- **Optional notes**

## 🔔 Notification System Features

### Notification Types:
- `low_stock` - When inventory ≤ threshold
- `out_of_stock` - When inventory = 0
- `restock` - When inventory goes from low to healthy
- `general` - System messages and daily reports

### Notification Management:
- View all notifications in the notification center
- Mark individual notifications as read
- Mark all notifications as read
- Delete notifications
- Real-time unread count display

## 🕒 Automated Monitoring

### Background Jobs Running:
1. **Hourly Stock Check**: Scans all products for low stock conditions
2. **Daily Reports**: Sends inventory summaries to vendors (9 AM)

### Features:
- Prevents notification spam (24-hour cooldown)
- Only notifies for enabled products (`enableLowStockAlerts: true`)
- Respects individual product thresholds

## 🛠️ Troubleshooting

### Common Issues:

1. **Notifications not appearing**:
   - Check that you're logged in as the product owner
   - Ensure `enableLowStockAlerts` is true for the product
   - Verify threshold settings

2. **Inventory updates failing**:
   - Check authentication (valid token)
   - Verify you own the product
   - Ensure positive numbers for quantity

3. **Frontend not connecting to backend**:
   - Confirm backend is running on port 3001
   - Check `.env.local` file has `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

### Debug Steps:
1. Check browser console for errors
2. Check backend logs for API calls
3. Verify database connection
4. Test individual API endpoints with tools like Postman

## 📈 Analytics Available

- **Product Count**: Total active products
- **Inventory Levels**: Sum of all product quantities  
- **Low Stock Count**: Products below their thresholds
- **Out of Stock Count**: Products with 0 quantity
- **Stock Movements**: History of all inventory changes
- **Average Inventory**: Mean quantity per product

## 🎉 System Benefits

✅ **Real-time inventory tracking**  
✅ **Automated low stock alerts**  
✅ **Complete audit trail of changes**  
✅ **Individual product threshold management**  
✅ **Bulk inventory operations**  
✅ **Comprehensive analytics dashboard**  
✅ **Professional notification system**  
✅ **Background monitoring and reporting**

Your inventory modification system is production-ready and includes enterprise-level features for stock management!