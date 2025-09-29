import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { message } = router.query;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store JWT token and user info with consistent keys
      if (result.access_token) {
        localStorage.setItem('authToken', result.access_token);
      }
      if (result.user?.role) {
        localStorage.setItem('role', result.user.role);
      }
      localStorage.setItem('user', JSON.stringify(result.user || {}));

      // Redirect based on role
      if (result.user?.role === 'buyer') {
        router.push('/marketplace');
      } else if (result.user?.role === 'farmer') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-yellow-300/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-pink-200/20">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              🌾 AGRI-HOPE Login
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Access your agricultural marketplace account
            </p>
            {message && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {message}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing In...' : 'Sign In to AGRI-HOPE'}
              </button>
            </div>
            
            <div className="text-center">
              <a href="/auth/signup" className="text-pink-600 hover:text-pink-500 transition-colors">
                Don't have an account? Join AGRI-HOPE
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}