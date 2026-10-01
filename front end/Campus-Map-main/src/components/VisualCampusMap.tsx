import React, { useState, useMemo } from 'react';
import { campusGraphData } from '../data/campusGraph';
import { getPanoramaDisplayName } from '../utils/panorama';
import { MapPin, Layers, Compass, ArrowRight } from 'lucide-react';

interface VisualCampusMapProps {
  currentPanoId: string;
  fromId?: string;
  toId?: string;
  routePath?: string[]; // Array of node IDs in shortest path order
  onSelectNode: (nodeId: string) => void;
}

// Floor / Zone categorization based on node ID patterns
type FloorCategory = 'all' | 'ground' | '1st' | '2nd' | '3rd' | '4th' | '5th_6th' | 'basement';

function getFloorCategory(nodeId: string): FloorCategory {
  const id = nodeId.toLowerCase();
  if (id.startsWith('bf') || id.includes('examsection')) return 'basement';
  if (id.startsWith('6th')) return '5th_6th';
  if (id.startsWith('5f') || id.includes('mca5') || id === '16.jpeg' || id === '17.jpeg' || id === '18.jpeg') return '5th_6th';
  if (id.startsWith('4f') || id.includes('mba') || id === '13.jpeg' || id === '14.jpeg' || id === '15.jpeg' || id.includes('4thfloor')) return '4th';
  if (id.startsWith('3f') || id === '10.jpeg' || id === '11.jpeg' || id === '12.jpeg' || id.includes('3ndfloor')) return '3rd';
  if (id.startsWith('2f') || id === '7.jpeg' || id === '8.jpeg' || id === '9.jpeg') return '2nd';
  if (id.startsWith('ff') || id.startsWith('1f') || id === '1.jpeg' || id === '2.jpeg' || id === '3.jpeg' || id === '4.jpeg' || id === '5.jpeg' || id === '6.jpeg' || id.includes('vyom')) return '1st';
  return 'ground'; // Default to Ground / Outdoor
}

