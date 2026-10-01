import React, { useState } from 'react';
import { PhotoViewer } from '../components/PhotoViewer';
import { getPanoramaNode } from '../utils/panorama';
import type { RouteStep } from '../data/routes';
import { Compass, MapPin } from 'lucide-react';

interface View360PageProps {
  initialPanoId?: string;
}

export const View360Page: React.FC<View360PageProps> = ({
  initialPanoId = 'maingate.jpeg',
}) => {
  const [currentPanoId, setCurrentPanoId] = useState<string>(initialPanoId);

  const currentNode = getPanoramaNode(currentPanoId);
  const locationName = currentNode?.displayName || currentPanoId;

  const currentStep: RouteStep = {
    location: locationName,
    image: currentNode?.imagePath || `/campus/${currentPanoId}`,
    instruction: `Exploring ${locationName} — Click blue hotspot arrows to navigate connected areas`,
    direction: 'none'
  };

  const handleHotspotNavigate = (targetPanoId: string) => {
    setCurrentPanoId(targetPanoId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl flex-shrink-0 bg-blue-50 border border-blue-100 text-blue-600">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-blue-100 text-blue-800">
                360° Open-World Exploration
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 flex-shrink-0 text-blue-600" />
              <span>{locationName}</span>
            </h2>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/60 font-medium">
          Drag to orbit 360° · Scroll to zoom · Click hotspots to move
        </div>
      </div>

      {/* 360 Photo Viewer Container */}
      <div className="w-full">
        <PhotoViewer
          step={currentStep}
          stepNumber={1}
          totalSteps={1}
          locationName={locationName}
          onHotspotNavigate={handleHotspotNavigate}
          allowedTargetPanoId={null}
          isRouteGuided={false}
        />
      </div>
    </div>
  );
};

