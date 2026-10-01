import React from 'react';
import { motion } from 'framer-motion';
import { Breadcrumb } from '../components/Breadcrumb';
import { Compass, ShieldCheck, MapPin, Sparkles, Navigation, ShieldAlert } from 'lucide-react';

export const About: React.FC = () => {
  const features = [
    {
      title: 'Instant Search',
      desc: 'Lookup rooms, classrooms, laboratories, and offices in real time by number, name, or keywords.',
      icon: Compass,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Timeline Guidance',
      desc: 'Clear, step-by-step gate directions guide you from the campus main gate straight to the door.',
      icon: Navigation,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Building Directories',
      desc: 'Interactive floor-by-floor department layouts listing total classrooms, laboratories, and emergency utilities.',
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Emergency Center',
      desc: 'Active quick links for emergency security gates, first aid medical wings, and anti-harassment committees.',
      icon: ShieldAlert,
      color: 'bg-rose-50 text-rose-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-12"
    >
      <Breadcrumb items={[{ label: 'About' }]} />

      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-650 px-2.5 py-1 bg-blue-50 rounded-md inline-block">
          <Sparkles className="w-4 h-4 text-blue-600 mr-1 inline" />
          Campus Navigator App
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
          Simplifying Campus Navigation
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
          Campus Navigator is a modern navigation utility built for colleges and universities to enable frictionless pathfinding. It offers a catalog of academic structures, research labs, facility zones, and administrative departments.
        </p>
      </div>

      {/* Feature list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-105 rounded-2xl p-5 shadow-xs space-y-3.5"
            >
              <div className={`p-3 rounded-xl inline-block ${feat.color}`}>
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900">{feat.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guidelines Section */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-6">
        <h3 className="text-lg font-extrabold text-gray-900 flex items-center">
          <ShieldCheck className="w-5.5 h-5.5 text-blue-600 mr-2" />
          General Navigation Guidelines
        </h3>

        <div className="text-sm text-gray-600 space-y-4 leading-relaxed font-medium">
          <p>
            1. **Select a Start Point**: All directions listed in the application assume the campus **Main Gate Entrance** as the baseline coordinate.
          </p>
          <p>
            2. **Identify Lifts & Stairs**: For multi-story navigation (e.g. within the Academic Block), use lift nodes (Lift A / Lift B) or stairs at the end of the wings as indicated by the route guide.
          </p>
          <p>
            3. **Review Safety Guidelines**: In case of a fire alarm or emergency evacuation, do NOT use the elevators. Immediately follow local green escape indicators to North-East or South exit gates.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
