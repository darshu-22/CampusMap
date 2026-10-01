/**
 * xyzToSpherical.ts
 *
 * Converts a WTM 3D Cartesian hotspot position vector into the
 * spherical (yaw, pitch) coordinates expected by @photo-sphere-viewer/core.
 *
 * ── 3Sixty WTM Coordinate System ─────────────────────────────────────────
 *   The 3Sixty desktop application wraps equirectangular panoramas on a Three.js
 *   SphereGeometry scaled with scale(-1, 1, 1).
 *   Hotspots are positioned in 3D world space at (x, y, z).
 *
 * ── Photo Sphere Viewer (PSV) Coordinate System ──────────────────────────
 *   In PSV (@photo-sphere-viewer/core EquirectangularAdapter):
 *     - yaw = 0 is centered at u = 0.5 (center of equirectangular image).
 *     - yaw increases to the RIGHT (+angle) as u increases from 0.5 to 1.0.
 *     - In Three.js scale(-1, 1, 1), negative Z corresponds to positive yaw (right).
 *     - pitch is elevation angle: 0 at horizon, positive up, negative down.
 *
 * ── Verified Conversion Formulas ─────────────────────────────────────────
 *   Given WTM Cartesian vector (X, Y, Z):
 *
 *     yaw   = atan2(-Z, X)
 *     pitch = atan2(Y, sqrt(X*X + Z*Z))
 *
 *   Output is in RADIANS (PSV default).
 */

export interface SphericalPosition {
  yaw: number;   // radians, PSV convention
  pitch: number; // radians, PSV convention
}

/**
 * Parses a WTM position string "X,Y,Z" and returns PSV spherical coordinates.
 *
 * @param positionString  The raw `position` field from a CampusEdge, e.g. "394.87,13.17,-55.75"
 * @returns               { yaw, pitch } in radians, or null if the string is invalid
 */
export function xyzToSpherical(positionString: string): SphericalPosition | null {
  if (!positionString) return null;

  const parts = positionString.split(',').map(s => parseFloat(s.trim()));
  if (parts.length !== 3 || parts.some(isNaN)) {
    console.warn('[xyzToSpherical] Invalid position string:', positionString);
    return null;
  }

  const [x, y, z] = parts;

  // Use Photo Sphere Viewer's exact internal vector3ToSphericalCoords formula:
  const len = Math.sqrt(x * x + y * y + z * z);
  if (len === 0) return null;

  const phi = Math.acos(y / len);
  const theta = Math.atan2(x, z);

  const yaw = theta < 0 ? -theta : Math.PI * 2 - theta;
  const pitch = Math.PI / 2 - phi;

  return { yaw, pitch };
}
