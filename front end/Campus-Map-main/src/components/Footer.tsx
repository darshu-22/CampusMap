import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-150 py-12 px-4 sm:px-6 lg:px-8 mt-auto pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center space-x-2 text-blue-600">
            <Compass className="h-6 w-6 stroke-[2.5]" />
            <span className="font-extrabold text-lg text-gray-900">
              Campus<span className="text-blue-600">Nav</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed">
            Helping students, faculty, and visitors find their way around the campus with ease and speed.
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/directory" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Campus Directory
              </Link>
            </li>
            <li>
              <Link to="/facilities" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Campus Facilities
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                About Navigation
              </Link>
            </li>
          </ul>
        </div>

        {/* Academic Blocks Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Quick Navigation
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/building/academic-block" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Academic Block
              </Link>
            </li>
            <li>
              <Link to="/building/administration-block" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Administration Building
              </Link>
            </li>
            <li>
              <Link to="/building/central-annex" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Central Annex & Library
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Search Room or Office
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Emergency & Support
          </h4>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="w-4.5 h-4.5 mr-2 text-slate-400" />
            <span>+91 80 2345 6789</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="w-4.5 h-4.5 mr-2 text-slate-400" />
            <span>support@campusnav.edu</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4.5 h-4.5 mr-2 text-slate-400" />
            <span>12th Main Road, Campus Grounds</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Campus Navigator. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-medium">Built with React, TypeScript & Tailwind CSS</p>
      </div>
    </footer>
  );
};
