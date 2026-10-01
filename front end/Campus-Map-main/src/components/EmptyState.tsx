import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  message = 'We couldn\'t find what you were looking for. Please try adjusting your search terms or filters.',
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white border border-gray-100 shadow-sm max-w-md mx-auto my-8">
      <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
        {icon || <Search className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};
