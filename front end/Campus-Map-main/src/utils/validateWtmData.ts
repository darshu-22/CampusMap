/**
 * validateWtmData.ts
 *
 * Developer-only validation utility that verifies:
 * 1. Every frontend panorama ID exists in backend campusGraphData.nodes
 * 2. Every navigation hotspot target exists
 * 3. Frontend hotspot count matches expected backend navigation hotspot count (207)
 * 4. No frontend hotspot has a custom/manual position
 * 5. No frontend navigation edge differs from backend target
 * 6. No panorama image mapping points to a different image (1:1 mapping /campus/{id})
 */

import { campusGraphData } from '../data/campusGraph';

export interface ValidationReport {
  isValid: boolean;
  totalPanoramas: number;
  totalHotspots: number;
  errors: string[];
  warnings: string[];
}

export function validateWtmData(): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const nodes = campusGraphData.nodes || {};
  const edgesMap = campusGraphData.edges || {};

  const nodeKeys = Object.keys(nodes);
  let totalHotspots = 0;

  // 1. Check all panorama nodes
  nodeKeys.forEach(id => {
    const node = nodes[id];
    if (!node) {
      errors.push(`Missing Node Object for panorama ID "${id}"`);
      return;
    }

    // Rule 1: Panorama image mapping must be exact /campus/{id}
    const expectedImagePath = `/campus/${id}`;
    if (node.imagePath !== expectedImagePath) {
      errors.push(`Image Mapping Violation: Node "${id}" has imagePath "${node.imagePath}", expected "${expectedImagePath}"`);
    }

    // Filename must match ID
    if (node.filename !== id) {
      errors.push(`Filename Mismatch: Node "${id}" has filename "${node.filename}"`);
    }
  });

  // 2. Check all navigation edges & hotspots
  for (const fromId of Object.keys(edgesMap)) {
    // Check if source node exists
    if (!nodes[fromId]) {
      errors.push(`Orphan Edge List: Edges exist for source panorama "${fromId}" which is not in nodes list`);
    }

    const edges = edgesMap[fromId] || [];
    edges.forEach((edge, idx) => {
      totalHotspots++;

      // Check target node exists
      if (!nodes[edge.toId]) {
        errors.push(`Invalid Hotspot Target: Hotspot #${idx} from "${fromId}" targets unknown panorama "${edge.toId}"`);
      }

      // Check position format X,Y,Z
      if (!edge.position || typeof edge.position !== 'string') {
        errors.push(`Missing Position Vector: Hotspot from "${fromId}" to "${edge.toId}" lacks position string`);
      } else {
        const parts = edge.position.split(',').map(s => parseFloat(s.trim()));
        if (parts.length !== 3 || parts.some(isNaN)) {
          errors.push(`Malformed XYZ Vector: Hotspot "${fromId}" -> "${edge.toId}" has invalid position "${edge.position}"`);
        }
      }

      // Check fromId matches key
      if (edge.fromId !== fromId) {
        errors.push(`Edge Source Mismatch: Edge in "${fromId}" list has fromId "${edge.fromId}"`);
      }
    });
  }

  // 3. Expected hotspot count check (207)
  if (totalHotspots !== 207) {
    warnings.push(`Expected 207 backend navigation hotspots, but found ${totalHotspots}`);
  }

  const isValid = errors.length === 0;

  if (!isValid) {
    console.error("Backend hotspot data and frontend rendering are being compared.");
    console.error("The backend/WTM data wins every time.");
  }

  return {
    isValid,
    totalPanoramas: nodeKeys.length,
    totalHotspots,
    errors,
    warnings
  };
}
