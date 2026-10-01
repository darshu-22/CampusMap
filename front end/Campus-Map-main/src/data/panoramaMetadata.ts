/**
 * panoramaMetadata.ts
 *
 * Imports panorama_location_names.json as the SINGLE SOURCE OF TRUTH for display metadata names.
 * Does NOT modify WTMProject.wtm, actual JPEG filenames, or graph node IDs.
 *
 * Internal ID (e.g. "1.jpeg") remains the permanent key.
 * Human-readable names are used in the UI for display metadata only.
 */

import panoramaLocationNamesRaw from './panorama_location_names.json';

export interface PanoramaMetadata {
  id: string;
  displayName: string;
  aliases: string[];
  category: string;
  isIdentified: boolean;
  notes?: string;
}

const panoramaLocationNames = panoramaLocationNamesRaw as Record<string, string | string[]>;

/**
 * Normalizes raw JSON name value into array of non-empty names.
 * First item is the primary display name, followed by search aliases.
 * Source of truth: panorama_location_names.json merged with any browser localStorage overrides.
 */
export function getPanoramaNames(id: string): string[] {
  const jsonRaw = panoramaLocationNames[id];
  let jsonNames: string[] = [];
  if (typeof jsonRaw === 'string') {
    const trimmed = jsonRaw.trim();
    if (trimmed && trimmed !== '.') jsonNames.push(trimmed);
  } else if (Array.isArray(jsonRaw)) {
    jsonNames = jsonRaw.map(s => (typeof s === 'string' ? s.trim() : '')).filter(s => s && s !== '.');
  }

  let localNames: string[] = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('campus_map_panorama_naming_data_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed[id]) {
          const item = parsed[id];
          const primary = typeof item.primary === 'string' ? item.primary.trim() : '';
          const aliases = Array.isArray(item.aliases)
            ? item.aliases.map((a: string) => (typeof a === 'string' ? a.trim() : '')).filter(Boolean)
            : [];
          localNames = [primary, ...aliases].filter(s => s && s !== '.');
        }
      }
    }
  } catch (err) {
    // Ignore localStorage read errors
  }

  const combinedSet = new Set<string>();

  // Primary name priority: local primary if set, else json primary
  const primaryName = localNames[0] || jsonNames[0] || '';
  if (primaryName) combinedSet.add(primaryName);

  // Include all names from permanent JSON file
  jsonNames.forEach(n => combinedSet.add(n));

  // Include any custom aliases saved in browser localStorage
  localNames.forEach(n => combinedSet.add(n));

  return Array.from(combinedSet);
}

export function getPanoramaAliases(id: string): string[] {
  return getPanoramaNames(id);
}

// Categorization helper for floor/wing metadata
function getCategoryForNode(id: string): string {
  const lower = id.toLowerCase();
  if (lower.startsWith('bf') || lower.includes('examsection')) return 'Basement';
  if (lower.startsWith('6th')) return '6th Floor';
  if (lower.startsWith('5f') || lower.includes('mca5') || id === '16.jpeg' || id === '17.jpeg' || id === '18.jpeg') return '5th Floor';
  if (lower.startsWith('4f') || lower.includes('mba') || id === '13.jpeg' || id === '14.jpeg' || id === '15.jpeg' || lower.includes('4thfloor')) return '4th Floor';
  if (lower.startsWith('3f') || id === '10.jpeg' || id === '11.jpeg' || id === '12.jpeg' || lower.includes('3ndfloor')) return '3rd Floor';
  if (lower.startsWith('2f') || id === '7.jpeg' || id === '8.jpeg' || id === '9.jpeg') return '2nd Floor';
  if (lower.startsWith('ff') || lower.startsWith('1f') || id === '4.jpeg' || id === '5.jpeg' || id === '6.jpeg' || lower.includes('vyom')) return '1st Floor';
  return 'Ground Floor';
}

// Build initial metadata mapping using panorama_location_names.json as the source of truth
export const initialPanoramaMetadata: Record<string, PanoramaMetadata> = Object.keys(panoramaLocationNames).reduce(
  (acc, id) => {
    const names = getPanoramaNames(id);
    const displayName = names.length > 0 ? names[0] : 'Location not identified';
    acc[id] = {
      id,
      displayName,
      aliases: names,
      category: getCategoryForNode(id),
      isIdentified: displayName !== 'Location not identified',
    };
    return acc;
  },
  {} as Record<string, PanoramaMetadata>
);

// LocalStorage Persistence helper for Developer/Admin updates
const STORAGE_KEY = 'campus_map_panorama_names_override_v1';

export function getCustomPanoramaNames(): Record<string, string> {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  } catch (err) {
    console.warn('[panoramaMetadata] Failed to read custom names from localStorage:', err);
    return {};
  }
}

export function setCustomPanoramaName(id: string, newName: string) {
  try {
    if (typeof localStorage !== 'undefined') {
      const current = getCustomPanoramaNames();
      current[id] = newName.trim();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch (err) {
    console.warn('[panoramaMetadata] Failed to save custom name to localStorage:', err);
  }
}

/**
 * Returns the human-readable display name for any panorama ID.
 * Hierarchy:
 * 1. User custom override from localStorage (if set)
 * 2. Imported panorama_location_names.json (Source of truth, first item if array)
 * 3. Initial metadata dictionary
 * 4. Fallback: "Location not identified"
 */
export function getHumanReadableName(id: string): string {
  const customNames = getCustomPanoramaNames();
  if (customNames[id]) {
    return customNames[id];
  }

  const names = getPanoramaNames(id);
  if (names.length > 0) {
    return names[0];
  }

  const meta = initialPanoramaMetadata[id];
  if (meta && meta.displayName && meta.displayName !== '.') {
    return meta.displayName;
  }

  return 'Location not identified';
}
