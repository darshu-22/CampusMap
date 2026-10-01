import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-250 bg-gray-200 rounded-xl"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export const FloorSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between animate-pulse">
      <div className="space-y-3 flex-1">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="h-8 bg-gray-250 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/4 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};
