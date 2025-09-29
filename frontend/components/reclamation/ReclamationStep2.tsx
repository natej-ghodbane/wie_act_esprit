import React, { useRef } from 'react';
import { FormField } from './ReclamationSteps';

interface Step2Props {
  description: string;
  setDescription: (value: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  errors: Record<string, string>;
}

export const Step2: React.FC<Step2Props> = ({
  description,
  setDescription,
  files,
  setFiles,
  errors
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <FormField label="Detailed Description" required error={errors.description}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          placeholder="Please provide detailed information about your reclamation..."
        />
        <div className="mt-1 text-sm text-gray-500">
          {description.length}/1000 characters
        </div>
      </FormField>

      <FormField label="Supporting Documents" error={errors.files}>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, PDF up to 10MB each
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 flex-1 w-0 truncate text-black">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </FormField>
    </div>
  );
};
