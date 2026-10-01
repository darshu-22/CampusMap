import React, { useState } from 'react';
import { RouteSearch } from '../components/RouteSearch';
import { RouteSteps } from '../components/RouteSteps';
import { PhotoViewer } from '../components/PhotoViewer';
import { RouteThumbnails } from '../components/RouteThumbnails';
import { ArrivalMessage } from '../components/ArrivalMessage';
import { DevDebugPanel } from '../components/DevDebugPanel';
import { PanoramaAdminList } from '../components/PanoramaAdminList';
import { RouteOptions } from '../components/RouteOptions';
import { getPanoramaNode } from '../utils/panorama';
import type { RouteStep } from '../data/routes';
import { getRouteOptions, type RouteOption } from '../utils/routing';
import type { ActiveRouteInfo } from '../App';
import { AlertCircle, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { getLocations } from '../data/locations';


interface HomeProps {
  activeRoute?: ActiveRouteInfo | null;
  onRouteCalculated?: (route: ActiveRouteInfo | null) => void;
  onClearRoute?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  activeRoute,
  onRouteCalculated,
  onClearRoute,
}) => {
  const [fromId, setFromId] = useState(activeRoute ? activeRoute.fromId : '');
  const [toId, setToId] = useState(activeRoute ? activeRoute.toId : '');
  const [routeSteps, setRouteSteps] = useState<RouteStep[] | null>(activeRoute ? activeRoute.routeSteps : null);
  const [activePath, setActivePath] = useState<string[] | null>(activeRoute ? activeRoute.path : null);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('lift');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(!!activeRoute);

  React.useEffect(() => {
    if (activeRoute) {
      setFromId(activeRoute.fromId);
      setToId(activeRoute.toId);
      setRouteSteps(activeRoute.routeSteps);
      setActivePath(activeRoute.path);
      setCurrentStepIndex(0);
      setHasSearched(true);
      const options = getRouteOptions(activeRoute.fromId, activeRoute.toId);
      setRouteOptions(options);
      if (activeRoute.selectedOptionId) {
        setSelectedOptionId(activeRoute.selectedOptionId);
      } else if (options.length > 0) {
        setSelectedOptionId(options[0].id);
      }
    }
  }, [activeRoute]);

  const handleSearch = () => {
    if (!fromId || !toId) return;

    setError(null);
    setHasSearched(true);
    
    if (fromId === toId) {
      setError("Starting point and destination cannot be the same. Please choose different locations.");
      setRouteSteps(null);
      setActivePath(null);
      setRouteOptions([]);
      if (onClearRoute) onClearRoute();
      return;
    }

    const options = getRouteOptions(fromId, toId);
    if (options && options.length > 0) {
      setRouteOptions(options);
      const defaultOption = options[0];
      setSelectedOptionId(defaultOption.id);
      setRouteSteps(defaultOption.routeSteps);
      setActivePath(defaultOption.path);
      setCurrentStepIndex(0);
      if (onRouteCalculated) {
        onRouteCalculated({
          path: defaultOption.path,
          fromId,
          toId,
          routeSteps: defaultOption.routeSteps,
          selectedOptionId: defaultOption.id
        });
      }
    } else {
      setRouteSteps(null);
      setActivePath(null);
      setRouteOptions([]);
      setError("We couldn't find a navigation route between these locations. Please choose another destination.");
      if (onClearRoute) onClearRoute();
    }
  };

  const handleSelectRouteOption = (option: RouteOption) => {
    setSelectedOptionId(option.id);
    setRouteSteps(option.routeSteps);
    setActivePath(option.path);
    setCurrentStepIndex(0);
    if (onRouteCalculated) {
      onRouteCalculated({
        path: option.path,
        fromId,
        toId,
        routeSteps: option.routeSteps,
        selectedOptionId: option.id
      });
    }
  };

  const handleNext = () => {
    if (routeSteps && currentStepIndex < routeSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (routeSteps && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setFromId('');
    setToId('');
    setRouteSteps(null);
    setActivePath(null);
    setRouteOptions([]);
    setCurrentStepIndex(0);
    setError(null);
    setHasSearched(false);
    if (onClearRoute) onClearRoute();
  };

  const handleHotspotNavigate = (targetPanoId: string) => {
    if (!activePath || activePath.length <= 1) return;

    if (currentStepIndex < activePath.length - 1) {
      const nextExpected = activePath[currentStepIndex + 1];
      if (nextExpected && targetPanoId === nextExpected) {
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  };

  const activeStep = routeSteps ? routeSteps[currentStepIndex] : null;
  const destinationNode = getPanoramaNode(toId);
  const destinationLocation = destinationNode
    ? { name: destinationNode.displayName }
    : getLocations().find(loc => loc.id === toId);
  const isArrivalState = routeSteps && currentStepIndex === routeSteps.length - 1;

  const isRouteGuided = !!(activePath && activePath.length > 1);
  let allowedTargetPanoId: string | null = null;
  if (isRouteGuided && activePath) {
    if (currentStepIndex < activePath.length - 1) {
      allowedTargetPanoId = activePath[currentStepIndex + 1];
    } else {
      allowedTargetPanoId = null;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Your Way Around Campus
        </h1>
        <p className="text-base md:text-lg text-slate-500 leading-relaxed font-normal">
          Select your starting point and destination to get step-by-step directions.
        </p>
      </div>

      {/* From / To Search Bar Area */}
      <div className="w-full">
        <RouteSearch
          fromId={fromId}
          toId={toId}
          setFromId={setFromId}
          setToId={setToId}
          onSearch={handleSearch}
          locationsList={getLocations()}
        />
      </div>

      {/* Developer/Admin Location Identifier Manager */}
      <div className="w-full">
        <PanoramaAdminList
          onSelectPano={(nodeId: string) => {
            setFromId(nodeId);
            const freeRoamRoute = [
              {
                location: getPanoramaNode(nodeId)?.displayName || nodeId,
                image: getPanoramaNode(nodeId)?.imagePath || `/campus/${nodeId}`,
                instruction: `Exploring ${getPanoramaNode(nodeId)?.displayName || nodeId}`,
                direction: 'none' as const
              }
            ];
            setRouteSteps(freeRoamRoute);
            setActivePath([nodeId]);
            setRouteOptions([]);
            setCurrentStepIndex(0);
            setHasSearched(true);
            setError(null);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-rose-50 border border-rose-150 rounded-2xl p-5 flex items-start gap-3.5 text-rose-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base text-rose-950">Route not available</h4>
              <p className="text-sm text-rose-700 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State before search */}
        {!hasSearched && !error && (
          <div className="text-center py-16 px-4 max-w-lg mx-auto bg-slate-50/50 border border-slate-100 rounded-3xl space-y-4 shadow-inner">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-2">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Where would you like to go?</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              Select your starting point and destination to begin visual photo navigation.
            </p>
          </div>
        )}

        {/* Route Navigation View */}
        {routeSteps && activeStep && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Route Options (if multiple routes exist) */}
            {routeOptions.length > 1 && (
              <RouteOptions
                options={routeOptions}
                selectedOptionId={selectedOptionId}
                onSelectOption={handleSelectRouteOption}
              />
            )}
            
            {/* From & To Image Cards Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FROM Location Card */}
              <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <img 
                  src={getPanoramaNode(fromId)?.imagePath || `/campus/${fromId}`} 
                  alt="From Location"
                  className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0 shadow-inner"
                />
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    Start (From)
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug">
                    {getPanoramaNode(fromId)?.displayName || fromId}
                  </h4>
                </div>
              </div>

              {/* TO Location Card */}
              <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <img 
                  src={getPanoramaNode(toId)?.imagePath || `/campus/${toId}`} 
                  alt="To Location"
                  className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0 shadow-inner"
                />
                <div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
                    Destination (To)
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug">
                    {getPanoramaNode(toId)?.displayName || toId}
                  </h4>
                </div>
              </div>
            </div>

            {/* Split layout: Steps (left) + Photo (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Step List */}
              <div className="lg:col-span-4 order-2 lg:order-1 h-full">
                <RouteSteps
                  steps={routeSteps}
                  currentStepIndex={currentStepIndex}
                  onStepSelect={setCurrentStepIndex}
                  locationsList={getLocations()}
                />
              </div>

              {/* Right Side: Photo Viewer & Controls */}
              <div className="lg:col-span-8 order-1 lg:order-2 space-y-4">
                <PhotoViewer
                  step={activeStep}
                  stepNumber={currentStepIndex + 1}
                  totalSteps={routeSteps.length}
                  locationName={activeStep.location}
                  onHotspotNavigate={handleHotspotNavigate}
                  allowedTargetPanoId={allowedTargetPanoId}
                  isRouteGuided={isRouteGuided}
                />

                {/* Photo Thumbnails */}
                <RouteThumbnails
                  steps={routeSteps}
                  currentStepIndex={currentStepIndex}
                  onStepSelect={setCurrentStepIndex}
                />

                {/* Step controls */}
                <div className="flex justify-between items-center bg-white border border-gray-150 p-4 rounded-2xl shadow-sm">
                  <button
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-slate-500 rounded-xl font-semibold text-slate-700 text-sm transition-all cursor-pointer select-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="text-xs font-bold text-slate-500 tracking-widest uppercase">
                    Step {currentStepIndex + 1} / {routeSteps.length}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentStepIndex === routeSteps.length - 1}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-100 disabled:text-slate-400 rounded-xl font-semibold text-sm transition-all cursor-pointer select-none shadow-md shadow-blue-600/5 disabled:shadow-none"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Arrival Success State Banner */}
            {isArrivalState && destinationLocation && (
              <div className="pt-4 border-t border-gray-100">
                <ArrivalMessage
                  destinationName={destinationLocation.name}
                  onRestart={handleRestart}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Developer WTM Diagnostic Debug Inspector */}
      <DevDebugPanel
        currentPanoId={activeStep ? activeStep.image.replace('/campus/', '') : '1.jpeg'}
        onSelectPano={(panoId) => {
          setFromId(panoId);
        }}
      />
    </div>
  );
};
