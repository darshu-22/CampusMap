import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Search, Menu, X, Home, BookOpen, Compass as DirIcon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Directory', path: '/directory', icon: DirIcon },
    { name: 'Facilities', path: '/facilities', icon: BookOpen },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-blue-600">
          <Compass className="h-7 w-7 stroke-[2.5]" />
          <span className="font-extrabold text-xl tracking-tight text-gray-900 font-sans">
            Campus<span className="text-blue-600">Nav</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 flex items-center space-x-1.5 py-2 px-1 relative ${
                  active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{link.name}</span>
                {active && (
                  <motion.div
                    layoutId="activeNavBorder"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Search Icon Button */}
        <div className="hidden md:flex items-center">
          <Link
            to="/search"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all duration-200"
            title="Search campus"
          >
            <Search className="h-5 w-5" />
          </Link>
        </div>

        {/* Mobile Hamburger Trigger & Search Trigger */}
        <div className="flex items-center space-x-3 md:hidden">
          <Link
            to="/search"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-slate-50 rounded-xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-gray-150 bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
