require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      dbName: process.env.DATABASE_NAME || 'agrihope',
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Product schema
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  marketplaceId: mongoose.Schema.Types.ObjectId,
  vendorId: mongoose.Schema.Types.ObjectId,
  inventory: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const Product = mongoose.model('Product', productSchema);

// Update all products to have a specific vendorId
const updateProductVendors = async () => {
  try {
    await connectDB();
    
    // Get vendorId from command line argument or use a default
    const vendorId = process.argv[2];
    
    if (!vendorId) {
      console.error('Please provide a vendorId as an argument');
      console.log('Usage: node update-product-vendors.js <vendorId>');
      process.exit(1);
    }

    // Validate vendorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      console.error('Invalid vendorId format. Must be a valid MongoDB ObjectId');
      process.exit(1);
    }

    console.log(`Updating all products to vendorId: ${vendorId}`);
    
    // Update all products
    const result = await Product.updateMany(
      {},
      { $set: { vendorId: new mongoose.Types.ObjectId(vendorId) } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} products`);
    console.log(`Total products matched: ${result.matchedCount}`);
    
    // Show some updated products
    const products = await Product.find().limit(5);
    console.log('\nSample products:');
    products.forEach(p => {
      console.log(`- ${p.title} (vendorId: ${p.vendorId})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Update error:', error);
    process.exit(1);
  }
};

updateProductVendors();
