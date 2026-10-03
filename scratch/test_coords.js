const fs = require('fs');

// Test WTM Cartesian (x, y, z) to Equirectangular UV (u, v) and PSV (yaw, pitch)

const hotspots = [
  { name: "2.jpeg", pos: [394.8759248749583, 13.1779911816716, -55.7578719726194] },
  { name: "staircase2.jpeg", pos: [381.895436039366, -101.55063976151295, 55.806149734581595] },
  { name: "SWO.jpeg", pos: [-373.96704698939845, 61.36276599422621, -126.90507538774594] },
  { name: "GF2L.jpeg", pos: [-331.5275645606659, -43.74991677763495, 217.58810639751295] },
  { name: "examsectionhub.jpeg", pos: [-225.5356113538411, -53.98029043272082, -324.99466203184346] }
];

console.log("--- UV & PSV COORD CALCULATIONS FOR 1.jpeg ---");

hotspots.forEach(hs => {
  const [x, y, z] = hs.pos;
  const R = Math.sqrt(x*x + y*y + z*z);
  const Rh = Math.sqrt(x*x + z*z);

  // In Three.js SphereGeometry scale(-1, 1, 1):
  // X = R * sin(theta) * cos(phi)
  // Y = R * cos(theta)
  // Z = R * sin(theta) * sin(phi)
  //
  // theta (polar angle from top +Y down): cos(theta) = Y / R  =>  theta = acos(Y / R)
  // phi (azimuth angle from 0 to 2pi): atan2(Z, X)
  
  let phi = Math.atan2(z, x);
  if (phi < 0) phi += 2 * Math.PI;

  const theta = Math.acos(y / R);

  // Equirectangular UV (u in [0, 1] from left to right, v in [0, 1] from top to bottom)
  const u = phi / (2 * Math.PI);
  const v = theta / Math.PI;

  // PSV convention: yaw = 0 is center of image (u = 0.5, phi = PI).
  // yaw = phi - PI (or atan2(-z, -x))
  let psvYaw = phi - Math.PI;
  // normalize psvYaw to [-PI, PI]
  if (psvYaw > Math.PI) psvYaw -= 2 * Math.PI;
  if (psvYaw < -Math.PI) psvYaw += 2 * Math.PI;

  const psvPitch = (Math.PI / 2) - theta; // pitch = asin(y / R) = atan2(y, Rh)

  console.log(`Hotspot -> ${hs.name}:`);
  console.log(`  Cartesian: (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`);
  console.log(`  UV (0..1): u = ${(u * 100).toFixed(1)}%, v = ${(v * 100).toFixed(1)}%`);
  console.log(`  PSV Yaw: ${(psvYaw * 180 / Math.PI).toFixed(1)}°, Pitch: ${(psvPitch * 180 / Math.PI).toFixed(1)}°`);
});
