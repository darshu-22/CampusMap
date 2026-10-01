import { campusGraphData, type CampusNode } from '../data/campusGraph';
import { getHumanReadableName } from '../data/panoramaMetadata';

/**
 * Retrieves the full node information for a given panorama ID.
 * @param id The ID (filename) of the panorama
 * @returns The CampusNode object or undefined if not found
 */
export function getPanoramaNode(id: string): CampusNode | undefined {
  const node = campusGraphData.nodes[id];
  if (!node) return undefined;
  return {
    ...node,
    displayName: getHumanReadableName(id),
  };
}

/**
 * Returns an array of all available panorama nodes.
 */
export function getAllPanoramas(): CampusNode[] {
  return Object.values(campusGraphData.nodes).map(node => ({
    ...node,
    displayName: getHumanReadableName(node.id),
  }));
}

/**
 * Helper to get just the human-readable display name for a panorama ID.
 */
export function getPanoramaDisplayName(id: string): string {
  return getHumanReadableName(id);
}

/**
 * Helper to get the correct public image path for a panorama ID.
 */
export function getPanoramaImagePath(id: string): string {
  const node = getPanoramaNode(id);
  return node ? node.imagePath : `/campus/${id}`;
}
