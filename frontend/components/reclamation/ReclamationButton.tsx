import React from 'react';

interface ReclamationButtonProps {
  onClick: () => void;
  className?: string;
}

const ReclamationButton: React.FC<ReclamationButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-4 py-2 rounded-lg
        bg-orange-500 hover:bg-orange-600 active:bg-orange-700
        text-white font-semibold transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label="Submit Reclamation"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      Submit Reclamation
    </button>
  );
};

export default ReclamationButton;