import React, { useState } from 'react';
import { NextPage } from 'next';
import { 
  Eye, 
  Edit2, 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown,
  Store,
  Users,
  ShoppingBag,
  DollarSign,
  Calendar,
  MapPin
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { Marketplace, DataTableColumn, PaginationInfo, TableSort } from '@/types/admin';

// Mock data - replace with API calls
const mockMarketplaces: Marketplace[] = [
  {
    id: '1',
    name: 'Fresh Farm Produce',
    description: 'Organic vegetables and fruits marketplace',
    status: 'active',
    createdDate: new Date('2023-01-15'),
    productCount: 248,
    vendorCount: 23,
    totalSales: 125420.50,
    commission: 8.5
  },
  {
    id: '2',
    name: 'Grain & Cereals Hub',
    description: 'Wholesale grains and cereal products',
    status: 'active',
    createdDate: new Date('2023-03-20'),
    productCount: 156,
    vendorCount: 15,
    totalSales: 89340.75,
    commission: 6.0
  },
  {
    id: '3',
    name: 'Livestock Market',
    description: 'Cattle, poultry and dairy products',
    status: 'pending',
    createdDate: new Date('2024-01-10'),
    productCount: 89,
    vendorCount: 8,
    totalSales: 45230.25,
    commission: 10.0
  },
  {
    id: '4',
    name: 'Organic Seeds Corner',
    description: 'Premium organic seeds and planting materials',
    status: 'inactive',
    createdDate: new Date('2023-05-08'),
    productCount: 67,
    vendorCount: 5,
    totalSales: 23180.00,
    commission: 12.0
  }
];

const MarketplacesOverview: NextPage = () => {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>(mockMarketplaces);
  const [loading, setLoading] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | null>(null);
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: mockMarketplaces.length,
    itemsPerPage: 10
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleMarketplaceAction = (action: string, marketplace: Marketplace) => {
    switch (action) {
      case 'view':
        setSelectedMarketplace(marketplace);
        setShowMarketplaceModal(true);
        break;
      case 'edit':
        console.log('Edit marketplace:', marketplace.id);
        break;
      case 'activate':
        console.log('Activate marketplace:', marketplace.id);
        break;
      case 'deactivate':
        console.log('Deactivate marketplace:', marketplace.id);
        break;
    }
  };

  const columns: DataTableColumn<Marketplace>[] = [
    {
      key: 'name',
      header: 'Marketplace',
      sortable: true,
      render: (_, marketplace) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{marketplace.name}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{marketplace.description}</div>
          </div>
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
      key: 'productCount',
      header: 'Products',
      sortable: true,
      render: (count) => (
        <div className="flex items-center space-x-1">
          <ShoppingBag className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{count}</span>
        </div>
      )
    },
    {
      key: 'vendorCount',
      header: 'Vendors',
      sortable: true,
      render: (count) => (
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{count}</span>
        </div>
      )
    },
    {
      key: 'totalSales',
      header: 'Total Sales',
      sortable: true,
      render: (sales) => (
        <div className="text-sm font-semibold text-green-600">
          {formatCurrency(sales)}
        </div>
      )
    },
    {
      key: 'commission',
      header: 'Commission',
      sortable: true,
      render: (commission) => (
        <div className="text-sm text-gray-900">{commission}%</div>
      )
    },
    {
      key: 'createdDate',
      header: 'Created',
      sortable: true,
      render: (date) => (
        <div className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, marketplace) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleMarketplaceAction('view', marketplace)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMarketplaceAction('edit', marketplace)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit Marketplace"
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
  const totalSales = marketplaces.reduce((sum, m) => sum + m.totalSales, 0);
  const totalProducts = marketplaces.reduce((sum, m) => sum + m.productCount, 0);
  const totalVendors = marketplaces.reduce((sum, m) => sum + m.vendorCount, 0);
  const activeMarketplaces = marketplaces.filter(m => m.status === 'active').length;

  return (
    <AdminLayout currentPage="marketplaces">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketplaces Overview</h1>
            <p className="text-gray-600">Monitor and manage all marketplaces on the platform</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200">
            Create New Marketplace
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Marketplaces</p>
                <p className="text-2xl font-bold text-gray-900">{marketplaces.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+2.5% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Marketplaces</p>
                <p className="text-2xl font-bold text-gray-900">{activeMarketplaces}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+1.2% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+8.1% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+15.3% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={marketplaces}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
        />

        {/* Marketplace Details Modal */}
        {showMarketplaceModal && selectedMarketplace && (
          <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Marketplace Details</h3>
                  <button
                    onClick={() => setShowMarketplaceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center">
                      <Store className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedMarketplace.name}
                      </h4>
                      <p className="text-gray-600 mt-1">{selectedMarketplace.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(selectedMarketplace.status)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Statistics</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Products</span>
                          </div>
                          <span className="font-medium">{selectedMarketplace.productCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Vendors</span>
                          </div>
                          <span className="font-medium">{selectedMarketplace.vendorCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Total Sales</span>
                          </div>
                          <span className="font-medium text-green-600">
                            {formatCurrency(selectedMarketplace.totalSales)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Details</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Commission Rate</span>
                          <span className="font-medium">{selectedMarketplace.commission}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Created</span>
                          </div>
                          <span className="font-medium">
                            {selectedMarketplace.createdDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setShowMarketplaceModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600">
                      Edit Marketplace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MarketplacesOverview;