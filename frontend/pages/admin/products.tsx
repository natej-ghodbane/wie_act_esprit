import React, { useState } from 'react';
import { NextPage } from 'next';
import { 
  Eye, 
  Edit2, 
  MoreHorizontal, 
  ShoppingBag,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { AdminProduct, DataTableColumn, PaginationInfo, TableSort } from '@/types/admin';

// Mock data - replace with API calls
const mockProducts: AdminProduct[] = [
  {
    id: '1',
    title: 'Organic Tomatoes',
    sku: 'FARM-001',
    price: 4.50,
    stock: 150,
    category: 'Vegetables',
    marketplace: 'Fresh Farm Produce',
    vendor: 'Green Valley Farms',
    status: 'active',
    createdDate: new Date('2024-01-15'),
    images: ['/api/placeholder/150/150']
  },
  {
    id: '2',
    title: 'Premium Wheat Seeds',
    sku: 'SEED-204',
    price: 12.99,
    stock: 45,
    category: 'Seeds',
    marketplace: 'Organic Seeds Corner',
    vendor: 'Premium Seeds Co.',
    status: 'active',
    createdDate: new Date('2024-01-12'),
    images: ['/api/placeholder/150/150']
  },
  {
    id: '3',
    title: 'Free Range Chicken',
    sku: 'LIVE-087',
    price: 25.00,
    stock: 0,
    category: 'Livestock',
    marketplace: 'Livestock Market',
    vendor: 'Happy Farm',
    status: 'out_of_stock',
    createdDate: new Date('2024-01-10'),
    images: ['/api/placeholder/150/150']
  },
  {
    id: '4',
    title: 'Basmati Rice (25kg)',
    sku: 'GRAIN-156',
    price: 89.50,
    stock: 200,
    category: 'Grains',
    marketplace: 'Grain & Cereals Hub',
    vendor: 'Rice Masters',
    status: 'active',
    createdDate: new Date('2024-01-08'),
    images: ['/api/placeholder/150/150']
  },
  {
    id: '5',
    title: 'Corn Silage (1 ton)',
    sku: 'FEED-089',
    price: 180.00,
    stock: 8,
    category: 'Animal Feed',
    marketplace: 'Livestock Market',
    vendor: 'Feed Solutions Ltd',
    status: 'inactive',
    createdDate: new Date('2024-01-05'),
    images: ['/api/placeholder/150/150']
  }
];

const ProductManagement: NextPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    marketplace: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: mockProducts.length,
    itemsPerPage: 10
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      out_of_stock: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      active: 'Active',
      inactive: 'Inactive', 
      out_of_stock: 'Out of Stock'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    } else if (stock < 20) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleProductAction = (action: string, product: AdminProduct) => {
    switch (action) {
      case 'view':
        setSelectedProduct(product);
        setShowProductModal(true);
        break;
      case 'edit':
        console.log('Edit product:', product.id);
        break;
      case 'activate':
        console.log('Activate product:', product.id);
        break;
      case 'deactivate':
        console.log('Deactivate product:', product.id);
        break;
    }
  };

  const columns: DataTableColumn<AdminProduct>[] = [
    {
      key: 'title',
      header: 'Product',
      sortable: true,
      render: (_, product) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{product.title}</div>
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (category) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          {category}
        </span>
      )
    },
    {
      key: 'marketplace',
      header: 'Marketplace',
      sortable: true,
      render: (marketplace) => (
        <div className="text-sm text-gray-900 truncate max-w-32" title={marketplace}>
          {marketplace}
        </div>
      )
    },
    {
      key: 'vendor',
      header: 'Vendor',
      sortable: true,
      render: (vendor) => (
        <div className="text-sm text-gray-600 truncate max-w-32" title={vendor}>
          {vendor}
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (price) => (
        <div className="text-sm font-semibold text-gray-900">
          {formatCurrency(price)}
        </div>
      )
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (stock) => (
        <div className="flex items-center space-x-2">
          {getStockStatus(stock)}
          <span className="text-sm font-medium text-gray-900">{stock}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, product) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleProductAction('view', product)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleProductAction('edit', product)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-gray-600"
            title="More Actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleSort = (sort: TableSort) => {
    console.log('Sort:', sort);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 20).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Get unique values for filters
  const categories = [...new Set(products.map(p => p.category))];
  const marketplaces = [...new Set(products.map(p => p.marketplace))];

  return (
    <AdminLayout currentPage="products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Monitor and manage all products across marketplaces</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200">
              Add New Product
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{outOfStock}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStock}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalValue).replace(/\.\d+/, '')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace</label>
                <select 
                  value={filters.marketplace}
                  onChange={(e) => setFilters(prev => ({ ...prev, marketplace: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">All Marketplaces</option>
                  {marketplaces.map(marketplace => (
                    <option key={marketplace} value={marketplace}>{marketplace}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input 
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="$0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input 
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="$999"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setFilters({ category: '', marketplace: '', status: '', minPrice: '', maxPrice: '' })}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          data={products}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
        />

        {/* Product Details Modal */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                      {selectedProduct.images[0] ? (
                        <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Category:</span>
                        <span className="ml-2 text-sm text-gray-600">{selectedProduct.category}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">SKU:</span>
                        <span className="ml-2 text-sm text-gray-600">{selectedProduct.sku}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">Created:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          {selectedProduct.createdDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">
                      {selectedProduct.title}
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(selectedProduct.status)}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-3">Pricing & Stock</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Price</span>
                            <span className="text-lg font-semibold text-gray-900">
                              {formatCurrency(selectedProduct.price)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Stock</span>
                            <div className="flex items-center space-x-2">
                              {getStockStatus(selectedProduct.stock)}
                              <span className="font-medium">{selectedProduct.stock}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Value</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(selectedProduct.price * selectedProduct.stock)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-3">Marketplace Info</h5>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Marketplace:</span>
                            <span className="ml-2 text-sm text-gray-600">{selectedProduct.marketplace}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Vendor:</span>
                            <span className="ml-2 text-sm text-gray-600">{selectedProduct.vendor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600">
                    Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;