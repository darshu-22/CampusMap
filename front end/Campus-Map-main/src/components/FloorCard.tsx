import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Floor } from '../types';
import { ArrowRight, Layers, Layout, FlaskConical } from 'lucide-react';

interface FloorCardProps {
  floor: Floor;
}

export const FloorCard: React.FC<FloorCardProps> = ({ floor }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Link
        to={`/building/${floor.buildingId}/floor/${floor.id}`}
        className="block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Level {floor.number}
            </span>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {floor.name}
            </h3>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Department Name Indicator */}
        <div className="mb-4">
          <span className="text-xs text-gray-400 block mb-0.5">Primary Department</span>
          <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg inline-block">
            {floor.department}
          </span>
        </div>

        {/* Room / Lab Counts Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
          <div className="flex items-center text-gray-500">
            <Layout className="w-4.5 h-4.5 mr-2 text-slate-400" />
            <div>
              <span className="text-base font-bold text-gray-900 block leading-tight">
                {floor.roomsCount}
              </span>
              <span className="text-xs text-gray-400">Total Rooms</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <FlaskConical className="w-4.5 h-4.5 mr-2 text-slate-400" />
            <div>
              <span className="text-base font-bold text-gray-900 block leading-tight">
                {floor.labsCount}
              </span>
              <span className="text-xs text-gray-400">Labs & Research</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
