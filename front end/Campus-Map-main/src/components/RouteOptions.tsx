import React from 'react';
import type { RouteOption } from '../utils/routing';
import { Check } from 'lucide-react';

interface RouteOptionsProps {
  options: RouteOption[];
  selectedOptionId: string;
  onSelectOption: (option: RouteOption) => void;
}

export const RouteOptions: React.FC<RouteOptionsProps> = ({
  options,
  selectedOptionId,
  onSelectOption,
}) => {
  if (!options || options.length <= 1) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span>Route Options</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {options.length} routes available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isLift = opt.type === 'lift';

          return (
            <div
              key={opt.id}
              onClick={() => onSelectOption(opt)}
              className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 select-none flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={opt.title}>
                    {isLift ? '🛗' : '🚶'}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      {opt.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.subtitle}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="p-1 bg-blue-600 text-white rounded-full flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  {opt.path.length} locations ({opt.path.length - 1} steps)
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOption(opt);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Choose this route'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
