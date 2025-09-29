import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Eye, Edit2, Ban, CheckCircle, Calendar, Mail, Phone, MoreHorizontal, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { AdminUser, DataTableColumn, PaginationInfo, TableSort } from '@/types/admin';

// Mock data - replace with API calls
const mockUsers: AdminUser[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'buyer',
    status: 'active',
    registrationDate: new Date('2024-01-15'),
    lastLogin: new Date('2024-01-28'),
    totalOrders: 12,
    totalSpent: 1250.50
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'vendor',
    status: 'active',
    registrationDate: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-29'),
    totalOrders: 0,
    totalSpent: 0
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    role: 'buyer',
    status: 'suspended',
    registrationDate: new Date('2023-12-20'),
    lastLogin: new Date('2024-01-25'),
    totalOrders: 3,
    totalSpent: 450.25
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@example.com',
    role: 'vendor',
    status: 'inactive',
    registrationDate: new Date('2023-11-05'),
    lastLogin: new Date('2024-01-20'),
    totalOrders: 0,
    totalSpent: 0
  }
];

const UserManagement: NextPage = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: mockUsers.length,
    itemsPerPage: 10
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      vendor: 'bg-blue-100 text-blue-800 border-blue-200',
      buyer: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const handleUserAction = (action: string, user: AdminUser) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      case 'edit':
        // Implement edit functionality
        console.log('Edit user:', user.id);
        break;
      case 'suspend':
        // Implement suspend functionality
        console.log('Suspend user:', user.id);
        break;
      case 'activate':
        // Implement activate functionality
        console.log('Activate user:', user.id);
        break;
    }
  };

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: 'firstName',
      header: 'Name',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (role) => getRoleBadge(role)
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'registrationDate',
      header: 'Registration Date',
      sortable: true,
      render: (date) => (
        <div className="text-sm text-gray-900">
          {new Date(date).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      sortable: true,
      render: (date) => (
        <div className="text-sm text-gray-500">
          {date ? new Date(date).toLocaleDateString() : 'Never'}
        </div>
      )
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      sortable: true,
      render: (orders) => (
        <div className="text-sm font-medium text-gray-900">{orders || 0}</div>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleUserAction('view', user)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleUserAction('edit', user)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit User"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {user.status === 'active' ? (
            <button
              onClick={() => handleUserAction('suspend', user)}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Suspend User"
            >
              <Ban className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleUserAction('activate', user)}
              className="p-1 text-gray-400 hover:text-green-600"
              title="Activate User"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Search query:', query);
  };

  const handleSort = (sort: TableSort) => {
    // Implement sort functionality
    console.log('Sort:', sort);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage all registered users in the system</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200">
            Add New User
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUsers.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUsers.filter(u => u.role === 'vendor').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Buyers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUsers.filter(u => u.role === 'buyer').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
        />

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xl font-medium text-gray-600">
                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRoleBadge(selectedUser.role)}
                        {getStatusBadge(selectedUser.status)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Registered: {selectedUser.registrationDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Total Orders:</span>
                        <span className="ml-2 text-sm text-gray-600">{selectedUser.totalOrders || 0}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">Total Spent:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          ${selectedUser.totalSpent?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600">
                      Edit User
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

export default UserManagement;