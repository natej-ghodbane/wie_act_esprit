// Admin Dashboard Types
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'vendor' | 'buyer';
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: Date;
  lastLogin?: Date;
  totalOrders?: number;
  totalSpent?: number;
}

export interface Marketplace {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  createdDate: Date;
  productCount: number;
  vendorCount: number;
  totalSales: number;
  commission: number;
}

export interface AdminProduct {
  id: string;
  title: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  marketplace: string;
  vendor: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdDate: Date;
  images: string[];
}

export interface Reclamation {
  id: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  subject: string;
  type: 'complaint' | 'return' | 'refund' | 'damage_report' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  description: string;
  response?: string;
  submittedDate: Date;
  resolvedDate?: Date;
  assignedTo?: string;
  orderReference?: string;
  attachments: string[];
}

// Filter and Sort Types
export interface TableFilter {
  field: string;
  value: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
}

export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Dashboard Statistics
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalMarketplaces: number;
  totalProducts: number;
  totalReclamations: number;
  openReclamations: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
}

// Component Props
export interface DataTableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSort?: (sort: TableSort) => void;
  onFilter?: (filters: TableFilter[]) => void;
  searchable?: boolean;
  onSearch?: (query: string) => void;
}