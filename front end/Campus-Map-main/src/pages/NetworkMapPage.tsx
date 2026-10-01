import React, { useState } from 'react';
import { VisualCampusMap } from '../components/VisualCampusMap';

interface NetworkMapPageProps {
  initialPanoId?: string;
  fromId?: string;
  toId?: string;
  routePath?: string[];
  onSelectNode?: (nodeId: string) => void;
}

export const NetworkMapPage: React.FC<NetworkMapPageProps> = ({
  initialPanoId = 'maingate.jpeg',
  fromId = '',
  toId = '',
  routePath = [],
  onSelectNode,
}) => {
  const [currentPanoId, setCurrentPanoId] = useState<string>(fromId || initialPanoId);

  React.useEffect(() => {
    setCurrentPanoId(fromId || initialPanoId);
  }, [fromId, initialPanoId]);

  const handleSelectNode = (nodeId: string) => {
    setCurrentPanoId(nodeId);
    if (onSelectNode) {
      onSelectNode(nodeId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <VisualCampusMap
        currentPanoId={currentPanoId}
        fromId={fromId}
        toId={toId}
        routePath={routePath}
        onSelectNode={handleSelectNode}
      />
    </div>
  );
};
