import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildings, floors, rooms } from '../data/mockData';
import { Breadcrumb } from '../components/Breadcrumb';
import { ErrorState } from '../components/ErrorState';
import { Modal } from '../components/Modal';
import {
  Navigation,
  Sparkles,
  Users,
  ArrowDown,
  ArrowUpDown,
  Footprints,
  CheckCircle2
} from 'lucide-react';

export const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Find requested room
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorState
          title="Room Not Found"
          message="We could not find the classroom or office details you requested. Please check the directory or try searching."
        />
      </div>
    );
  }

  // Find parent floor and building
  const floor = floors.find((f) => f.id === room.floorId);
  const building = buildings.find((b) => b.id === room.buildingId);

  // Determine nearby room link targets
  const getNearbyRoomLink = (roomName: string) => {
    // Attempt to match room name like "Room 002" or similar
    const roomNumMatch = roomName.match(/\((\d+)\)|(\d+)/);
    if (roomNumMatch) {
      const num = roomNumMatch[1] || roomNumMatch[2];
      const foundRoom = rooms.find((r) => r.number === num);
      if (foundRoom) return `/room/${foundRoom.id}`;
    }
    return null;
  };

  const handleNextStep = () => {
    if (activeStep < room.directions.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setActiveStep(room.directions.length); // Finished navigation
    }
  };

  const handleResetNav = () => {
    setActiveStep(0);
    setIsNavigating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Breadcrumb Path */}
      {building && floor && (
        <Breadcrumb
          items={[
            { label: building.name, link: `/building/${building.id}` },
            { label: floor.name, link: `/building/${building.id}/floor/${floor.id}` },
            { label: `Room ${room.number}` }
          ]}
        />
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Room Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                  Room {room.number}
                </span>
                <span className="text-xs uppercase font-extrabold tracking-wider bg-slate-100 text-slate-600 px-3 py-1 rounded-md">
                  {room.category}
                </span>
                {room.capacity && (
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-gray-50 text-gray-500 px-3 py-1 rounded-md flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    Max: {room.capacity} seats
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {room.name}
              </h1>
              {room.department && (
                <p className="text-sm font-semibold text-slate-500">
                  Affiliation: {room.department}
                </p>
              )}
            </div>

            {/* Purpose */}
            <div className="space-y-2 border-t border-gray-50 pt-5">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Primary Purpose
              </h4>
              <p className="text-sm text-gray-650 leading-relaxed font-medium">
                {room.purpose}
              </p>
            </div>

            {/* Structural Location Helpers */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-5">
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-3">
                <div className="p-2.5 bg-white text-blue-600 rounded-xl shadow-xs">
                  <ArrowUpDown className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Nearest Elevator</span>
                  <span className="text-sm font-bold text-gray-700">{room.nearestLift}</span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-3">
                <div className="p-2.5 bg-white text-blue-600 rounded-xl shadow-xs">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Nearest Restroom</span>
                  <span className="text-sm font-bold text-gray-700 truncate block max-w-[150px]">
                    {room.nearestWashroom}
                  </span>
                </div>
              </div>
            </div>

            {/* Nearby Rooms list */}
            {room.nearbyRooms.length > 0 && (
              <div className="border-t border-gray-50 pt-5 space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Adjacent Locations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {room.nearbyRooms.map((nearby, idx) => {
                    const targetLink = getNearbyRoomLink(nearby);
                    if (targetLink) {
                      return (
                        <Link
                          key={idx}
                          to={targetLink}
                          className="px-3.5 py-1.5 bg-white border border-gray-100 hover:border-blue-300 hover:text-blue-600 text-sm font-bold rounded-xl shadow-xs transition-colors"
                        >
                          {nearby}
                        </Link>
                      );
                    }
                    return (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 bg-white border border-gray-100 text-sm font-semibold text-gray-500 rounded-xl shadow-xs"
                      >
                        {nearby}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Directions & Navigation button */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-extrabold text-gray-900 border-l-4 border-blue-600 pl-3 mb-6">
              Navigation Route
            </h3>

            {/* Vertical timeline directions list */}
            <div className="flex-1 space-y-1 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {room.directions.map((step, idx) => {
                const isLast = idx === room.directions.length - 1;
                return (
                  <div key={idx} className="relative pb-6 last:pb-0">
                    {/* Checkpoint bullet node */}
                    <div className="absolute left-[-21px] top-1 w-[12px] h-[12px] bg-blue-600 rounded-full border-[2px] border-white shadow-xs" />
                    
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        {idx === 0 ? 'Start Point' : isLast ? 'Destination' : `Step ${idx}`}
                      </span>
                      <p className={`text-sm font-semibold ${isLast ? 'text-blue-600 font-extrabold text-base' : 'text-gray-700'}`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Start Navigation Action */}
            <button
              onClick={() => setIsNavigating(true)}
              className="mt-8 w-full flex items-center justify-center py-4 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-700 active:scale-98 transition-all duration-200 shadow-md hover:shadow-lg gap-2 cursor-pointer focus:outline-none"
            >
              <Navigation className="w-5 h-5 fill-current" />
              Start Navigation
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Simulation Modal */}
      <Modal
        isOpen={isNavigating}
        onClose={handleResetNav}
        title="Live Navigation Guide"
      >
        <div className="flex flex-col items-stretch space-y-6 py-2">
          {activeStep < room.directions.length ? (
            <>
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <span>Routing Progress</span>
                  <span>
                    {Math.round((activeStep / room.directions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeStep / room.directions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Current checkpoint display */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start space-x-4">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                  <Footprints className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-blue-500 block">
                    Current Checkpoint
                  </span>
                  <p className="text-base font-black text-blue-900 leading-tight">
                    {room.directions[activeStep]}
                  </p>
                </div>
              </div>

              {/* Steps timeline outline */}
              <div className="text-sm font-semibold text-gray-650 space-y-1.5">
                <span className="text-xs uppercase font-bold text-gray-400 block mb-2">Upcoming Directions</span>
                {room.directions.slice(activeStep + 1, activeStep + 3).map((step, idx) => (
                  <div key={idx} className="flex items-center text-gray-500 space-x-2">
                    <ArrowDown className="w-4 h-4 text-slate-300" />
                    <span className="truncate">{step}</span>
                  </div>
                ))}
              </div>

              {/* Modal control actions */}
              <div className="pt-4 flex items-center space-x-3 border-t border-gray-100">
                <button
                  onClick={handleResetNav}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 border border-gray-150 rounded-xl transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3 text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-750 rounded-xl shadow-xs transition-colors focus:outline-none"
                >
                  {activeStep === room.directions.length - 1 ? 'Finish' : 'Next Checkpoint'}
                </button>
              </div>
            </>
          ) : (
            // Navigation completed page
            <div className="flex flex-col items-center text-center p-6 space-y-5 animate-fadeIn">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xl font-black text-gray-900">Arrived at Destination</h4>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  You have successfully reached **{room.name} ({room.number})**. Have a great day!
                </p>
              </div>
              <button
                onClick={handleResetNav}
                className="w-full py-3 text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors focus:outline-none"
              >
                Close Navigator
              </button>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};
