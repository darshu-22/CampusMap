import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { SearchResult } from '../types';
import * as Icons from 'lucide-react';

interface SearchResultCardProps {
  result: SearchResult;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  // Dynamically resolve Lucide Icon
  const IconComponent = (Icons as any)[result.iconName] || Icons.MapPin;

  const categoryColors = {
    Classroom: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Lab: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Faculty Room': 'bg-purple-50 text-purple-700 border-purple-100',
    Office: 'bg-amber-50 text-amber-700 border-amber-100',
    Facility: 'bg-sky-50 text-sky-700 border-sky-100',
    Building: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Link
        to={result.link}
        className="flex items-start p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        {/* Left Icon */}
        <div className="p-3 bg-slate-50 text-blue-600 rounded-xl mr-4 flex-shrink-0">
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-base font-bold text-gray-900 truncate pr-2">
              {result.name}
            </h4>
            <span
              className={`text-xs px-2.5 py-0.5 font-semibold rounded-full border ${
                categoryColors[result.category] || 'bg-gray-50 text-gray-600 border-gray-100'
              }`}
            >
              {result.category}
            </span>
          </div>

          {/* Floor & Building location indicators */}
          {(result.floor || result.building) && (
            <p className="text-sm text-gray-500 mb-2 flex flex-wrap items-center gap-1.5">
              <span>{result.floor}</span>
              {result.floor && result.building && <span className="text-gray-300">•</span>}
              <span className="font-medium text-gray-600">{result.building}</span>
            </p>
          )}

          {/* Structural Helpers */}
          {result.nearestLift && (
            <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium mt-1">
              <Icons.Navigation className="w-3.5 h-3.5 text-slate-400" />
              <span>Nearest Lift: {result.nearestLift}</span>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <div className="self-center pl-3 text-gray-300 hover:text-blue-600 transition-colors">
          <Icons.ChevronRight className="w-5 h-5" />
        </div>
      </Link>
    </motion.div>
  );
};
