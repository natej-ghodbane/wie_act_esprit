import React from 'react';
import { FormField } from './ReclamationSteps';

interface Step3Props {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    orderNumber: string;
  };
  setContactInfo: (info: any) => void;
  errors: Record<string, string>;
}

export const Step3: React.FC<Step3Props> = ({
  contactInfo,
  setContactInfo,
  errors
}) => {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({ ...contactInfo, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <FormField label="Full Name" required error={errors.name}>
        <input
          type="text"
          value={contactInfo.name}
          onChange={handleChange('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          placeholder="Enter your full name"
        />
      </FormField>

      <FormField label="Email Address" required error={errors.email}>
        <input
          type="email"
          value={contactInfo.email}
          onChange={handleChange('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          placeholder="your.email@example.com"
        />
      </FormField>

      <FormField label="Phone Number" error={errors.phone}>
        <input
          type="tel"
          value={contactInfo.phone}
          onChange={handleChange('phone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          placeholder="+1 (555) 000-0000"
        />
      </FormField>

      <FormField label="Order/Product Reference" required error={errors.orderNumber}>
        <input
          type="text"
          value={contactInfo.orderNumber}
          onChange={handleChange('orderNumber')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          placeholder="Enter order or product reference number"
        />
      </FormField>
    </div>
  );
};