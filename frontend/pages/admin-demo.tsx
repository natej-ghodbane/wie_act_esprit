import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingBag, 
  MessageSquare,
  ArrowRight,
  Star,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';

const AdminDemo: NextPage = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Dashboard Overview',
      description: 'Comprehensive dashboard with real-time statistics, recent activities, and quick actions',
      href: '/admin',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Complete user management system with search, filtering, and detailed user profiles',
      href: '/admin/users',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Store,
      title: 'Marketplace Overview',
      description: 'Monitor and manage all marketplaces with detailed analytics and performance metrics',
      href: '/admin/marketplaces',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: ShoppingBag,
      title: 'Product Management',
      description: 'Advanced product management with filtering, stock tracking, and inventory control',
      href: '/admin/products',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MessageSquare,
      title: 'User Reclamations',
      description: 'Comprehensive support ticket system for managing customer complaints and requests',
      href: '/admin/reclamations',
      color: 'from-red-500 to-red-600'
    }
  ];

  const highlights = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built with security best practices and robust error handling'
    },
    {
      icon: Zap,
      title: 'Fast & Responsive',
      description: 'Optimized for performance with responsive design across all devices'
    },
    {
      icon: CheckCircle,
      title: 'Production Ready',
      description: 'Complete with TypeScript, proper types, and modular architecture'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <span className="text-white text-lg font-bold">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  AGRI-HOPE Admin Dashboard
                </h1>
                <p className="text-gray-600">Complete admin management system</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-600">Demo Version</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Modern Admin Dashboard for Agricultural Marketplace
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive back-office solution featuring user management, marketplace oversight, 
              product control, and customer support systems - all built with modern React and TypeScript.
            </p>
          </div>

          {/* Quick Access Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/admin">
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg">
                <LayoutDashboard className="w-5 h-5" />
                <span>View Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/admin/users">
              <button className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200">
                <Users className="w-5 h-5" />
                <span>Manage Users</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Dashboard Modules</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} href={feature.href}>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Built for Excellence</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-pink-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h4>
                  <p className="text-gray-600">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical Features</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built with modern technologies and best practices for scalability and maintainability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">React & TypeScript</h4>
              <p className="text-sm text-gray-600">Modern React with full TypeScript support for type safety</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Tailwind CSS</h4>
              <p className="text-sm text-gray-600">Utility-first CSS framework for rapid UI development</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Responsive Design</h4>
              <p className="text-sm text-gray-600">Mobile-first approach with perfect mobile compatibility</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Modular Components</h4>
              <p className="text-sm text-gray-600">Reusable components with consistent design patterns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Components Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Key Components</h3>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Core Components</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">AdminLayout - Responsive sidebar navigation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">DataTable - Advanced table with sorting & pagination</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Statistics Cards - Interactive dashboard widgets</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Modal Components - User-friendly detail views</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Search & Filter functionality</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Real-time data updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Batch operations support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Export and reporting capabilities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to explore the admin dashboard?
          </h3>
          <p className="text-pink-100 mb-8 text-lg">
            Navigate through all modules and experience the complete admin management system
          </p>
          <Link href="/admin">
            <button className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-pink-600 rounded-lg hover:bg-pink-50 transition-all duration-200 font-semibold shadow-lg">
              <LayoutDashboard className="w-5 h-5" />
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 AGRI-HOPE Marketplace Admin Dashboard. Built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDemo;