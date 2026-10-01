import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onBack?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We could not load the page or resource you are looking for. It might have been moved or deleted.',
  onBack
}) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto my-8">
      <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6">{message}</p>
      <button
        onClick={handleBack}
        className="flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go Back
      </button>
    </div>
  );
};
