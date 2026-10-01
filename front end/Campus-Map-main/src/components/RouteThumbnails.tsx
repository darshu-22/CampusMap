import React from 'react';
import type { RouteStep } from '../data/routes';

interface RouteThumbnailsProps {
  steps: RouteStep[];
  currentStepIndex: number;
  onStepSelect: (index: number) => void;
}

export const RouteThumbnails: React.FC<RouteThumbnailsProps> = ({
  steps,
  currentStepIndex,
  onStepSelect
}) => {
  return (
    <div className="flex items-center justify-center gap-2.5 py-4 overflow-x-auto max-w-full">
      {steps.map((step, idx) => {
        const isActive = idx === currentStepIndex;
        
        return (
          <button
            key={idx}
            onClick={() => onStepSelect(idx)}
            className={`relative flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl font-bold transition-all flex items-center justify-center border text-sm cursor-pointer shadow-sm ${
              isActive 
                ? 'bg-blue-600 text-white border-blue-600 scale-110 ring-4 ring-blue-500/20' 
                : 'bg-white text-slate-600 border-gray-200 hover:border-blue-400 hover:text-blue-500'
            }`}
            title={`Step ${idx + 1}`}
          >
            {idx + 1}
            {/* Tiny instruction/type indicator dot */}
            {step.direction && step.direction !== 'none' && (
              <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-white' : 'bg-blue-500'
              }`} />
            )}
          </button>
        );
      })}
    </div>
  );
};
