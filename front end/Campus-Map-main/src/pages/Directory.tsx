import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { directoryAlphabetical } from '../data/mockData';
import { Breadcrumb } from '../components/Breadcrumb';
import { Compass, Building2, Briefcase, ChevronRight } from 'lucide-react';

export const Directory: React.FC = () => {
  const handleLetterClick = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      const yOffset = -80; // offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Department':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">Department</span>;
      case 'Office':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100">Office</span>;
      case 'Facility':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md border border-sky-100">Facility</span>;
      default:
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">Classroom</span>;
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
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      <Breadcrumb items={[{ label: 'Directory' }]} />

      <motion.div variants={itemVariants} className="space-y-2 border-b border-gray-150 pb-5">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Campus Directory</h1>
        <p className="text-gray-500 text-sm font-medium">
          Quickly browse all rooms, labs, canteens, and academic offices by index letters.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sticky Alphabetical Index (Sidebar on Desktop, sticky header on Mobile) */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-48 lg:sticky lg:top-24 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm z-20 flex lg:flex-col items-center justify-start gap-1.5 overflow-x-auto scrollbar-none"
        >
          <span className="hidden lg:block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2 w-full text-left pl-1">
            Jump to index
          </span>
          {directoryAlphabetical.map((group) => (
            <button
              key={group.letter}
              onClick={() => handleLetterClick(group.letter)}
              className="flex-shrink-0 w-10 h-10 lg:w-full lg:h-auto lg:py-2.5 lg:px-4 font-bold text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-150 cursor-pointer lg:text-left flex items-center justify-center lg:justify-between border border-gray-150/40 lg:border-none focus:outline-none"
            >
              <span>{group.letter}</span>
              <span className="hidden lg:inline text-xs text-gray-300">Section {group.letter}</span>
            </button>
          ))}
        </motion.div>

        {/* Directory Listings */}
        <div className="flex-1 w-full space-y-10">
          {directoryAlphabetical.map((group) => (
            <motion.div
              key={group.letter}
              id={`letter-${group.letter}`}
              variants={itemVariants}
              className="space-y-4 scroll-mt-24"
            >
              {/* Group Title Section */}
              <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
                <span className="text-2xl font-black text-blue-600 bg-blue-50 w-12 h-12 flex items-center justify-center rounded-xl">
                  {group.letter}
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  {group.items.length} {group.items.length === 1 ? 'item' : 'items'} listed
                </span>
              </div>

              {/* Group items card grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to={item.link}
                      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                          {item.type === 'Department' ? (
                            <Building2 className="w-4 h-4 text-blue-600" />
                          ) : item.type === 'Office' ? (
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Compass className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 truncate pr-2">
                            {item.name}
                          </h4>
                          {getTypeBadge(item.type)}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
