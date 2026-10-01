import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search classrooms, departments, labs or offices...',
  onClear,
  className = ''
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-4 text-gray-400 pointer-events-none">
        <Search className="w-5.5 h-5.5 stroke-[2.25]" />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-white border border-gray-250/70 hover:border-gray-300 focus:border-blue-500 rounded-2xl shadow-sm focus:shadow-md outline-none text-gray-800 placeholder-gray-400 font-medium transition-all duration-200"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 p-1 text-gray-400 hover:text-gray-650 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      )}
    </div>
  );
};
