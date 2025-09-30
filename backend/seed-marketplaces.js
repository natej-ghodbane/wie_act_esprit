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

// Marketplace schema (simplified for seeding)
const marketplaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  location: {
    country: String,
    city: String,
    address: String,
    coords: { lat: Number, lng: Number }
  },
  bannerImage: String,
  logoImage: String,
  categories: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

// Sample marketplaces
const sampleMarketplaces = [
  {
    name: "Central Farmers Market",
    slug: "central-farmers-market",
    description: "Fresh local produce and artisanal goods in the heart of the city",
    location: {
      country: "TN",
      city: "Tunis",
      address: "Avenue Habib Bourguiba",
      coords: { lat: 36.8065, lng: 10.1815 }
    },
    bannerImage: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop",
    logoImage: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&h=200&fit=crop",
    categories: ["vegetables", "fruits", "dairy", "grains"]
  },
  {
    name: "North Valley Market",
    slug: "north-valley-market",
    description: "Seasonal produce from valley farms",
    location: {
      country: "TN",
      city: "Ariana",
      address: "Rue de l'Innovation",
      coords: { lat: 36.8665, lng: 10.1647 }
    },
    bannerImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    logoImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    categories: ["vegetables", "fruits", "herbs"]
  },
  {
    name: "Coastal Organics",
    slug: "coastal-organics",
    description: "Organic produce from coastal farms",
    location: {
      country: "TN",
      city: "Sfax",
      address: "Port de Sfax",
      coords: { lat: 34.7406, lng: 10.7603 }
    },
    bannerImage: "https://images.unsplash.com/photo-1506905925346-14b5e4b1e6c0?w=800&h=400&fit=crop",
    logoImage: "https://images.unsplash.com/photo-1506905925346-14b5e4b1e6c0?w=200&h=200&fit=crop",
    categories: ["seafood", "fruits", "herbs"]
  }
];

// Seed function
const seedMarketplaces = async () => {
  try {
    await connectDB();
    
    // Clear existing marketplaces
    await Marketplace.deleteMany({});
    console.log('Cleared existing marketplaces');
    
    // Insert sample marketplaces
    const inserted = await Marketplace.insertMany(sampleMarketplaces);
    console.log(`Inserted ${inserted.length} marketplaces:`);
    inserted.forEach(m => console.log(`- ${m.name} (${m.slug})`));
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedMarketplaces();
}

module.exports = { seedMarketplaces };
