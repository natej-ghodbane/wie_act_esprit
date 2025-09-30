const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace', {
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
  marketplaceId: String,
  vendorId: String,
  inventory: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const Product = mongoose.model('Product', productSchema);

// Marketplace schema
const marketplaceSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  location: Object,
  bannerImage: String,
  logoImage: String,
  categories: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

// Seed products
const seedProducts = async () => {
  try {
    await connectDB();
    
    // First, get a marketplace ID
    const marketplace = await Marketplace.findOne({ slug: 'central-farmers-market' });
    if (!marketplace) {
      console.log('No marketplace found. Please create marketplaces first.');
      process.exit(1);
    }
    
    console.log('Found marketplace:', marketplace.name, 'ID:', marketplace._id);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Sample products
    const sampleProducts = [
      {
        title: "Organic Tomatoes",
        description: "Fresh, locally grown organic tomatoes from our farm",
        price: 4.99,
        category: "vegetables",
        images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop"],
        marketplaceId: String(marketplace._id),
        vendorId: "vendor-123",
        inventory: 50,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Fresh Strawberries",
        description: "Sweet and juicy strawberries from local farms",
        price: 8.99,
        category: "fruits",
        images: ["https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=400&h=300&fit=crop"],
        marketplaceId: String(marketplace._id),
        vendorId: "vendor-456",
        inventory: 30,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Farm Fresh Eggs",
        description: "Free-range eggs from happy chickens",
        price: 6.49,
        category: "dairy",
        images: ["https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400&h=300&fit=crop"],
        marketplaceId: String(marketplace._id),
        vendorId: "vendor-789",
        inventory: 24,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${inserted.length} products for marketplace: ${marketplace.name}`);
    
    // Show the products
    const products = await Product.find({ marketplaceId: String(marketplace._id) });
    console.log('Products in marketplace:');
    products.forEach(p => console.log(`- ${p.title} ($${p.price})`));
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();
