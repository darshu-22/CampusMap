import React from 'react';
import { motion } from 'framer-motion';
import type { Facility } from '../types';
import * as Icons from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
  onNavigate?: (facilityName: string) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onNavigate }) => {
  // Dynamically resolve Lucide Icon
  const IconComponent = (Icons as any)[facility.iconName] || Icons.MapPin;

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group"
    >
      {/* Decorative accent background ring */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50/40 rounded-full group-hover:scale-125 transition-transform duration-300 -z-0" />

      <div className="relative z-10">
        {/* Header Icon + Hours */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full flex items-center">
            <Icons.Clock className="w-3.5 h-3.5 mr-1" />
            {facility.openHours}
          </span>
        </div>

        {/* Info */}
        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {facility.name}
        </h4>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
          {facility.description}
        </p>
      </div>

      {/* Footer Location Details */}
      <div className="border-t border-gray-50 pt-4 mt-auto flex items-center justify-between z-10">
        <div className="space-y-0.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
            Location
          </span>
          <span className="text-sm font-semibold text-gray-700 block truncate max-w-[200px]">
            {facility.floor}, {facility.building}
          </span>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate(facility.name)}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
            title="Navigate here"
          >
            <Icons.Navigation className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
