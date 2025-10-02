require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace';
    await mongoose.connect(uri, {
      dbName: process.env.DATABASE_NAME || 'agrihope',
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const marketplaceSchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

const getMarketplaceId = async () => {
  try {
    await connectDB();
    
    const marketplace = await Marketplace.findOne();
    
    if (marketplace) {
      console.log('\n✅ Found marketplace:');
      console.log(`Name: ${marketplace.name}`);
      console.log(`ID: ${marketplace._id}`);
      console.log(`\nUse this ID when adding products: ${marketplace._id}`);
    } else {
      console.log('No marketplaces found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

getMarketplaceId();
