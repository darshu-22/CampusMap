import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '../components/SearchBar';
import { SearchResultCard } from '../components/SearchResultCard';
import { EmptyState } from '../components/EmptyState';
import { searchResults } from '../data/mockData';
import type { SearchResult } from '../types';
import { Layers } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  // Keep internal states in sync with URL search params
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const catParam = searchParams.get('category') || 'All';
    setQuery(qParam);
    setSelectedCategory(catParam);
  }, [searchParams]);

  // Update query params in URL
  const updateParams = (newQuery: string, newCat: string) => {
    const params: { [key: string]: string } = {};
    if (newQuery) params.q = newQuery;
    if (newCat && newCat !== 'All') params.category = newCat;
    setSearchParams(params);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateParams(val, selectedCategory);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    updateParams(query, cat);
  };

  const handleClear = () => {
    setQuery('');
    updateParams('', selectedCategory);
  };

  // Category filters definition
  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Rooms', value: 'Room' }, // classroom & faculty rooms
    { label: 'Labs', value: 'Lab' },
    { label: 'Offices', value: 'Office' },
    { label: 'Facilities', value: 'Facility' },
    { label: 'Buildings', value: 'Building' }
  ];

  // Filtering Logic
  const filteredResults = useMemo(() => {
    return searchResults.filter((item: SearchResult) => {
      // 1. Text Search matching
      const matchesText =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.floor && item.floor.toLowerCase().includes(query.toLowerCase())) ||
        (item.building && item.building.toLowerCase().includes(query.toLowerCase())) ||
        item.category.toLowerCase().includes(query.toLowerCase());

      if (!matchesText) return false;

      // 2. Category Chip matching
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Room') {
        return item.category === 'Classroom' || item.category === 'Faculty Room';
      }
      return item.category === selectedCategory;
    });
  }, [query, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Campus Search
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Instant campus guidance. Search by room name, department office, lifts, or category.
        </p>
      </div>

      {/* Reusable SearchBar */}
      <div className="w-full">
        <SearchBar
          value={query}
          onChange={handleQueryChange}
          onClear={handleClear}
          placeholder="Search rooms, labs, offices, canteens, lifts..."
        />
      </div>

      {/* Category Horizontal Scrolling Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex-shrink-0 text-gray-400 p-1 flex items-center pr-2 border-r border-gray-150 mr-1">
          <Layers className="w-4 h-4 mr-1 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategorySelect(cat.value)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
              selectedCategory === cat.value
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-gray-150 text-gray-600 hover:border-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider pt-2">
        <span>Search Results</span>
        <span>{filteredResults.length} matches</span>
      </div>

      {/* Search Results list */}
      <div className="space-y-4 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                layout
              >
                <SearchResultCard result={item} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
