import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; firstName: string; lastName: string; role: string }) =>
    apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.put('/users/profile', data),
};

export const productAPI = {
  getAll: (params?: any) => apiClient.get('/products', { params }),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),

  // Stock Management
  adjustStock: (id: string, data: { newQuantity: number; reason: string; notes?: string }) =>
    apiClient.put(`/products/${id}/stock`, data),
  bulkUpdateStock: (data: { updates: any[] }) =>
    apiClient.post('/products/stock/bulk-update', data),
  getStockMovements: (params?: any) =>
    apiClient.get('/products/stock/movements', { params }),
  updateThreshold: (id: string, data: { threshold: number }) =>
    apiClient.put(`/products/${id}/threshold`, data),
  getLowStockProducts: () =>
    apiClient.get('/products/stock/low'),
  getStockAnalytics: () =>
    apiClient.get('/products/stock/analytics'),
};

export const orderAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  create: (data: any) => apiClient.post('/orders', data),
  updateStatus: (id: string, status: string) => apiClient.put(`/orders/${id}/status`, { status }),
};

export const marketplaceAPI = {
  getAll: () => apiClient.get('/marketplaces'),
  getBySlug: (slug: string, include?: 'products') =>
    apiClient.get(`/marketplaces/${slug}`, { params: include ? { include } : undefined }),
};

export const paymentsAPI = {
  createCheckout: (payload: {
    items: { id: string; name: string; price: number; quantity: number }[];
    successUrl?: string;
    cancelUrl?: string;
    customerEmail?: string;
  }) => apiClient.post('/payments/checkout', payload),
};

export const notificationsAPI = {
  getAll: (params?: any) => apiClient.get('/notifications', { params }),
  getUnreadCount: () => apiClient.get('/notifications/count/unread'),
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
};

export default apiClient;
