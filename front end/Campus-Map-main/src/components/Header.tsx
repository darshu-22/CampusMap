import React, { useState } from 'react';
import { MapPin, HelpCircle, X, Compass, Network, Home as HomeIcon } from 'lucide-react';

export type TabType = 'home' | '360' | 'map';

interface HeaderProps {
  activeTab?: TabType;
  onSelectTab?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'home',
  onSelectTab,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const handleTabClick = (tab: TabType) => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 py-3.5 px-4 sm:px-6 md:px-12 flex flex-wrap justify-between items-center sticky top-0 z-40 shadow-sm gap-y-3">
        {/* Brand Logo - Returns to Home Page */}
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={() => handleTabClick('home')}
        >
          <img 
            src="/atria-logo.png" 
            alt="ATRIA Institute of Technology" 
            className="h-12 md:h-14 w-auto object-contain transition-transform hover:scale-102"
          />
        </div>
        
        {/* Navigation Tabs & Help Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Home Tab */}
          <button
            onClick={() => handleTabClick('home')}
            className={`flex items-center gap-1.5 text-sm py-1.5 px-3.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                : 'text-gray-600 hover:text-blue-600 font-semibold hover:bg-slate-50 border border-gray-200/80'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* 360 View Tab */}
          <button
            onClick={() => handleTabClick('360')}
            className={`flex items-center gap-1.5 text-sm py-1.5 px-3.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === '360'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                : 'text-gray-600 hover:text-blue-600 font-semibold hover:bg-slate-50 border border-gray-200/80'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>360 View</span>
          </button>

          {/* Network Map Tab */}
          <button
            onClick={() => handleTabClick('map')}
            className={`flex items-center gap-1.5 text-sm py-1.5 px-3.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                : 'text-gray-600 hover:text-blue-600 font-semibold hover:bg-slate-50 border border-gray-200/80'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Network Map</span>
          </button>

          {/* Help Button */}
          <button 
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm font-semibold py-1.5 px-3 rounded-full hover:bg-gray-50 border border-gray-200"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>
      </header>

      {showHelp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="text-blue-600" /> Getting Started with CampusNav
            </h3>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>CampusNav is a photo-based step-by-step navigation system designed to help you easily find your way around campus.</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Choose a starting location from the <strong>Source</strong> dropdown.</li>
                <li>Choose a destination from the <strong>Destination</strong> dropdown.</li>
                <li>Click <strong>Find Route</strong> to generate your path.</li>
                <li>Follow the visual campus photos and directional arrows step by step to reach your destination.</li>
              </ol>
            </div>
            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-blue-100"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
