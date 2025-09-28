import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  farmLocation?: string;
}

interface UserProfileDropdownProps {
  user: User;
}

export default function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getProfileImageUrl = (profileImage?: string) => {
    console.log('Profile image from user data:', profileImage); // Debug log
    if (!profileImage) return null;
    // If it's already a full URL, return as is
    if (profileImage.startsWith('http')) return profileImage;
    // Otherwise, construct the URL with the backend base URL
    return `http://localhost:3001${profileImage}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
      >
        {/* Profile Image or Initials */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-white/20">
          {user.profileImage ? (
            <img 
              src={getProfileImageUrl(user.profileImage) || ''}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = getInitials(user.firstName, user.lastName);
                }
              }}
            />
          ) : (
            getInitials(user.firstName, user.lastName)
          )}
        </div>
        
        {/* User Name and Role */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-800">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-600 capitalize">
            {user.role === 'farmer' ? 'Vendor' : user.role}
          </p>
        </div>

        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white/20">
                {user.profileImage ? (
                  <img 
                    src={getProfileImageUrl(user.profileImage) || ''}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = getInitials(user.firstName, user.lastName);
                      }
                    }}
                  />
                ) : (
                  getInitials(user.firstName, user.lastName)
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.farmLocation && (
                  <p className="text-xs text-gray-500">📍 {user.farmLocation}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile Settings */}
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to profile settings
              }}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Profile Settings</p>
                <p className="text-xs text-gray-500">Update your profile information</p>
              </div>
            </button>

            {/* Account Settings */}
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to account settings
              }}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Account Settings</p>
                <p className="text-xs text-gray-500">Privacy, security & preferences</p>
              </div>
            </button>

            {/* Dashboard specific options */}
            {user.role === 'farmer' && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Navigate to product management
                }}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add Product</p>
                  <p className="text-xs text-gray-500">List new agricultural products</p>
                </div>
              </button>
            )}

            {user.role === 'buyer' && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Navigate to order history
                }}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order History</p>
                  <p className="text-xs text-gray-500">View your past purchases</p>
                </div>
              </button>
            )}

            {/* Help & Support */}
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to help
              }}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Help & Support</p>
                <p className="text-xs text-gray-500">Get help with your account</p>
              </div>
            </button>

            <hr className="my-2 border-gray-100" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 text-red-600"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Log Out</p>
                <p className="text-xs text-red-500">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}