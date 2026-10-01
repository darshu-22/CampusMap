import React, { useState, useEffect } from 'react';
import { campusGraphData } from '../data/campusGraph';
import { xyzToSpherical } from '../utils/xyzToSpherical';
import { validateWtmData, type ValidationReport } from '../utils/validateWtmData';
import { ChevronDown, Bug, CheckCircle, AlertTriangle } from 'lucide-react';

interface DevDebugPanelProps {
  currentPanoId?: string;
  onSelectPano?: (panoId: string) => void;
}

export const DevDebugPanel: React.FC<DevDebugPanelProps> = ({ currentPanoId = '1.jpeg', onSelectPano }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPano, setSelectedPano] = useState(currentPanoId);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);

  useEffect(() => {
    setValidationReport(validateWtmData());
  }, []);

  const nodeKeys = Object.keys(campusGraphData.nodes);
  const activeKey = campusGraphData.nodes[selectedPano] ? selectedPano : nodeKeys[0] || '1.jpeg';

  const edges = campusGraphData.edges[activeKey] ?? [];

  const radToDeg = (r: number) => (r * 180 / Math.PI).toFixed(2);

  const handlePanoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPano(val);
    if (onSelectPano) {
      onSelectPano(val);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs shadow-2xl">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-slate-900/90 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 px-3 py-2 rounded-xl backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <Bug className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">WTM Debug Inspector</span>
        </button>
      ) : (
        <div className="bg-slate-950/95 border border-emerald-500/40 text-slate-200 rounded-2xl w-80 md:w-96 p-4 backdrop-blur-xl max-h-[80vh] overflow-y-auto flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Bug className="w-4 h-4" />
              <span>WTM Canonical Hotspot Debugger</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Validation Status Summary */}
          {validationReport && (
            <div className={`p-2.5 rounded-xl border flex items-start gap-2 ${
              validationReport.isValid
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}>
              {validationReport.isValid ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-bold text-[11px]">
                  {validationReport.isValid
                    ? 'Backend Data Validation: PASSED (1:1 WTM Match)'
                    : 'Backend Data Validation: MISMATCH DETECTED'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {validationReport.totalPanoramas} Nodes · {validationReport.totalHotspots} Backend Navigation Hotspots
                </div>
                {validationReport.errors.map((err, i) => (
                  <div key={i} className="text-[10px] text-rose-300 font-semibold">• {err}</div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
              Select Panorama Node:
            </label>
            <select
              value={activeKey}
              onChange={handlePanoChange}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500"
            >
              {nodeKeys.map(key => (
                <option key={key} value={key}>
                  {key} ({campusGraphData.nodes[key].displayName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5 flex justify-between">
              <span>Outgoing WTM Hotspots ({edges.length}):</span>
              <span className="text-emerald-400">Single Source of Truth</span>
            </div>

            {edges.length === 0 ? (
              <div className="text-slate-500 italic p-2 bg-slate-900/50 rounded-lg">No outgoing hotspots</div>
            ) : (
              <div className="space-y-2">
                {edges.map((edge, i) => {
                  const spherical = xyzToSpherical(edge.position);
                  return (
                    <div key={i} className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-100">
                        <span className="text-emerald-300">→ {edge.toId}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          "{edge.title || 'Untitled'}"
                        </span>
                      </div>

                      <div className="text-[11px] text-amber-400/90 font-mono">
                        XYZ: <span className="text-slate-300">{edge.position}</span>
                      </div>

                      {spherical ? (
                        <div className="text-[10px] text-slate-400 grid grid-cols-2 gap-1 pt-1 border-t border-slate-800/60">
                          <div>
                            Yaw: <span className="text-blue-300 font-semibold">{spherical.yaw.toFixed(4)} rad</span> ({radToDeg(spherical.yaw)}°)
                          </div>
                          <div>
                            Pitch: <span className="text-purple-300 font-semibold">{spherical.pitch.toFixed(4)} rad</span> ({radToDeg(spherical.pitch)}°)
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-rose-400">Invalid WTM XYZ Vector</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

