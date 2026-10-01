import React from 'react';
import type { RouteStep } from '../data/routes';
import type { Location } from '../data/locations';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface RouteStepsProps {
  steps: RouteStep[];
  currentStepIndex: number;
  onStepSelect: (index: number) => void;
  locationsList: Location[];
}

export const RouteSteps: React.FC<RouteStepsProps> = ({
  steps,
  currentStepIndex,
  onStepSelect,
  locationsList
}) => {
  const getLocationName = (locId: string) => {
    return locationsList.find(loc => loc.id === locId)?.name || locId;
  };

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Directions
        </h3>
        <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-full">
          {steps.length} Steps
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto pr-1 flex-1 max-h-[480px]">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isVisited = idx < currentStepIndex;
          const isLast = idx === steps.length - 1;

          return (
            <div 
              key={idx}
              onClick={() => onStepSelect(idx)}
              className={`group flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all border ${
                isActive 
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50'
              }`}
            >
              {/* Step number marker */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : isVisited 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {isVisited ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                
                {!isLast && (
                  <div className={`w-0.5 h-10 my-1 transition-colors ${
                    isVisited ? 'bg-emerald-300' : 'bg-slate-200'
                  }`} />
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className={`font-semibold text-base transition-colors ${
                  isActive ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-600'
                }`}>
                  {getLocationName(step.location)}
                </h4>
                <p className={`text-sm mt-1 leading-relaxed ${
                  isActive ? 'text-slate-700 font-medium' : 'text-slate-500'
                }`}>
                  {step.instruction}
                </p>
              </div>

              <ChevronRight className={`w-5 h-5 self-center transition-transform ${
                isActive ? 'text-blue-600 translate-x-0.5' : 'text-transparent group-hover:text-slate-400'
              }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
