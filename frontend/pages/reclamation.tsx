import React, { useState } from 'react';
import { NextPage } from 'next';
import ReclamationButton from '../components/reclamation/ReclamationButton';
import ReclamationModal from '../components/reclamation/ReclamationModal';
import Navbar from '../components/Navbar';
import Background from '../components/Background';

const ReclamationPage: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Background />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Submit a Reclamation
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Having an issue? We're here to help. Fill out the form below and our team will get back to you as soon as possible.
          </p>
          <div className="mt-10">
            <ReclamationButton
              onClick={() => setIsModalOpen(true)}
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      <ReclamationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ReclamationPage;