import React from 'react';
import { CheckCircle, MapPin } from 'lucide-react';

interface ArrivalMessageProps {
  destinationName: string;
  onRestart: () => void;
}

export const ArrivalMessage: React.FC<ArrivalMessageProps> = ({
  destinationName,
  onRestart
}) => {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl md:rounded-3xl p-6 text-center shadow-sm max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mb-4">
        <CheckCircle className="w-8 h-8" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-1">
        You have arrived!
      </h3>
      
      <p className="text-sm text-slate-500 mb-4 flex items-center justify-center gap-1.5 font-medium">
        <MapPin className="w-4 h-4 text-emerald-500" />
        <span>{destinationName}</span>
      </p>

      <button
        onClick={onRestart}
        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
      >
        Select New Destination
      </button>
    </div>
  );
};
