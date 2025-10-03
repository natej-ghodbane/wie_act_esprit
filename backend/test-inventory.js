const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';
const TEST_USER = {
  email: 'farmer@example.com', // You'll need to use an existing user
  password: 'password123'
};

let authToken = null;
let testProductId = null;

// Helper function to make authenticated requests
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

// Test functions
async function login() {
  console.log('🔐 Logging in...');
  try {
    const response = await apiRequest('POST', '/auth/login', TEST_USER);
    authToken = response.access_token;
    console.log('✅ Login successful');
    return response.user;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getProducts() {
  console.log('📦 Fetching products...');
  const products = await apiRequest('GET', '/products');
  console.log(`✅ Found ${products.length} products`);
  return products;
}

async function testInventoryModification(productId, newQuantity) {
  console.log(`\n🔧 Testing inventory modification for product ${productId}`);
  console.log(`   Setting quantity to: ${newQuantity}`);
  
  try {
    // First, get current product info
    const currentProduct = await apiRequest('GET', `/products/${productId}`);
    console.log(`   Current inventory: ${currentProduct.inventory}`);
    console.log(`   Current threshold: ${currentProduct.lowStockThreshold || 5}`);
    
    // Modify inventory using the stock management endpoint
    const result = await apiRequest('PUT', `/products/${productId}/stock`, {
      newQuantity: newQuantity,
      reason: 'manual_adjustment',
      notes: 'Test inventory modification'
    });
    
    console.log('✅ Inventory updated successfully!');
    console.log(`   New inventory: ${result.product.inventory}`);
    console.log(`   Stock movement recorded: ${result.stockMovement.change > 0 ? '+' : ''}${result.stockMovement.change}`);
    
    // Check if this triggered any notifications
    if (newQuantity <= (currentProduct.lowStockThreshold || 5) && newQuantity > 0) {
      console.log('⚠️  This should trigger a low stock notification');
    } else if (newQuantity === 0) {
      console.log('🚨 This should trigger an out-of-stock notification');
    } else {
      console.log('✅ Stock level is healthy');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Inventory modification failed');
    throw error;
  }
}

async function testThresholdUpdate(productId, newThreshold) {
  console.log(`\n🎯 Testing threshold update for product ${productId}`);
  console.log(`   Setting threshold to: ${newThreshold}`);
  
  try {
    const result = await apiRequest('PUT', `/products/${productId}/threshold`, {
      threshold: newThreshold
    });
    
    console.log('✅ Threshold updated successfully!');
    console.log(`   New threshold: ${result.lowStockThreshold}`);
    return result;
  } catch (error) {
    console.error('❌ Threshold update failed');
    throw error;
  }
}

async function testBulkInventoryUpdate(updates) {
  console.log(`\n📊 Testing bulk inventory update for ${updates.length} products`);
  
  try {
    const result = await apiRequest('POST', '/products/stock/bulk-update', {
      updates: updates
    });
    
    console.log('✅ Bulk update completed!');
    console.log(`   Successful updates: ${result.results.length}`);
    console.log(`   Failed updates: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('   Errors:');
      result.errors.forEach(error => {
        console.log(`     - Product ${error.productId}: ${error.error}`);
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Bulk update failed');
    throw error;
  }
}

async function getStockAnalytics() {
  console.log('\n📈 Fetching stock analytics...');
  try {
    const analytics = await apiRequest('GET', '/products/stock/analytics');
    console.log('✅ Stock Analytics:');
    console.log(`   Total Products: ${analytics.totalProducts}`);
    console.log(`   Total Inventory: ${analytics.totalInventory}`);
    console.log(`   Low Stock Products: ${analytics.lowStockProducts}`);
    console.log(`   Out of Stock Products: ${analytics.outOfStockProducts}`);
    console.log(`   Average Inventory per Product: ${analytics.averageInventoryPerProduct}`);
    return analytics;
  } catch (error) {
    console.error('❌ Failed to fetch analytics');
    throw error;
  }
}

async function getStockMovements() {
  console.log('\n📋 Fetching recent stock movements...');
  try {
    const movements = await apiRequest('GET', '/products/stock/movements?limit=5');
    console.log(`✅ Found ${movements.length} recent movements:`);
    movements.forEach((movement, index) => {
      console.log(`   ${index + 1}. ${movement.productId.title}: ${movement.previousQuantity} → ${movement.newQuantity} (${movement.reason})`);
    });
    return movements;
  } catch (error) {
    console.error('❌ Failed to fetch stock movements');
    throw error;
  }
}

async function getNotifications() {
  console.log('\n🔔 Fetching notifications...');
  try {
    const notifications = await apiRequest('GET', '/notifications');
    console.log(`✅ Found ${notifications.length} notifications:`);
    notifications.slice(0, 3).forEach((notification, index) => {
      console.log(`   ${index + 1}. [${notification.type}] ${notification.title}`);
      console.log(`      ${notification.message}`);
    });
    return notifications;
  } catch (error) {
    console.error('❌ Failed to fetch notifications');
    throw error;
  }
}

// Main test execution
async function runInventoryTests() {
  try {
    console.log('🚀 Starting Inventory Management Tests\n');
    
    // 1. Login
    const user = await login();
    
    // 2. Get products
    const products = await getProducts();
    if (products.length === 0) {
      console.log('❌ No products found. Please create some products first.');
      return;
    }
    
    // Use the first product for testing
    testProductId = products[0]._id;
    console.log(`\n🎯 Using product: ${products[0].title} (ID: ${testProductId})`);
    
    // 3. Test individual inventory modification
    await testInventoryModification(testProductId, 2); // Low stock
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testInventoryModification(testProductId, 0); // Out of stock
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testInventoryModification(testProductId, 10); // Restock
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    // 4. Test threshold modification
    await testThresholdUpdate(testProductId, 8);
    
    // 5. Test bulk update (if we have multiple products)
    if (products.length > 1) {
      const bulkUpdates = products.slice(0, 2).map(product => ({
        productId: product._id,
        newQuantity: Math.floor(Math.random() * 20) + 5, // Random quantity 5-24
        reason: 'restock',
        notes: 'Bulk restock test'
      }));
      
      await testBulkInventoryUpdate(bulkUpdates);
    }
    
    // 6. Get analytics
    await getStockAnalytics();
    
    // 7. Get stock movements
    await getStockMovements();
    
    // 8. Get notifications
    await getNotifications();
    
    console.log('\n🎉 All inventory management tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the tests
if (require.main === module) {
  runInventoryTests().then(() => {
    console.log('\n✅ Test script completed');
    process.exit(0);
  }).catch(error => {
    console.error('\n❌ Test script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runInventoryTests,
  testInventoryModification,
  testThresholdUpdate,
  testBulkInventoryUpdate
};