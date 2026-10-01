import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface RoomCardProps {
  id: string;
  number?: string;
  name: string;
  category: 'Classroom' | 'Lab' | 'Faculty Room' | 'Office' | 'Facility' | 'Utility';
  department?: string;
  link?: string;
  onClick?: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  number,
  name,
  category,
  department,
  link,
  onClick
}) => {
  const categoryColors = {
    Classroom: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Lab: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Faculty Room': 'bg-purple-50 text-purple-700 border-purple-100',
    Office: 'bg-amber-50 text-amber-700 border-amber-100',
    Facility: 'bg-sky-50 text-sky-700 border-sky-100',
    Utility: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'Classroom':
        return <Icons.GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'Lab':
        return <Icons.Cpu className="w-5 h-5 text-indigo-600" />;
      case 'Faculty Room':
        return <Icons.User className="w-5 h-5 text-purple-600" />;
      case 'Office':
        return <Icons.Briefcase className="w-5 h-5 text-amber-600" />;
      case 'Facility':
        return <Icons.Sparkles className="w-5 h-5 text-sky-600" />;
      default:
        if (name.toLowerCase().includes('washroom') || name.toLowerCase().includes('restroom')) {
          return <Icons.GlassWater className="w-5 h-5 text-slate-600" />;
        }
        if (name.toLowerCase().includes('lift') || name.toLowerCase().includes('elevator')) {
          return <Icons.ArrowUpDown className="w-5 h-5 text-slate-600" />;
        }
        if (name.toLowerCase().includes('exit')) {
          return <Icons.LogOut className="w-5 h-5 text-red-500" />;
        }
        return <Icons.HelpCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const cardContent = (
    <div className="flex items-start p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-255 h-full">
      {/* Icon */}
      <div className="p-3 bg-slate-50 rounded-xl mr-4 flex-shrink-0">
        {getCategoryIcon()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          {number && (
            <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              Room {number}
            </span>
          )}
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[category]}`}
          >
            {category}
          </span>
        </div>
        <h4 className="text-base font-bold text-gray-900 line-clamp-1">{name}</h4>
        {department && <p className="text-xs text-gray-400 mt-1 truncate">{department}</p>}
      </div>

      <div className="self-center pl-3 text-gray-300 group-hover:text-blue-600 transition-colors">
        <Icons.ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );

  if (link) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.15 }}
        className="block h-full group"
      >
        <Link to={link}>{cardContent}</Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="w-full text-left block h-full group focus:outline-none"
    >
      {cardContent}
    </motion.button>
  );
};
