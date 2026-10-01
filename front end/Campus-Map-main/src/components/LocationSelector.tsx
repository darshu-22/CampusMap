import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import type { Location } from '../data/locations';
import { searchLocations } from '../utils/searchLocations';

interface LocationSelectorProps {
  label: string;
  selectedId: string;
  onChange: (id: string) => void;
  locationsList: Location[];
  placeholder?: string;
}

export interface SearchOptionItem {
  key: string;
  nodeId: string;
  title: string;
  subtitle?: string;
  image: string;
  isPrimary: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  label,
  selectedId,
  onChange,
  locationsList,
  placeholder = "Select location..."
}) => {
  const selectedLocation = locationsList.find(loc => loc.id === selectedId);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(selectedLocation?.name || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input text if selectedId changes externally
  useEffect(() => {
    if (selectedLocation) {
      // Keep existing searchQuery if it already matches an alias of selected location
      const isCurrentQueryValidAlias = selectedLocation.aliases?.some(
        a => a.toLowerCase().trim() === searchQuery.toLowerCase().trim()
      );
      if (!isCurrentQueryValidAlias) {
        setSearchQuery(selectedLocation.name);
      }
    } else if (!selectedId) {
      setSearchQuery('');
    }
  }, [selectedId, selectedLocation]);

  // Generate individual option items for primary names AND every alias
  const searchableOptions = useMemo(() => {
    const items: SearchOptionItem[] = [];
    const seenKeys = new Set<string>();

    locationsList.forEach(loc => {
      const primary = loc.name.trim();
      const rawAliases = loc.aliases || [];

      // 1. Primary Name Option
      const primaryKey = `${loc.id}__primary__${primary}`;
      if (!seenKeys.has(primaryKey)) {
        seenKeys.add(primaryKey);
        items.push({
          key: primaryKey,
          nodeId: loc.id,
          title: primary,
          image: loc.image,
          isPrimary: true
        });
      }

      // 2. Separate Options for Each Alias
      rawAliases.forEach(alias => {
        const trimmedAlias = alias.trim();
        if (
          trimmedAlias &&
          trimmedAlias !== '.' &&
          trimmedAlias.toLowerCase() !== primary.toLowerCase()
        ) {
          const aliasKey = `${loc.id}__alias__${trimmedAlias}`;
          if (!seenKeys.has(aliasKey)) {
            seenKeys.add(aliasKey);
            items.push({
              key: aliasKey,
              nodeId: loc.id,
              title: trimmedAlias,
              subtitle: `(Main: ${primary})`,
              image: loc.image,
              isPrimary: false
            });
          }
        }
      });
    });

    return items;
  }, [locationsList]);

  // Filter options based on user query
  const filteredOptions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      // When empty, show primary location items first
      return searchableOptions.filter(opt => opt.isPrimary);
    }

    const q = searchQuery.toLowerCase().trim();
    
    // First find matching location nodes via searchLocations
    const matchedLocations = searchLocations(locationsList, searchQuery);
    const matchedNodeIds = new Set(matchedLocations.map(l => l.id));

    // Return options that match the query in title/subtitle OR belong to a matched location node
    return searchableOptions.filter(opt => {
      const titleLower = opt.title.toLowerCase();
      const subtitleLower = (opt.subtitle || '').toLowerCase();
      
      const isDirectMatch = titleLower.includes(q) || subtitleLower.includes(q);
      const isNodeMatched = matchedNodeIds.has(opt.nodeId);
      
      return isDirectMatch || isNodeMatched;
    }).sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Exact match gets top priority
      if (aTitle === q && bTitle !== q) return -1;
      if (bTitle === q && aTitle !== q) return 1;
      
      // Title starting with query gets next priority
      if (aTitle.startsWith(q) && !bTitle.startsWith(q)) return -1;
      if (bTitle.startsWith(q) && !aTitle.startsWith(q)) return 1;

      return 0;
    });
  }, [searchableOptions, locationsList, searchQuery]);

  // Close list on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const selectOption = (option: SearchOptionItem) => {
    onChange(option.nodeId);
    setSearchQuery(option.title);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const clearSelection = () => {
    onChange('');
    setSearchQuery('');
    inputRef.current?.focus();
    setIsOpen(true);
  };

  return (
    <div className="flex-1 relative" ref={containerRef}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
          {selectedLocation?.image ? (
            <img src={selectedLocation.image} alt={selectedLocation.name} className="w-6 h-6 rounded-md object-cover border border-gray-200" />
          ) : (
            <MapPin className="w-5 h-5 text-blue-500" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-30 w-full mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl max-h-72 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-1 duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => {
              const isSelected = opt.nodeId === selectedId && searchQuery.toLowerCase().trim() === opt.title.toLowerCase().trim();
              const isHighlighted = index === highlightedIndex;
              return (
                <li
                  key={opt.key}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors text-base ${
                    isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                  } ${
                    isHighlighted && !isSelected ? 'bg-gray-50 text-slate-800' : ''
                  }`}
                >
                  {opt.image ? (
                    <img src={opt.image} alt={opt.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                  ) : (
                    <MapPin className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="truncate font-semibold text-slate-800">{opt.title}</span>
                    {opt.subtitle && (
                      <span className="text-xs text-slate-400 font-normal truncate">
                        {opt.subtitle}
                      </span>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500 text-center">
              No matching locations found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

