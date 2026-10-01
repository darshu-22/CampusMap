import React, { useState, useEffect, useMemo } from 'react';
import { campusGraphData } from '../data/campusGraph';
import { getPanoramaNames, setCustomPanoramaName } from '../data/panoramaMetadata';
import { getPanoramaImagePath } from '../utils/panorama';
import { Eye, Save, Download, Navigation, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, Plus, Trash2, Search, X } from 'lucide-react';

interface PanoramaAdminListProps {
  onSelectPano: (panoId: string) => void;
}

interface PanoramaNamingData {
  primary: string;
  aliases: string[];
}

const STORAGE_KEY = 'campus_map_panorama_naming_data_v1';

export const PanoramaAdminList: React.FC<PanoramaAdminListProps> = ({ onSelectPano }) => {
  // Sort all 87 panorama IDs in numerical/alphabetical order
  const sortedKeys = useMemo(() => {
    return Object.keys(campusGraphData.nodes).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, []);

  // Initialize state dictionary for all panoramas
  const [allPanoramaData, setAllPanoramaData] = useState<Record<string, PanoramaNamingData>>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load stored naming data:', e);
    }

    const initialMap: Record<string, PanoramaNamingData> = {};
    sortedKeys.forEach(id => {
      const names = getPanoramaNames(id);
      const primary = names[0] && names[0] !== '.' ? names[0] : '';
      const aliases = names.slice(1);
      initialMap[id] = { primary, aliases };
    });
    return initialMap;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const currentId = sortedKeys[currentIndex] || sortedKeys[0];
  const currentData = allPanoramaData[currentId] || { primary: '', aliases: [] };

  // Current editing state
  const [primaryInput, setPrimaryInput] = useState(currentData.primary);
  const [aliasInputs, setAliasInputs] = useState<string[]>(currentData.aliases);

  // Sync inputs when currentId changes
  useEffect(() => {
    const data = allPanoramaData[currentId] || { primary: '', aliases: [] };
    setPrimaryInput(data.primary);
    setAliasInputs(data.aliases);
  }, [currentId, allPanoramaData]);

  // Save changes to local state & localStorage
  const saveCurrentData = (newPrimary: string, newAliases: string[]) => {
    const cleanedPrimary = newPrimary.trim();
    const cleanedAliases = newAliases.map(a => a.trim()).filter(Boolean);

    const updated = {
      ...allPanoramaData,
      [currentId]: {
        primary: cleanedPrimary,
        aliases: cleanedAliases,
      }
    };
    setAllPanoramaData(updated);

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Failed to persist naming data:', e);
    }

    if (cleanedPrimary) {
      setCustomPanoramaName(currentId, cleanedPrimary);
    }
  };

  // Filtered panoramas for search bar
  const filteredKeys = useMemo(() => {
    if (!filterQuery.trim()) return sortedKeys;
    const q = filterQuery.toLowerCase().trim();
    return sortedKeys.filter(id => {
      const d = allPanoramaData[id] || { primary: '', aliases: [] };
      return id.toLowerCase().includes(q) ||
        d.primary.toLowerCase().includes(q) ||
        d.aliases.some(a => a.toLowerCase().includes(q));
    });
  }, [sortedKeys, filterQuery, allPanoramaData]);

  // Statistics: Completed count
  const completedCount = useMemo(() => {
    return sortedKeys.filter(id => {
      const d = allPanoramaData[id];
      const p = d?.primary?.trim();
      return p && p !== '.' && p !== 'Location not identified';
    }).length;
  }, [sortedKeys, allPanoramaData]);

  const handleNavigate = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < sortedKeys.length) {
      // Auto-save current before moving
      saveCurrentData(primaryInput, aliasInputs);
      setCurrentIndex(newIndex);
      onSelectPano(sortedKeys[newIndex]);
    }
  };

  const handleAddAlias = () => {
    setAliasInputs(prev => [...prev, '']);
  };

  const handleUpdateAlias = (index: number, val: string) => {
    setAliasInputs(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveAlias = (index: number) => {
    setAliasInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (autoAdvance = false) => {
    saveCurrentData(primaryInput, aliasInputs);
    setSaveNotification(`Saved location names for ${currentId}`);
    setTimeout(() => setSaveNotification(null), 2500);

    if (autoAdvance && currentIndex < sortedKeys.length - 1) {
      handleNavigate(currentIndex + 1);
    }
  };

  const handleExportJSON = () => {
    // Auto-save before export
    saveCurrentData(primaryInput, aliasInputs);

    const exportData: Record<string, string | string[]> = {};
    sortedKeys.forEach(id => {
      const d = allPanoramaData[id];
      const p = d?.primary?.trim() || '';
      const a = (d?.aliases || []).map(x => x.trim()).filter(Boolean);

      if (a.length > 0) {
        exportData[id] = [p || '.', ...a];
      } else if (p && p !== '.' && p !== 'Location not identified') {
        exportData[id] = p;
      } else {
        exportData[id] = '.';
      }
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'panorama_location_names.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const isCurrentCompleted = primaryInput.trim().length > 0 && primaryInput.trim() !== '.' && primaryInput.trim() !== 'Location not identified';
  const outgoingEdges = campusGraphData.edges[currentId] || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100 font-sans">
      {/* Top Header & Export Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            Panorama Location Naming Interface
            <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-1 rounded-full font-mono font-semibold">
              Temporary Admin Tool
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manually assign primary display names and unlimited searchable aliases for all 87 campus panoramas.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold border border-blue-500 px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-blue-600/20 self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Export panorama_location_names.json</span>
        </button>
      </div>

      {/* Progress Counter & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Progress Counter Box */}
        <div className="md:col-span-4 bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Naming Progress</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              {completedCount} / {sortedKeys.length} completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              {Math.round((completedCount / sortedKeys.length) * 100)}%
            </span>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Search / Filter Input */}
        <div className="md:col-span-8 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search panorama filename or location name..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-10 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:border-blue-500 transition-all"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {filterQuery && (
            <div className="absolute z-20 w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto p-2 space-y-1">
              {filteredKeys.length > 0 ? (
                filteredKeys.map(id => {
                  const idx = sortedKeys.indexOf(id);
                  const d = allPanoramaData[id];
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        handleNavigate(idx);
                        setFilterQuery('');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="font-mono text-blue-400 font-bold">{id}</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{d?.primary || 'Unidentified'}</span>
                    </button>
                  );
                })
              ) : (
                <div className="text-xs text-slate-500 p-2">No matching panoramas found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveNotification && (
        <div className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Main Form & Image Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
        
        {/* Navigation Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold font-mono">
              Panorama {currentIndex + 1} of {sortedKeys.length}
            </span>
            <span className={`text-xs font-semibold ${isCurrentCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
              ● {isCurrentCompleted ? 'Completed' : 'Pending Name'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Quick Jump:</label>
            <select
              value={currentIndex}
              onChange={(e) => handleNavigate(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500"
            >
              {sortedKeys.map((id, idx) => {
                const d = allPanoramaData[id];
                return (
                  <option key={id} value={idx}>
                    {idx + 1}. {id} {d?.primary ? `(${d.primary})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Content Grid: Left Image Preview / Right Naming Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Visual Image Preview & Node Details */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Filename / ID</span>
                <span className="text-xs font-mono font-bold text-blue-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                  {currentId}
                </span>
              </div>
              
              {/* Actual Image Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
                <img
                  src={getPanoramaImagePath(currentId)}
                  alt={currentId}
                  className="w-full h-52 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <button
                    onClick={() => onSelectPano(currentId)}
                    className="flex items-center gap-1.5 bg-blue-600/90 hover:bg-blue-600 text-white border border-blue-400/40 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview 360° View</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Outgoing Hotspots Reference */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  Hotspots Connected ({outgoingEdges.length})
                </span>
              </div>
              {outgoingEdges.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic p-1">No outgoing hotspots.</p>
              ) : (
                <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                  {outgoingEdges.map((edge, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-[11px] flex items-center justify-between font-mono">
                      <span className="text-slate-300 font-bold">→ {edge.toId}</span>
                      <span className="text-slate-400 truncate max-w-[130px]">"{edge.title || 'Untitled'}"</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Primary Name & Unlimited Aliases Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Primary Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                Primary Name <span className="text-blue-400 font-normal">(Main Display Name)</span>:
              </label>
              <input
                type="text"
                value={primaryInput}
                onChange={(e) => setPrimaryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave(true)}
                placeholder="e.g. Ground Floor Corridor"
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all shadow-inner"
              />
              <p className="text-[11px] text-slate-400">
                This is the main title shown in dropdowns and selection headers.
              </p>
            </div>

            {/* Search Aliases List */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  Search Aliases <span className="text-slate-400 font-normal">({aliasInputs.length})</span>:
                </label>
                <button
                  type="button"
                  onClick={handleAddAlias}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add another name</span>
                </button>
              </div>

              {aliasInputs.length === 0 ? (
                <div className="bg-slate-900/50 border border-dashed border-slate-800 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-500">No additional aliases added yet.</p>
                  <button
                    type="button"
                    onClick={handleAddAlias}
                    className="text-xs text-blue-400 hover:underline mt-1 inline-block"
                  >
                    + Add first alias
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {aliasInputs.map((aliasVal, idx) => (
                    <div key={idx} className="flex items-center gap-2 animate-in fade-in">
                      <span className="text-xs text-slate-500 font-mono w-5 text-right">{idx + 1}.</span>
                      <input
                        type="text"
                        value={aliasVal}
                        onChange={(e) => handleUpdateAlias(idx, e.target.value)}
                        placeholder={`Alias ${idx + 1} (e.g. GF, Main Lobby)`}
                        className="flex-1 bg-slate-900 border border-slate-700 focus:border-blue-500 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAlias(idx)}
                        className="p-2.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 rounded-xl transition-all cursor-pointer"
                        title="Remove alias"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="flex-1 min-w-[160px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSave(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-3 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Save Only</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Navigation: Previous / Next */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => handleNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-900 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-400 font-mono">
            {currentIndex + 1} of {sortedKeys.length}: <span className="text-blue-400 font-bold">{currentId}</span>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate(currentIndex + 1)}
            disabled={currentIndex === sortedKeys.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-900 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
