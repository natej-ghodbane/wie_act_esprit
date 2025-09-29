import React, { useState } from 'react';
import ReclamationButton from './ReclamationButton';
import ReclamationModal from './ReclamationModal';

interface ReclamationSystemProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  buttonText?: string;
}

const ReclamationSystem: React.FC<ReclamationSystemProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  buttonText,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ReclamationButton
        onClick={handleOpenModal}
        variant={variant}
        size={size}
        className={className}
      />
      
      <ReclamationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ReclamationSystem;