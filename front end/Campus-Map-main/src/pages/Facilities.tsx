import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { facilities } from '../data/mockData';
import { FacilityCard } from '../components/FacilityCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Modal } from '../components/Modal';
import { Footprints } from 'lucide-react';

export const Facilities: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOutdoorFacility, setSelectedOutdoorFacility] = useState<{
    name: string;
    directions: string[];
  } | null>(null);

  const handleNavigate = (facilityName: string) => {
    // Check if there's a specific Room Detail page for this facility
    const roomMap: { [key: string]: string } = {
      'Central Library': '/room/library-room',
      'Placement Cell': '/room/placement-cell-room',
      'Admission Office': '/room/admission-office',
      'Accounts Office': '/room/accounts-office',
      'Principal Office': '/room/principal-office-room',
      'Counselling Office': '/room/counselling-office-room',
      'Center of Excellence': '/room/coe-room',
      'Medical Room': '/room/medical-room-office',
      'Security Office': '/room/security-office-room',
      Canteen: '/room/canteen-room',
    };

    const targetUrl = roomMap[facilityName];
    if (targetUrl) {
      navigate(targetUrl);
    } else {
      // Outdoor facilities (Turf, Parking, Bus Stop, Court) will show directions in a modal!
      const outdoorDirections: { [key: string]: string[] } = {
        'Football Turf': [
          'Start at the Main Gate Entrance',
          'Walk straight along the central avenue for 15 meters',
          'Turn right at the lawn junction towards the East Wing',
          'Walk past the academic auditorium',
          'The Football Turf and sports complex is visible directly ahead'
        ],
        'Basketball Court': [
          'Start at the Main Gate Entrance',
          'Walk straight along the central avenue for 15 meters',
          'Turn right towards the East Wing sports grounds',
          'Walk past the academic auditorium and cafeteria',
          'The Basketball Court is located adjacent to the Football Turf'
        ],
        Parking: [
          'Located immediately left of the Main Gate Entrance',
          'Enter the basement lane for underground car parking',
          'Utilize surface bays on the left lane for two-wheeler parking'
        ],
        'Bus Stop': [
          'Located directly outside the Main Gate security barrier',
          'Safe waiting zones are located on the pedestrian footpath'
        ]
      };

      setSelectedOutdoorFacility({
        name: facilityName,
        directions: outdoorDirections[facilityName] || ['Start at the Main Gate', 'Walk towards the target location.']
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      <Breadcrumb items={[{ label: 'Facilities' }]} />

      <motion.div variants={itemVariants} className="space-y-2 border-b border-gray-150 pb-5">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Campus Facilities</h1>
        <p className="text-gray-500 text-sm font-medium">
          Browse sports areas, libraries, cafeterias, medical rooms, and transit hubs across the campus.
        </p>
      </motion.div>

      {/* Facilities Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {facilities.map((fac) => (
          <motion.div key={fac.id} variants={itemVariants}>
            <FacilityCard facility={fac} onNavigate={handleNavigate} />
          </motion.div>
        ))}
      </motion.div>

      {/* Outdoor Facility Directions Modal */}
      <Modal
        isOpen={selectedOutdoorFacility !== null}
        onClose={() => setSelectedOutdoorFacility(null)}
        title={`${selectedOutdoorFacility?.name} Route Guide`}
      >
        <div className="space-y-5 py-1">
          <p className="text-sm text-gray-500 leading-relaxed">
            Here are the walking directions to the **{selectedOutdoorFacility?.name}** from the campus Main Gate entrance:
          </p>

          <div className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 flex flex-col justify-start space-y-5">
            {selectedOutdoorFacility?.directions.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="absolute left-[-21px] top-1.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-xs" />
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {idx === 0 ? 'Start' : idx === selectedOutdoorFacility.directions.length - 1 ? 'Arrive' : `Step ${idx}`}
                  </span>
                  <p className="text-sm font-semibold text-gray-700">{step}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center space-x-2 text-xs text-blue-600 font-bold bg-blue-50 px-3.5 py-2.5 rounded-xl border border-blue-100">
            <Footprints className="w-4.5 h-4.5 text-blue-650" />
            <span>Outdoor signage guides are fully visible along the path.</span>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
