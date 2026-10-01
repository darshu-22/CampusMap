import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildings, floors } from '../data/mockData';
import { FloorCard } from '../components/FloorCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { ErrorState } from '../components/ErrorState';
import { Layers } from 'lucide-react';

export const AcademicBuilding: React.FC = () => {
  const { buildingId } = useParams<{ buildingId: string }>();

  // Find the requested building
  const building = buildings.find((b) => b.id === (buildingId || 'academic-block'));

  if (!building) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorState
          title="Building Not Found"
          message="We could not find the building you requested. Please return to the Home page and select a valid landmark."
        />
      </div>
    );
  }

  // Get all floors belonging to this building, sorted by floor number
  const buildingFloors = floors
    .filter((f) => f.buildingId === building.id)
    .sort((a, b) => a.number - b.number);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 25 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Breadcrumb path */}
      <Breadcrumb items={[{ label: building.name }]} />

      {/* Building Header Card */}
      <motion.div
        variants={itemVariants}
        className="relative bg-white border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-stretch gap-6 md:gap-8 shadow-sm overflow-hidden"
      >
        {building.image && (
          <div className="w-full md:w-1/3 min-h-[160px] md:min-h-0 rounded-2xl overflow-hidden relative">
            <img
              src={building.image}
              alt={building.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 px-2.5 py-1 bg-blue-50 rounded-md inline-block">
              Landmark Building
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {building.name}
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl">
            {building.description}
          </p>

          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Contains {building.floorsCount} Floors</span>
          </div>
        </div>
      </motion.div>

      {/* Floors Grid Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Floors Directory</h2>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Select a floor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildingFloors.map((floor) => (
            <motion.div key={floor.id} variants={itemVariants}>
              <FloorCard floor={floor} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
