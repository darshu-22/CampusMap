import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Compass, BookOpen } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Directory', path: '/directory', icon: Compass },
    { label: 'Facilities', path: '/facilities', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-gray-150/50 shadow-2xl rounded-2xl p-2.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all duration-200 ${
              active
                ? 'text-blue-600 font-bold scale-105'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
