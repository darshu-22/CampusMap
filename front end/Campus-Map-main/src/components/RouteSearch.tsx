import React from 'react';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import type { Location } from '../data/locations';

interface RouteSearchProps {
  fromId: string;
  toId: string;
  setFromId: (id: string) => void;
  setToId: (id: string) => void;
  onSearch: () => void;
  locationsList: Location[];
}

export const RouteSearch: React.FC<RouteSearchProps> = ({
  fromId,
  toId,
  setFromId,
  setToId,
  onSearch,
  locationsList
}) => {
  const handleSwap = () => {
    const temp = fromId;
    setFromId(toId);
    setToId(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSearch} className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-lg p-6 max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 lg:gap-6">
        
        {/* FROM Selector */}
        <LocationSelector
          label="Source"
          selectedId={fromId}
          onChange={setFromId}
          locationsList={locationsList}
          placeholder="Choose source..."
        />

        {/* Swap Button */}
        <div className="flex items-center justify-center -my-2 lg:my-0 lg:pb-3.5">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap locations"
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <ArrowLeftRight className="w-5 h-5 rotate-90 lg:rotate-0" />
          </button>
        </div>

        {/* TO Selector */}
        <LocationSelector
          label="Destination"
          selectedId={toId}
          onChange={setToId}
          locationsList={locationsList}
          placeholder="Choose destination..."
        />

        {/* Find Route Button */}
        <div className="lg:pb-0.5">
          <button
            type="submit"
            disabled={!fromId || !toId}
            className={`w-full lg:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/10 cursor-pointer h-[54px]`}
          >
            <span>Find Route</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
      </div>
    </form>
  );
};
