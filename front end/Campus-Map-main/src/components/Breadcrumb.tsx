import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 md:space-x-2 text-sm text-gray-500 font-medium py-3 px-4 bg-gray-50 rounded-xl mb-6">
      <Link to="/" className="flex items-center hover:text-blue-600 transition-colors">
        <Home className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {item.link ? (
            <Link
              to={item.link}
              className="hover:text-blue-600 hover:underline transition-colors truncate max-w-[120px] sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold truncate max-w-[120px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
