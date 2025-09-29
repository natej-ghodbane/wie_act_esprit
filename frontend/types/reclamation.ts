export interface ReclamationFormData {
  type: ReclamationType;
  subject: string;
  description: string;
  priority: PriorityLevel;
  files: File[];
  contactEmail: string;
  contactPhone: string;
  orderReference: string;
  productReference?: string;
}

export type ReclamationType = 
  | 'complaint' 
  | 'return' 
  | 'refund' 
  | 'damage_report' 
  | 'other';

export type PriorityLevel = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'urgent';

export interface ReclamationFormErrors {
  type?: string;
  subject?: string;
  description?: string;
  priority?: string;
  contactEmail?: string;
  contactPhone?: string;
  orderReference?: string;
  files?: string;
  general?: string;
}

export interface ReclamationSubmissionResponse {
  success: boolean;
  reclamationId?: string;
  message: string;
  errors?: ReclamationFormErrors;
}

export const RECLAMATION_TYPES: { value: ReclamationType; label: string }[] = [
  { value: 'complaint', label: 'Complaint' },
  { value: 'return', label: 'Return Request' },
  { value: 'refund', label: 'Refund Request' },
  { value: 'damage_report', label: 'Damage Report' },
  { value: 'other', label: 'Other' },
];

export const PRIORITY_LEVELS: { value: PriorityLevel; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];