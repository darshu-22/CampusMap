import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildings, floors, rooms } from '../data/mockData';
import { RoomCard } from '../components/RoomCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { ErrorState } from '../components/ErrorState';
import { Modal } from '../components/Modal';
import {
  ArrowUpDown,
  LogOut,
  Sparkles,
  Home,
  FlameKindling
} from 'lucide-react';

export const FloorDetails: React.FC = () => {
  const { buildingId, floorId } = useParams<{ buildingId: string; floorId: string }>();
  const [selectedUtility, setSelectedUtility] = useState<{
    title: string;
    desc: string;
    icon: React.ReactNode;
  } | null>(null);

  // Find parent building
  const building = buildings.find((b) => b.id === buildingId);
  // Find requested floor
  const floor = floors.find((f) => f.id === floorId && f.buildingId === buildingId);

  if (!building || !floor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorState
          title="Floor Not Found"
          message="We could not find the building or floor layout you requested. Please verify your URL or go back."
        />
      </div>
    );
  }

  // Get rooms belonging to this floor
  const floorRooms = rooms.filter((r) => r.floorId === floor.id && r.buildingId === building.id);

  // Group rooms by category
  const classrooms = floorRooms.filter((r) => r.category === 'Classroom');
  const labs = floorRooms.filter((r) => r.category === 'Lab');
  const facultyRooms = floorRooms.filter((r) => r.category === 'Faculty Room' || r.category === 'Office');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 25 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10"
    >
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: building.name, link: `/building/${building.id}` },
          { label: floor.name }
        ]}
      />

      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-2 border-b border-gray-100 pb-5">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>{building.name}</span>
          <span className="text-gray-300">•</span>
          <span className="text-blue-600">Level {floor.number}</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {floor.name} Layout
        </h1>
        <p className="text-sm font-semibold text-gray-500 bg-blue-50/60 px-3 py-1.5 rounded-lg inline-block text-blue-700">
          Occupied Department: {floor.department}
        </p>
      </motion.div>

      {/* Main Grid: Left column for Rooms, Right column for Utilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rooms Section (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Classrooms */}
          {classrooms.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900 border-l-4 border-emerald-500 pl-3">
                Classrooms & Lecture Rooms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classrooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    id={room.id}
                    number={room.number}
                    name={room.name}
                    category="Classroom"
                    link={`/room/${room.id}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Laboratories */}
          {labs.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900 border-l-4 border-indigo-500 pl-3">
                Labs & Practical Centers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {labs.map((room) => (
                  <RoomCard
                    key={room.id}
                    id={room.id}
                    number={room.number}
                    name={room.name}
                    category="Lab"
                    link={`/room/${room.id}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Faculty Cabins & Offices */}
          {facultyRooms.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900 border-l-4 border-purple-500 pl-3">
                Faculty Cabins & Offices
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facultyRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    id={room.id}
                    number={room.number}
                    name={room.name}
                    category={room.category}
                    link={`/room/${room.id}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Utilities Sidebar (1/3 width on desktop) */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-lg font-extrabold text-gray-900 border-l-4 border-slate-500 pl-3">
            Utilities & Amenities
          </h3>

          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Click utility to see details
            </p>

            {/* Restrooms */}
            <RoomCard
              id="washrooms"
              name="Washrooms / Restrooms"
              category="Utility"
              onClick={() =>
                setSelectedUtility({
                  title: 'Washrooms',
                  desc: `Located at: ${floor.washrooms}. Equipped with separate male, female, and wheelchair-accessible facilities.`,
                  icon: <Sparkles className="w-8 h-8 text-blue-600" />
                })
              }
            />

            {/* Lifts */}
            <RoomCard
              id="lifts"
              name={`Lifts (${floor.lifts.join(', ')})`}
              category="Utility"
              onClick={() =>
                setSelectedUtility({
                  title: 'Lifts / Elevators',
                  desc: `Available elevators on this floor: ${floor.lifts.join(', ')}. Lifts provide access from basement parking to all floors.`,
                  icon: <ArrowUpDown className="w-8 h-8 text-blue-600" />
                })
              }
            />

            {/* Emergency Exit */}
            <RoomCard
              id="exit"
              name="Emergency Exit"
              category="Utility"
              onClick={() =>
                setSelectedUtility({
                  title: 'Emergency Exit Route',
                  desc: `Exit guidelines: ${floor.emergencyExit}. In case of emergency, do NOT use elevators. Follow local exit signs.`,
                  icon: <LogOut className="w-8 h-8 text-red-500" />
                })
              }
            />

            {/* Staircases */}
            <RoomCard
              id="staircases"
              name="Staircases Locations"
              category="Utility"
              onClick={() =>
                setSelectedUtility({
                  title: 'Staircases',
                  desc: `Stairwell access: ${floor.staircases}. Clean and well-ventilated stairs with safety handrails.`,
                  icon: <Home className="w-8 h-8 text-blue-600" />
                })
              }
            />
          </div>
        </motion.div>
      </div>

      {/* Utility Modal Details */}
      <Modal
        isOpen={selectedUtility !== null}
        onClose={() => setSelectedUtility(null)}
        title={selectedUtility?.title || ''}
      >
        <div className="flex flex-col items-center text-center p-4 space-y-4">
          <div className="p-4 bg-blue-50 rounded-full">{selectedUtility?.icon}</div>
          <p className="text-gray-600 text-sm leading-relaxed">{selectedUtility?.desc}</p>
          <div className="pt-4 flex items-center space-x-2 text-xs text-amber-600 font-bold bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-100">
            <FlameKindling className="w-4 h-4 text-amber-600" />
            <span>Review safety map exit labels on local corridors.</span>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
