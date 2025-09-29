import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Step1 } from './ReclamationSteps';
import { Step2 } from './ReclamationStep2';
import { Step3 } from './ReclamationStep3';

interface ReclamationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReclamationModal: React.FC<ReclamationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Step 1 state
  const [type, setType] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('');
  
  // Step 2 state
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  
  // Step 3 state
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
  });

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!type) newErrors.type = 'Please select a reclamation type';
        if (!subject) newErrors.subject = 'Please enter a subject';
        if (!priority) newErrors.priority = 'Please select a priority level';
        break;
      case 2:
        if (!description) newErrors.description = 'Please provide a detailed description';
        break;
      case 3:
        if (!contactInfo.name) newErrors.name = 'Please enter your name';
        if (!contactInfo.email) newErrors.email = 'Please enter your email';
        if (!contactInfo.orderNumber) newErrors.orderNumber = 'Please enter the order reference';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('subject', subject);
      formData.append('priority', priority);
      formData.append('description', description);
      formData.append('contactInfo', JSON.stringify(contactInfo));
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/reclamation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit reclamation');

      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to submit reclamation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
            Submit Reclamation
          </Dialog.Title>

          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex items-center ${stepNumber < 3 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
                      ${step === stepNumber ? 'bg-orange-500 text-white' :
                        step > stepNumber ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            {step === 1 && (
              <Step1
                type={type}
                setType={setType}
                subject={subject}
                setSubject={setSubject}
                priority={priority}
                setPriority={setPriority}
                errors={errors}
              />
            )}
            {step === 2 && (
              <Step2
                description={description}
                setDescription={setDescription}
                files={files}
                setFiles={setFiles}
                errors={errors}
              />
            )}
            {step === 3 && (
              <Step3
                contactInfo={contactInfo}
                setContactInfo={setContactInfo}
                errors={errors}
              />
            )}
            {errors.submit && (
              <p className="mt-4 text-sm text-red-600 text-center">{errors.submit}</p>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <div className="flex space-x-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Previous
                </button>
              )}
              <button
                type="button"
                onClick={() => step < 3 ? handleNext() : handleSubmit()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md
                  ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
                  }`}
                disabled={loading}
              >
                {loading ? 'Processing...' : step === 3 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReclamationModal;