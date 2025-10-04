import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

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
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { message } = router.query;

  useEffect(() => {
    // Check for system dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

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
      console.log('Login response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store JWT token and user info with consistent keys
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('authToken', result.access_token);
        console.log('Token stored:', result.access_token);
      }
      if (result.user?.role) {
        localStorage.setItem('role', result.user.role);
        console.log('User role:', result.user.role);
      }
      localStorage.setItem('user', JSON.stringify(result.user || {}));

      // Redirect based on role
      if (result.user?.role === 'buyer') {
        console.log('Redirecting to buyer dashboard');
        router.push('/buyer/dashboard');
      } else if (result.user?.role === 'farmer') {
        console.log('Redirecting to vendor dashboard');
        router.push('/vendor/dashboard');
      } else {
        console.log('Redirecting to home');
        router.push('/');
      }

    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <Head>
        <title>Sign In - KOFTI | Agricultural Marketplace</title>
        <meta name="description" content="Sign in to your KOFTI account and access the premier agricultural marketplace." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`min-h-screen transition-all duration-700 ${isDarkMode ? 'dark' : ''}`}>
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                x: [0, -120, 0],
                y: [0, 80, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-fuchsia-300/20 to-pink-300/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                x: [0, 60, 0],
                y: [0, -60, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-300/20 to-fuchsia-300/20 rounded-full blur-lg"
            />
          </div>

          {/* Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(88,28,135,0.2),transparent_50%)]" />
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="fixed top-6 right-6 z-50 p-3 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-full border border-white/20 dark:border-gray-700/20 shadow-lg"
          aria-label="Toggle dark mode"
        >
          <motion.div
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {isDarkMode ? (
              <div className="w-6 h-6 bg-yellow-300 rounded-full shadow-lg" />
            ) : (
              <div className="w-6 h-6 bg-gray-700 rounded-full shadow-lg" />
            )}
          </motion.div>
        </motion.button>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Glassmorphism Container */}
            <div className="relative">
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />
              
              <div className="relative bg-white/20 dark:bg-gray-900/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block mb-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 dark:from-purple-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Sign in to your KOFTI account
                  </p>
                </motion.div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      className="mb-6 p-4 bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{message}</span>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-2xl"
                    >
                      <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'email' 
                            ? 'text-emerald-500' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'password' 
                            ? 'text-purple-500' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-12 pr-14 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-500 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Forgot Password */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-right"
                  >
                    <a
                      href="#"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-pink-500 transition-colors duration-200 font-medium"
                    >
                      Forgot your password?
                    </a>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5" />
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                          </>
                        )}
                      </div>

                      {/* Button Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                    </motion.button>
                  </motion.div>

                  {/* Sign Up Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="text-center pt-6 border-t border-white/10 dark:border-gray-700/10"
                  >
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Don't have an account?{' '}
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href="/auth/signup"
                        className="text-purple-600 dark:text-purple-400 hover:text-pink-500 font-semibold transition-colors duration-200"
                      >
                        Join KOFTI →
                      </motion.a>
                    </p>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}