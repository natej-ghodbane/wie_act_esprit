/**
 * Auth utility functions for handling user authentication and roles
 */

/**
 * Get user role from localStorage or decode from JWT token
 * @returns {string | null} The user role or null if not found
 */
export const getRoleFromStorageOrToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // First try to get role from localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      return storedRole;
    }
    
    // If no stored role, try to decode from JWT token
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simple JWT decode (without verification - for client-side display only)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting role from storage or token:', error);
    return null;
  }
};

/**
 * Check if the current user has buyer role
 * @returns {boolean} True if user is a buyer
 */
export const isBuyerRole = (): boolean => {
  const role = getRoleFromStorageOrToken();
  return role?.toLowerCase() === 'buyer';
};

/**
 * Check if the current user has vendor role
 * @returns {boolean} True if user is a vendor
 */
export const isVendorRole = (): boolean => {
  const role = getRoleFromStorageOrToken();
  return role?.toLowerCase() === 'vendor';
};

/**
 * Check if the current user has admin role
 * @returns {boolean} True if user is an admin
 */
export const isAdminRole = (): boolean => {
  const role = getRoleFromStorageOrToken();
  return role?.toLowerCase() === 'admin';
};

/**
 * Get current user data from localStorage
 * @returns {object | null} User object or null if not found
 */
export const getCurrentUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('authToken');
  const user = getCurrentUser();
  
  return !!(token && user);
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

/**
 * Set authentication data
 * @param {string} token - JWT token
 * @param {object} user - User object
 * @param {string} role - User role
 */
export const setAuth = (token: string, user: any, role?: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  if (role) {
    localStorage.setItem('role', role);
  }
};