import { ReclamationFormData, ReclamationFormErrors, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../types/reclamation';

export const validateReclamationForm = (formData: ReclamationFormData): ReclamationFormErrors => {
  const errors: ReclamationFormErrors = {};

  // Validate reclamation type
  if (!formData.type) {
    errors.type = 'Please select a reclamation type';
  }

  // Validate subject
  if (!formData.subject.trim()) {
    errors.subject = 'Subject is required';
  } else if (formData.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters long';
  } else if (formData.subject.trim().length > 200) {
    errors.subject = 'Subject must not exceed 200 characters';
  }

  // Validate description
  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters long';
  } else if (formData.description.trim().length > 2000) {
    errors.description = 'Description must not exceed 2000 characters';
  }

  // Validate priority
  if (!formData.priority) {
    errors.priority = 'Please select a priority level';
  }

  // Validate contact email
  if (!formData.contactEmail.trim()) {
    errors.contactEmail = 'Contact email is required';
  } else if (!isValidEmail(formData.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address';
  }

  // Validate contact phone
  if (!formData.contactPhone.trim()) {
    errors.contactPhone = 'Contact phone is required';
  } else if (!isValidPhone(formData.contactPhone)) {
    errors.contactPhone = 'Please enter a valid phone number';
  }

  // Validate order reference
  if (!formData.orderReference.trim()) {
    errors.orderReference = 'Order reference is required';
  } else if (formData.orderReference.trim().length < 3) {
    errors.orderReference = 'Order reference must be at least 3 characters long';
  }

  // Validate files
  if (formData.files.length > 0) {
    const fileErrors = validateFiles(formData.files);
    if (fileErrors.length > 0) {
      errors.files = fileErrors.join(', ');
    }
  }

  return errors;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 8;
};

export const validateFiles = (files: File[]): string[] => {
  const errors: string[] = [];

  if (files.length > 5) {
    errors.push('Maximum 5 files allowed');
  }

  files.forEach((file, index) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File ${index + 1} exceeds maximum size of 10MB`);
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      errors.push(`File ${index + 1} has unsupported format`);
    }
  });

  return errors;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isFormValid = (errors: ReclamationFormErrors): boolean => {
  return Object.keys(errors).length === 0;
};