import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  MessageSquare,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Activity,
  BarChart3
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { DashboardStats } from '@/types/admin';

// Mock data - replace with API calls
const mockStats: DashboardStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalMarketplaces: 12,
  totalProducts: 3456,
  totalReclamations: 89,
  openReclamations: 23,
  monthlyRevenue: 145230.50,
  monthlyGrowth: 12.5
};

const recentActivities = [
  {
    id: '1',
    type: 'user_registered',
    message: 'New user John Doe registered as buyer',
    timestamp: new Date('2024-01-29T10:30:00'),
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: '2',
    type: 'product_added',
    message: 'New product "Organic Carrots" added to Fresh Farm Produce',
    timestamp: new Date('2024-01-29T09:15:00'),
    icon: ShoppingBag,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: '3',
    type: 'reclamation_submitted',
    message: 'High priority complaint submitted by Sarah Wilson',
    timestamp: new Date('2024-01-29T08:45:00'),
    icon: AlertCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    id: '4',
    type: 'marketplace_approved',
    message: 'Livestock Market has been approved and activated',
    timestamp: new Date('2024-01-29T07:20:00'),
    icon: Store,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
];

const quickStats = [
  {
    name: 'New Users Today',
    value: '24',
    change: '+12%',
    changeType: 'positive'
  },
  {
    name: 'Orders Today',
    value: '156',
    change: '+8%',
    changeType: 'positive'
  },
  {
    name: 'Revenue Today',
    value: '$4,230',
    change: '+15%',
    changeType: 'positive'
  },
  {
    name: 'Support Response Time',
    value: '2.3h',
    change: '-18%',
    changeType: 'positive'
  }
];

const AdminDashboard: NextPage = () => {
  const [stats] = useState<DashboardStats>(mockStats);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/users">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">
                      {stats.activeUsers} active users
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                View all users
              </div>
            </div>
          </Link>
          
          <Link href="/admin/marketplaces">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Marketplaces</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMarketplaces}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">All active</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Manage marketplaces
              </div>
            </div>
          </Link>

          <Link href="/admin/products">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+124 this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                View all products
              </div>
            </div>
          </Link>

          <Link href="/admin/reclamations">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReclamations}</p>
                  <div className="flex items-center mt-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600">
                      {stats.openReclamations} need attention
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <MessageSquare className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Manage support
              </div>
            </div>
          </Link>
        </div>

        {/* Revenue and Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <div className="flex items-center space-x-2">
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stats.monthlyGrowth > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stats.monthlyGrowth > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(stats.monthlyGrowth)}%
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
                <p className="text-sm text-gray-600">This month's total revenue</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Highlights</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat) => (
                <div key={stat.name} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 truncate" title={stat.name}>{stat.name}</p>
                  <div className={`text-xs mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                View all activity
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`${activity.iconBg} h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}>
                            <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">{activity.message}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {getTimeAgo(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Add New User</p>
                <p className="text-sm text-gray-600">Create admin or customer account</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Store className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">New Marketplace</p>
                <p className="text-sm text-gray-600">Set up a new marketplace</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Generate Report</p>
                <p className="text-sm text-gray-600">Create analytics report</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;