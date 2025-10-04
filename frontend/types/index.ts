// Component prop types for KOFTI Marketplace

import { LucideIcon } from 'lucide-react';

// Navbar types
export interface NavItem {
  href: string;
  label: string;
}

// Home page component types
export interface TechStackProps {
  tech: string;
}

export interface CTAButtonProps {
  href: string;
  text: string;
  icon: LucideIcon;
}

export interface SocialLinkProps {
  icon: LucideIcon;
  link: string;
}

// About page component types
export interface StatCardProps {
  icon: LucideIcon;
  color: string;
  value: string;
  label: string;
  description: string;
  animation: string;
}

// Welcome Screen types
export interface TypewriterEffectProps {
  text: string;
}

export interface IconButtonProps {
  Icon: LucideIcon;
}

export interface WelcomeScreenProps {
  onLoadingComplete?: () => void;
}

// Background component types
export interface BlobPosition {
  x: number;
  y: number;
}

// User types for marketplace
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'vendor' | 'buyer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product types for marketplace
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  vendorId: string;
  inventory: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order types for marketplace
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  buyerId: string;
  vendorId: string;
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}