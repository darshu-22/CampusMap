import { campusGraphData } from '../data/campusGraph';
import type { RouteStep } from '../data/routes';

export type Direction = 'up' | 'down' | 'left' | 'right' | 'straight' | 'none';

// Virtual Pair 1 Lift Edges between Pair 1 panoramas
export const PAIR_1_LIFT_EDGES: Record<string, { toId: string; title: string; weight: number; position: string; icon: string }[]> = {
  'adminblockinside.jpeg': [
    { toId: 'admissions.jpeg', title: 'Take Pair 1 Lift to 1st Floor', weight: 0.5, position: '380, -100, 0', icon: 'chevronforward.png' }
  ],
  'admissions.jpeg': [
    { toId: '3ndfloorentrance.jpeg', title: 'Take Pair 1 Lift to 2nd Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: 'adminblockinside.jpeg', title: 'Take Pair 1 Lift to Ground Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' }
  ],
  '3ndfloorentrance.jpeg': [
    { toId: '3FentraNCE.jpeg', title: 'Take Pair 1 Lift to 3rd Floor', weight: 0.5, position: '-380, -100, 0', icon: 'chevronforward.png' },
    { toId: 'admissions.jpeg', title: 'Take Pair 1 Lift to 1st Floor', weight: 0.5, position: '-380, -100, 0', icon: 'chevronforward.png' }
  ],
  '3FentraNCE.jpeg': [
    { toId: '4thfloorabup.jpeg', title: 'Take Pair 1 Lift to 4th Floor', weight: 0.5, position: '0, -100, 380', icon: 'chevronforward.png' },
    { toId: '3ndfloorentrance.jpeg', title: 'Take Pair 1 Lift to 2nd Floor', weight: 0.5, position: '0, -100, 380', icon: 'chevronforward.png' }
  ],
  '4thfloorabup.jpeg': [
    { toId: 'MCA5.jpeg', title: 'Take Pair 1 Lift to 5th Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '3FentraNCE.jpeg', title: 'Take Pair 1 Lift to 3rd Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' }
  ],
  'MCA5.jpeg': [
    { toId: '4thfloorabup.jpeg', title: 'Take Pair 1 Lift to 4th Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' }
  ]
};

// Virtual Pair 2 Lift Edges between 2L panoramas (BF2L, GF2L, FF2L, 2F2L, 3F2L, 4F2L, 5F2L)
// Floor-specific positions for virtual Pair 2 Lift hotspot:
// - BF2L.jpeg: Unchanged (0, -100, 380)
// - GF2L.jpeg: Baseline (0, -100, 380)
// - FF2L.jpeg: 180deg reversal (0, -100, -380)
// - 2F2L.jpeg: 90deg right shift (380, -100, 0)
// - 3F2L.jpeg: 180deg reversal (0, -100, -380)
// - 4F2L.jpeg: 90deg right shift (380, -100, 0)
// - 5F2L.jpeg: 180deg reversal (0, -100, -380)
export const PAIR_2_LIFT_EDGES: Record<string, { toId: string; title: string; weight: number; position: string; icon: string }[]> = {
  'BF2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5, position: '0, -100, 380', icon: 'chevronforward.png' },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5, position: '0, -100, 380', icon: 'chevronforward.png' }
  ],
  'GF2L.jpeg': [
    { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' }
  ],
  'FF2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' }
  ],
  '2F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5, position: '-380, -100, 0', icon: 'chevronforward.png' },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 0.5, position: '-380, -100, 0', icon: 'chevronforward.png' },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5, position: '-380, -100, 0', icon: 'chevronforward.png' }
  ],
  '3F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' }
  ],
  '4F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5, position: '-380, -100, 0', icon: 'chevronforward.png' },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5, position: '-380, -100, 0', icon: 'chevronforward.png' }
  ],
  '5F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' },
    { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', weight: 0.5, position: '0, -100, -380', icon: 'chevronforward.png' }
  ]
};