// 2D positions for schematic node placement on 1000x700 SVG canvas
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  // Ground & Outdoor
  'outsideclg.jpeg': { x: 80, y: 560 },
  'maingate.jpeg': { x: 180, y: 560 },
  'praking.jpeg': { x: 180, y: 650 },
  'glassbuildingwalkingpath.jpeg': { x: 290, y: 560 },
  'au.jpeg': { x: 400, y: 560 },
  'au2.jpeg': { x: 400, y: 650 },
  'adminblock.jpeg': { x: 520, y: 560 },
  'adminblockinside.jpeg': { x: 520, y: 470 },
  'principal.jpeg': { x: 620, y: 470 },
  'SWO.jpeg': { x: 620, y: 560 },
  'staircase2.jpeg': { x: 520, y: 650 },
  'feecounter.jpeg': { x: 640, y: 650 },
  'canteenentrance.jpeg': { x: 750, y: 650 },
  'outsr.jpeg': { x: 860, y: 650 },
  'sportsroom.jpeg': { x: 860, y: 570 },
  'naveenshop.jpeg': { x: 930, y: 650 },
  'mess.jpeg': { x: 930, y: 570 },
  'machineshoplab.jpeg': { x: 750, y: 560 },
  'machinelabinterior.jpeg': { x: 750, y: 480 },
  'boyshostel.jpeg': { x: 750, y: 400 },
  'seminarhallentrance.jpeg': { x: 630, y: 400 },
  'seminarhall.jpeg': { x: 530, y: 400 },
  'admissions.jpeg': { x: 420, y: 470 },
  'admissionstair1.jpeg': { x: 320, y: 470 },
  'GF2L.jpeg': { x: 220, y: 470 },
  'GFstair3.jpeg': { x: 140, y: 470 },
  'GFLEhub.jpeg': { x: 80, y: 470 },
  'NSOJpoint.jpeg': { x: 80, y: 390 },

  // 1st Floor
  '1.jpeg': { x: 140, y: 350 },
  '2.jpeg': { x: 230, y: 350 },
  '3.jpeg': { x: 230, y: 270 },
  '4.jpeg': { x: 340, y: 350 },
  '5.jpeg': { x: 450, y: 350 },
  '6.jpeg': { x: 450, y: 270 },
  '1Fdeadend.jpeg': { x: 340, y: 270 },
  'FF2L.jpeg': { x: 550, y: 350 },
  'FFstair3.jpeg': { x: 660, y: 350 },
  'FFmidpoint.jpeg': { x: 770, y: 350 },
  'FFLEhub.jpeg': { x: 870, y: 350 },
  'VYOMlab1.jpeg': { x: 770, y: 270 },
  'VYOMlab2.jpeg': { x: 870, y: 270 },

  // 2nd Floor
  '7.jpeg': { x: 450, y: 230 },
  '8.jpeg': { x: 550, y: 230 },
  '9.jpeg': { x: 550, y: 160 },
  '2Fppathway.jpeg': { x: 340, y: 230 },
  '2F2L.jpeg': { x: 660, y: 230 },
  '2Fstair1.jpeg': { x: 240, y: 230 },
  '2Fstair3.jpeg': { x: 770, y: 230 },
  '2FLEhub.jpeg': { x: 870, y: 230 },
  '2Fmidpoint.jpeg': { x: 770, y: 160 },
  '3ndfloorentrance.jpeg': { x: 140, y: 230 },

  // 3rd Floor
  '10.jpeg': { x: 550, y: 180 },
  '11.jpeg': { x: 650, y: 180 },
  '12.jpeg': { x: 650, y: 110 },
  '3Fpathway.jpeg': { x: 450, y: 180 },
  '3F2L.jpeg': { x: 750, y: 180 },
  '3FentraNCE.jpeg': { x: 350, y: 180 },
  '3Fstair1.jpeg': { x: 250, y: 180 },
  '3Fstair3.jpeg': { x: 850, y: 180 },
  '3FLEhub.jpeg': { x: 930, y: 180 },
  '3Fmidpoint.jpeg': { x: 850, y: 110 },
  '3Fstair1pWLg4.jpeg': { x: 160, y: 180 },

  // 4th Floor
  '13.jpeg': { x: 650, y: 130 },
  '14.jpeg': { x: 740, y: 130 },
  '15.jpeg': { x: 740, y: 60 },
  '4thfloorabup.jpeg': { x: 350, y: 130 },
  'MBAdiscussionroom.jpeg': { x: 450, y: 130 },
  'MBAcontinue.jpeg': { x: 550, y: 130 },
  'mbastair1.jpeg': { x: 250, y: 130 },
  '4F2L.jpeg': { x: 830, y: 130 },
  '4FLEhub.jpeg': { x: 910, y: 130 },
  '4Fmidpoint.jpeg': { x: 830, y: 60 },
  '4Fstair3.jpeg': { x: 910, y: 60 },

  // 5th & 6th Floor
  '16.jpeg': { x: 650, y: 80 },
  '17.jpeg': { x: 750, y: 80 },
  '18.jpeg': { x: 750, y: 30 },
  '5Fpathway.jpeg': { x: 550, y: 80 },
  '5F2L.jpeg': { x: 830, y: 80 },
  'MCA5.jpeg': { x: 450, y: 80 },
  'stair1tomca.jpeg': { x: 350, y: 80 },
  '6thfloor.jpeg': { x: 250, y: 80 },
  '5FLEhub.jpeg': { x: 910, y: 80 },
  '5Fmidpoint.jpeg': { x: 830, y: 30 },
  '5Fstair3.jpeg': { x: 910, y: 30 },

  // Basement
  'BF2L.jpeg': { x: 250, y: 650 },
  'BFstair3.jpeg': { x: 140, y: 650 },
  'examsectionhub.jpeg': { x: 340, y: 650 },
};

