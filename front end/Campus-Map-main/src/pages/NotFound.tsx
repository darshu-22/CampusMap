import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto space-y-6">
      {/* Animated Compass Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="p-5 bg-blue-50 text-blue-600 rounded-full"
      >
        <Compass className="w-16 h-16 stroke-[1.8]" />
      </motion.div>

      {/* Error Info */}
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-slate-800 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-900">Path Not Found</h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
          It looks like you took a wrong turn! The location, floor, or room you are searching for does not exist on our map.
        </p>
      </div>

      {/* Navigation actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <Link
          to="/"
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-750 transition-colors shadow-sm gap-2"
        >
          <Home className="w-4.5 h-4.5" />
          Back to Home
        </Link>
        <Link
          to="/search"
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white border border-gray-150 text-slate-650 hover:bg-slate-50 font-bold rounded-2xl transition-colors gap-2"
        >
          <Compass className="w-4.5 h-4.5" />
          Search Map
        </Link>
      </div>
    </div>
  );
};