export function is1LLiftEdge(prevId: string, currId: string): boolean {
  return (PAIR_1_LIFT_EDGES[prevId] || []).some(e => e.toId === currId);
}

export function is2LLiftEdge(prevId: string, currId: string): boolean {
  return (PAIR_2_LIFT_EDGES[prevId] || []).some(e => e.toId === currId);
}

export function isLiftEdge(prevId: string, currId: string): boolean {
  return is1LLiftEdge(prevId, currId) || is2LLiftEdge(prevId, currId);
}

export function pathUsesLift(path: string[]): boolean {
  if (!path || path.length < 2) return false;
  for (let i = 1; i < path.length; i++) {
    if (isLiftEdge(path[i - 1], path[i])) return true;
  }
  return false;
}

export interface RouteOption {
  id: 'lift' | 'stairs';
  title: string;
  subtitle: string;
  type: 'lift' | 'stairs';
  path: string[];
  routeSteps: RouteStep[];
}

/**
 * Dijkstra's shortest path algorithm.
 * Pass excludeLift: true to temporarily omit Pair 2 Lift edges for calculating stairs alternative.
 */
export function findShortestPath(
  fromId: string,
  toId: string,
  options?: { excludeLift?: boolean } | boolean
): string[] | null {
  if (!campusGraphData.nodes[fromId] || !campusGraphData.nodes[toId]) return null;
  if (fromId === toId) return null;

  const excludeLift = typeof options === 'boolean' ? options : !!options?.excludeLift;

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const discoverySeq: Record<string, number> = {};
  const unvisited = new Set<string>();

  for (const nodeId of Object.keys(campusGraphData.nodes)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    discoverySeq[nodeId] = Infinity;
    unvisited.add(nodeId);
  }

  distances[fromId] = 0;
  discoverySeq[fromId] = 0;

  let counter = 0;

  while (unvisited.size > 0) {
    let currNode: string | null = null;
    let minDistance = Infinity;
    let minSeq = Infinity;

    for (const nodeId of unvisited) {
      const d = distances[nodeId];
      const s = discoverySeq[nodeId];
      if (d < minDistance || (d === minDistance && s < minSeq)) {
        minDistance = d;
        minSeq = s;
        currNode = nodeId;
      }
    }

    if (currNode === null) break; // All remaining unvisited nodes are inaccessible
    if (currNode === toId) break; // Found shortest path

    unvisited.delete(currNode);

    const baseNeighbors = campusGraphData.edges[currNode] || [];
    const pair1Neighbors = excludeLift ? [] : (PAIR_1_LIFT_EDGES[currNode] || []);
    const pair2Neighbors = excludeLift ? [] : (PAIR_2_LIFT_EDGES[currNode] || []);
    const neighbors = [...baseNeighbors, ...pair1Neighbors, ...pair2Neighbors];

    for (const edge of neighbors) {
      if (!unvisited.has(edge.toId)) continue;

      const altDistance = distances[currNode] + edge.weight;
      if (altDistance < distances[edge.toId]) {
        distances[edge.toId] = altDistance;
        previous[edge.toId] = currNode;
        discoverySeq[edge.toId] = ++counter;
      }
    }
  }

  if (previous[toId] === null) {
    return null; // No path found
  }

  const path: string[] = [];
  let current: string | null = toId;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}

/**
 * Calculates available route options (Lift vs Stairs) between source and destination.
 */