export const VisualCampusMap: React.FC<VisualCampusMapProps> = ({
  currentPanoId,
  fromId,
  toId,
  routePath = [],
  onSelectNode,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<FloorCategory>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const allNodeKeys = useMemo(() => Object.keys(campusGraphData.nodes), []);

  // Filter nodes based on selected floor
  const visibleNodeKeys = useMemo(() => {
    if (selectedFloor === 'all') return allNodeKeys;
    return allNodeKeys.filter(key => getFloorCategory(key) === selectedFloor);
  }, [allNodeKeys, selectedFloor]);

  // Set of route nodes and edges for quick checking
  const routeNodeSet = useMemo(() => new Set(routePath), [routePath]);
  
  const routeEdgeSet = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < routePath.length - 1; i++) {
      set.add(`${routePath[i]}->${routePath[i + 1]}`);
      set.add(`${routePath[i + 1]}->${routePath[i]}`); // bi-directional
    }
    return set;
  }, [routePath]);

  // Extract edges to render on SVG
  const renderedEdges = useMemo(() => {
    const edgeList: { id: string; from: string; to: string; x1: number; y1: number; x2: number; y2: number; isRoute: boolean }[] = [];
    const processedPairs = new Set<string>();

    allNodeKeys.forEach(fromId => {
      const fromPos = NODE_POSITIONS[fromId] || { x: 500, y: 350 };
      const edges = campusGraphData.edges[fromId] || [];

      edges.forEach(edge => {
        const toId = edge.toId;
        const pairKey = [fromId, toId].sort().join('--');
        if (processedPairs.has(pairKey)) return;
        processedPairs.add(pairKey);

        const toPos = NODE_POSITIONS[toId] || { x: 500, y: 350 };
        const isRoute = routeEdgeSet.has(`${fromId}->${toId}`) || routeEdgeSet.has(`${toId}->${fromId}`);

        // If filtering by floor, show edge if either endpoint is visible or if in 'all' floor mode
        if (selectedFloor === 'all' || getFloorCategory(fromId) === selectedFloor || getFloorCategory(toId) === selectedFloor) {
          edgeList.push({
            id: pairKey,
            from: fromId,
            to: toId,
            x1: fromPos.x,
            y1: fromPos.y,
            x2: toPos.x,
            y2: toPos.y,
            isRoute,
          });
        }
      });
    });

    return edgeList;
  }, [allNodeKeys, routeEdgeSet, selectedFloor]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-100 font-sans">
      {/* Top Header & Floor Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-400">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              Visual Campus Network Map
              <span className="text-xs font-normal text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800">
                Single Source Graph ({allNodeKeys.length} Nodes)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 2D schematic of campus layout & floor network graph
            </p>
          </div>
        </div>

        {/* Floor Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
          <Layers className="w-4 h-4 text-slate-500 ml-1 mr-1 flex-shrink-0" />
          {(
            [
              { id: 'all', label: 'All Campus' },
              { id: 'ground', label: 'Ground / Outdoor' },
              { id: '1st', label: '1st Floor' },
              { id: '2nd', label: '2nd Floor' },
              { id: '3rd', label: '3rd Floor' },
              { id: '4th', label: '4th Floor' },
              { id: '5th_6th', label: '5th & 6th Floor' },
              { id: 'basement', label: 'Basement' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFloor(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedFloor === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* Background Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Interactive SVG Layer */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full max-h-[600px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow Filter for Active Route */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Pulse Animation for Current Location Marker */}
            <style>{`
              @keyframes dash {
                to { stroke-dashoffset: -30; }
              }
              .animated-route {
                stroke-dasharray: 8 6;
                animation: dash 1.5s linear infinite;
              }
            `}</style>
          </defs>

          {/* Render Graph Edges (Connections) */}
          <g id="graph-edges">
            {renderedEdges.map(edge => (
              <g key={edge.id}>
                {/* Background Shadow Line */}
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke={edge.isRoute ? '#1d4ed8' : '#334155'}
                  strokeWidth={edge.isRoute ? 6 : 2.5}
                  strokeLinecap="round"
                  opacity={edge.isRoute ? 0.9 : 0.6}
                />
                {/* Active Route Highlight Overlay */}
                {edge.isRoute && (
                  <line
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke="#60a5fa"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="animated-route"
                    filter="url(#glow)"
                  />
                )}
              </g>
            ))}
          </g>

          {/* Render Graph Nodes */}
          <g id="graph-nodes">
            {visibleNodeKeys.map(nodeId => {
              const pos = NODE_POSITIONS[nodeId] || { x: 500, y: 350 };
              const nodeData = campusGraphData.nodes[nodeId];
              const displayName = nodeData ? nodeData.displayName : nodeId;

              const isCurrent = nodeId === currentPanoId;
              const isFrom = nodeId === fromId;
              const isTo = nodeId === toId;
              const isRouteNode = routeNodeSet.has(nodeId);
              const isHovered = hoveredNode === nodeId;

              // Node radius & color hierarchy
              let radius = 10;
              let fill = '#1e293b';
              let stroke = '#64748b';
              let strokeWidth = 2;

              if (isCurrent) {
                radius = 16;
                fill = '#2563eb';
                stroke = '#60a5fa';
                strokeWidth = 4;
              } else if (isFrom) {
                radius = 14;
                fill = '#16a34a';
                stroke = '#4ade80';
                strokeWidth = 3.5;
              } else if (isTo) {
                radius = 14;
                fill = '#dc2626';
                stroke = '#f87171';
                strokeWidth = 3.5;
              } else if (isRouteNode) {
                radius = 12;
                fill = '#1d4ed8';
                stroke = '#93c5fd';
                strokeWidth = 3;
              } else if (isHovered) {
                radius = 13;
                fill = '#38bdf8';
                stroke = '#ffffff';
                strokeWidth = 3;
              }

              return (
                <g
                  key={nodeId}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => onSelectNode(nodeId)}
                  onMouseEnter={() => setHoveredNode(nodeId)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Current Location Pulsing Outer Ring */}
                  {isCurrent && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      opacity="0.7"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Circle Node */}
                  <circle
                    r={radius}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-150 shadow-lg"
                  />

                  {/* Icon or Step Indicator inside Circle */}
                  {isFrom && <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">S</text>}
                  {isTo && <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">D</text>}
                  {isCurrent && !isFrom && !isTo && (
                    <circle r="5" fill="#ffffff" />
                  )}

                  {/* Label Text below Node */}
                  <text
                    x="0"
                    y={radius + 14}
                    textAnchor="middle"
                    fill={isCurrent || isFrom || isTo || isHovered ? '#ffffff' : '#94a3b8'}
                    fontSize={isCurrent || isFrom || isTo ? '12' : '10'}
                    fontWeight={isCurrent || isFrom || isTo || isHovered ? 'bold' : '500'}
                    className="pointer-events-none drop-shadow-md select-none"
                  >
                    {displayName.length > 18 ? displayName.substring(0, 16) + '…' : displayName}
                  </text>

                  {/* Start / Destination / Current Status Pill Badges */}
                  {isCurrent && (
                    <g transform="translate(0, -26)">
                      <rect x="-42" y="-12" width="84" height="20" rx="10" fill="#2563eb" stroke="#60a5fa" strokeWidth="1.5" />
                      <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">YOU ARE HERE</text>
                    </g>
                  )}
                  {isFrom && !isCurrent && (
                    <g transform="translate(0, -24)">
                      <rect x="-26" y="-11" width="52" height="18" rx="9" fill="#16a34a" stroke="#4ade80" strokeWidth="1.5" />
                      <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">START</text>
                    </g>
                  )}
                  {isTo && !isCurrent && (
                    <g transform="translate(0, -24)">
                      <rect x="-26" y="-11" width="52" height="18" rx="9" fill="#dc2626" stroke="#f87171" strokeWidth="1.5" />
                      <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">DEST</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hovered Node Tooltip Overlay */}
        {hoveredNode && campusGraphData.nodes[hoveredNode] && (
          <div className="absolute top-4 left-4 z-20 bg-slate-900/95 border border-slate-700 text-slate-100 px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">
                {campusGraphData.nodes[hoveredNode].displayName}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                ID: {hoveredNode} · {campusGraphData.edges[hoveredNode]?.length || 0} Outgoing Hotspots
              </div>
            </div>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
              Click to Open 360°
            </span>
          </div>
        )}
      </div>

      {/* Map Legend & Active Route Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-blue-400 animate-pulse inline-block" />
            <span className="text-slate-300 font-medium">Current 360° Position</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-emerald-400 inline-block" />
            <span className="text-slate-300 font-medium">Start Point</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-red-400 inline-block" />
            <span className="text-slate-300 font-medium">Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 bg-blue-500 rounded-full inline-block" />
            <span className="text-slate-300 font-medium">Calculated Route Path</span>
          </div>
        </div>

        {routePath.length > 0 && (
          <div className="flex items-center gap-2 text-slate-300 font-medium bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>Route Steps:</span>
            <span className="text-blue-400 font-bold">{routePath.length} nodes</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 truncate max-w-[200px]">
              {getPanoramaDisplayName(routePath[0])} → {getPanoramaDisplayName(routePath[routePath.length - 1])}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
