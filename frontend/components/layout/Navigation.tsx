'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Heart, 
  Sun, 
  Moon,
  Leaf,
  LogIn,
  UserPlus
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import PaymentModal from '@/components/marketplace/PaymentModal'
import { useCart } from '@/components/CartProvider'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { items, total, count, clearCart } = useCart()
  const [isPaymentOpen, setPaymentOpen] = useState(false)
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, you'd persist this to localStorage and update the HTML class
    document.documentElement.classList.toggle('dark')
  }

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace', icon: null },
    { href: '/products', label: 'Products', icon: null },
    { href: '/farmers', label: 'Farmers', icon: null },
    { href: '/about', label: 'About', icon: null },
  ]

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'glass-strong shadow-glass-lg backdrop-blur-xl' 
          : 'bg-transparent',
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-gradient">
                AgriHope
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={link.href}>
                  <Button
                    variant="ghost"
                    className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Button>
                </Link>
              </motion.div>
            ))}\n          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                placeholder="Search products, farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                variant="glass"
                className="bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-500"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hidden lg:flex text-neutral-700 dark:text-neutral-300"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-neutral-700 dark:text-neutral-300 relative"
            >
              <Heart className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-700 dark:text-neutral-300 relative"
              onClick={() => setPaymentOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {count}
                </motion.span>
              )}
            </Button>
            <PaymentModal isOpen={isPaymentOpen} onClose={() => setPaymentOpen(false)} total={total} items={items} onSuccess={clearCart} />

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" leftIcon={<LogIn className="w-4 h-4" />}>
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="default" leftIcon={<UserPlus className="w-4 h-4" />}>
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-neutral-700 dark:text-neutral-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 glass-strong border-t border-white/10 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Input
                    placeholder="Search products, farmers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                    variant="glass"
                    className="bg-white/10 dark:bg-black/10"
                  />
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={link.href} onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          fullWidth
                          className="justify-start text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          {link.label}
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDarkMode}
                    leftIcon={isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  >
                    {isDarkMode ? 'Light' : 'Dark'} Mode
                  </Button>
                  <div className="flex space-x-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button variant="default" size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
