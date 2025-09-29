import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

interface Step1Props {
  type: string;
  setType: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  errors: Record<string, string>;
}

export const Step1: React.FC<Step1Props> = ({
  type,
  setType,
  subject,
  setSubject,
  priority,
  setPriority,
  errors
}) => {
  const reclamationTypes = [
    'Complaint',
    'Return',
    'Refund',
    'Damage Report',
    'Other'
  ];

  const priorityLevels = [
    'Low',
    'Medium',
    'High',
    'Urgent'
  ];

  return (
    <div className="space-y-4">
      <FormField label="Reclamation Type" required error={errors.type}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
        >
          <option value="">Select a type</option>
          {reclamationTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Subject" required error={errors.subject}>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          placeholder="Brief description of the issue"
        />
      </FormField>

      <FormField label="Priority Level" required error={errors.priority}>
        <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {priorityLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setPriority(level)}
              className={`px-3 py-2 rounded-md text-sm font-medium
                ${priority === level
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {level}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  );
};
