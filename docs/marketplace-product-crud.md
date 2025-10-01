# Marketplace & Product Management System

## Overview
Complete CRUD (Create, Read, Update, Delete) system for farmers to manage their own marketplaces and products.

## Backend API Endpoints

### Marketplaces

#### GET /api/marketplaces
- Get all active marketplaces
- Query params: `vendorId` (optional) - filter by vendor

#### GET /api/marketplaces/:slug
- Get marketplace by slug
- Query params: `include=products` - include products

#### GET /api/marketplaces/id/:id
- Get marketplace by ID

#### POST /api/marketplaces (Protected)
- Create new marketplace
- Requires JWT token
- Body:
  ```json
  {
    "name": "Farm Market",
    "description": "Fresh produce",
    "location": {
      "country": "USA",
      "city": "New York",
      "address": "123 Farm Road"
    },
    "categories": ["Vegetables", "Fruits"]
  }
  ```

#### PUT /api/marketplaces/:id (Protected)
- Update marketplace (owner only)
- Same body structure as POST

#### DELETE /api/marketplaces/:id (Protected)
- Delete marketplace (owner only)
- Cannot delete if marketplace has products

### Products

#### GET /api/products
- Get all active products
- Query params:
  - `category` - filter by category
  - `vendorId` - filter by vendor
  - `marketplaceId` - filter by marketplace

#### GET /api/products/:id
- Get product by ID

#### POST /api/products (Protected)
- Create new product
- Requires JWT token
- Body:
  ```json
  {
    "title": "Organic Tomatoes",
    "description": "Fresh from the farm",
    "price": 3.99,
    "category": "Vegetables",
    "marketplaceId": "marketplace_id_here",
    "inventory": 100,
    "unit": "kg"
  }
  ```

#### PUT /api/products/:id (Protected)
- Update product (owner only)
- Same body structure as POST

#### DELETE /api/products/:id (Protected)
- Delete product (owner only)

## Frontend Pages

### /vendor/marketplaces
- View all farmer's marketplaces
- Create new marketplace
- Edit existing marketplace
- Delete marketplace
- Navigate to products for each marketplace

### /vendor/marketplaces/[marketplaceId]/products
- View all products in a marketplace
- Add new products
- Edit existing products
- Delete products
- Display product details (price, inventory, category)

### /vendor/dashboard
- Updated with "My Marketplaces" quick action button
- Links to marketplace management

## Features

### Marketplace Management
- ✅ Create marketplace with name, description, location
- ✅ Auto-generate unique slug from name
- ✅ Assign categories (Vegetables, Fruits, Grains, etc.)
- ✅ Edit marketplace details
- ✅ Delete marketplace (only if no products)
- ✅ View product count per marketplace
- ✅ Ownership validation (farmers can only manage their own marketplaces)

### Product Management
- ✅ Add products to specific marketplace
- ✅ Set title, description, price, category
- ✅ Track inventory with units (kg, lb, piece, etc.)
- ✅ Edit product details
- ✅ Delete products
- ✅ Filter products by marketplace
- ✅ Display active/inactive status
- ✅ Ownership validation (farmers can only manage their own products)

## Security
- All create/update/delete operations protected with JWT authentication
- Ownership verification ensures farmers can only modify their own data
- Validation on all inputs (DTOs with class-validator)
- MongoDB ObjectId validation

## Database Schema Updates

### Marketplace Schema
```typescript
{
  name: string;
  slug: string; // auto-generated, unique
  description?: string;
  vendorId: ObjectId; // reference to User
  location?: {
    country?: string;
    city?: string;
    address?: string;
  };
  categories: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Schema
```typescript
{
  title: string;
  description: string;
  price: number;
  category: string;
  vendorId: ObjectId; // reference to User
  marketplaceId: ObjectId; // reference to Marketplace
  inventory: number;
  unit?: string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage Flow

1. **Farmer logs in** → Redirected to vendor dashboard
2. **Click "My Marketplaces"** → View all marketplaces
3. **Create Marketplace** → Fill form with name, location, categories
4. **Click "Manage Products"** on marketplace → View products
5. **Add Product** → Fill form with title, price, inventory, etc.
6. **Edit/Delete** products and marketplaces as needed

## Error Handling
- Invalid IDs: `400 Bad Request`
- Not found: `404 Not Found`
- Unauthorized: `403 Forbidden`
- Duplicate marketplace name: `400 Bad Request`
- Cannot delete marketplace with products: `400 Bad Request`

## Future Enhancements
- [ ] Image upload for marketplace banners/logos
- [ ] Image upload for product photos
- [ ] Bulk product import/export
- [ ] Product analytics (views, sales)
- [ ] Marketplace themes/customization
- [ ] Product inventory alerts