export function getRouteOptions(fromId: string, toId: string): RouteOption[] {
  if (!fromId || !toId || fromId === toId) return [];

  const primaryPath = findShortestPath(fromId, toId);
  if (!primaryPath) return [];

  const primaryUsesLift = pathUsesLift(primaryPath);

  if (primaryUsesLift) {
    const primarySteps = generateRouteSteps(primaryPath);
    if (!primarySteps) return [];

    const usesPair1 = primaryPath.some((id, idx) => idx > 0 && is1LLiftEdge(primaryPath[idx - 1], id));
    const usesPair2 = primaryPath.some((id, idx) => idx > 0 && is2LLiftEdge(primaryPath[idx - 1], id));
    let liftSubtitle = 'Uses Lift';
    if (usesPair1 && !usesPair2) liftSubtitle = 'Uses Pair 1 Lift';
    else if (usesPair2 && !usesPair1) liftSubtitle = 'Uses Pair 2 Lift';
    else if (usesPair1 && usesPair2) liftSubtitle = 'Uses Pair 1 & Pair 2 Lifts';

    const liftOption: RouteOption = {
      id: 'lift',
      title: 'Lift Route',
      subtitle: liftSubtitle,
      type: 'lift',
      path: primaryPath,
      routeSteps: primarySteps,
    };

    const altPath = findShortestPath(fromId, toId, { excludeLift: true });
    const altUsesStairs = altPath ? !pathUsesLift(altPath) : false;

    if (altPath && altUsesStairs) {
      const altSteps = generateRouteSteps(altPath);
      if (altSteps) {
        const stairsOption: RouteOption = {
          id: 'stairs',
          title: 'Stairs Route',
          subtitle: 'Uses stairs',
          type: 'stairs',
          path: altPath,
          routeSteps: altSteps,
        };

        return [liftOption, stairsOption];
      }
    }

    // If no valid non-lift path exists, return only the lift option
    return [liftOption];
  } else {
    // Primary path already doesn't use lift (e.g. stairs/normal navigation)
    const primarySteps = generateRouteSteps(primaryPath);
    if (!primarySteps) return [];

    const stairsOption: RouteOption = {
      id: 'stairs',
      title: 'Stairs Route',
      subtitle: 'Uses stairs',
      type: 'stairs',
      path: primaryPath,
      routeSteps: primarySteps,
    };

    return [stairsOption];
  }
}

export function generateRouteSteps(path: string[]): RouteStep[] | null {
  if (!path || path.length < 2) return null;

  const steps: RouteStep[] = [];

  for (let i = 0; i < path.length; i++) {
    const currentId = path[i];
    const isLast = i === path.length - 1;
    
    const locationData = campusGraphData.nodes[currentId];
    if (!locationData) return null; // Invalid location in path

    let direction: Direction = 'none';
    let title = '';
    let isLiftTransition = false;
    
    if (i > 0) {
      const prevId = path[i - 1];

      if (isLiftEdge(prevId, currentId)) {
        isLiftTransition = true;
        direction = 'up';
        const lift1Edge = (PAIR_1_LIFT_EDGES[prevId] || []).find(e => e.toId === currentId);
        const lift2Edge = (PAIR_2_LIFT_EDGES[prevId] || []).find(e => e.toId === currentId);
        const liftEdge = lift1Edge || lift2Edge;
        title = liftEdge ? liftEdge.title : (is1LLiftEdge(prevId, currentId) ? 'Take Pair 1 Lift' : 'Take Pair 2 Lift');
      } else {
        const edges = campusGraphData.edges[prevId] || [];
        const edge = edges.find(e => e.toId === currentId);
        if (edge) {
          direction = 'straight';
          title = edge.title;
        }
      }
    }

    let instruction = '';
    if (i === 0) {
      instruction = `You are here at ${locationData.displayName}`;
      direction = 'none';
    } else {
      if (isLiftTransition) {
        instruction = title;
      } else if (i > 1 && isLiftEdge(path[i - 2], path[i - 1])) {
        if (isLast) {
          instruction = `Exit Lift. You have arrived at ${locationData.displayName}`;
        } else {
          instruction = `Exit Lift and proceed to ${locationData.displayName}`;
        }
      } else {
        if (isLast) {
          instruction = `You have arrived at ${locationData.displayName}`;
        } else {
          instruction = title ? `Follow '${title}' to ${locationData.displayName}` : `Proceed to ${locationData.displayName}`;
        }
      }
    }

    steps.push({
      location: locationData.displayName,
      image: locationData.imagePath,
      instruction,
      direction
    });
  }

  return steps;
}


