import { findShortestPath, generateRouteSteps } from '../utils/routing';

export interface RouteStep {
  location: string;
  image: string;
  instruction: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'straight' | 'none';
}

export type RoutesData = Record<string, RouteStep[]>;

/**
 * Retrieves a route using Dijkstra's algorithm on the single source of truth WTM campus graph.
 */
export function getRoute(fromId: string, toId: string): RouteStep[] | null {
  const path = findShortestPath(fromId, toId);
  
  if (path) {
    const dynamicSteps = generateRouteSteps(path);
    if (dynamicSteps) {
      return dynamicSteps;
    }
  }

  return null;
}
