// Test PSV's EXACT vector3ToSphericalCoords implementation on WTM coordinates

function psvVector3ToSphericalCoords(x, y, z) {
  const len = Math.sqrt(x * x + y * y + z * z);
  const phi = Math.acos(y / len);
  const theta = Math.atan2(x, z);
  return {
    yaw: theta < 0 ? -theta : Math.PI * 2 - theta,
    pitch: Math.PI / 2 - phi
  };
}

// Check with 1.jpeg hotspots
const hotspots = [
  { name: "2.jpeg", pos: [394.8759248749583, 13.1779911816716, -55.7578719726194] },
  { name: "staircase2.jpeg", pos: [381.895436039366, -101.55063976151295, 55.806149734581595] },
  { name: "SWO.jpeg", pos: [-373.96704698939845, 61.36276599422621, -126.90507538774594] },
  { name: "GF2L.jpeg", pos: [-331.5275645606659, -43.74991677763495, 217.58810639751295] },
  { name: "examsectionhub.jpeg", pos: [-225.5356113538411, -53.98029043272082, -324.99466203184346] }
];

console.log("=== PSV EXACT FORMULA ON 1.jpeg ===");
hotspots.forEach(hs => {
  const [x, y, z] = hs.pos;
  const s = psvVector3ToSphericalCoords(x, y, z);
  console.log(`${hs.name}: yaw = ${(s.yaw * 180 / Math.PI).toFixed(1)}°, pitch = ${(s.pitch * 180 / Math.PI).toFixed(1)}°`);

  // Verify roundtrip: psvSphericalToVector3
  const rx = 500 * -Math.cos(s.pitch) * Math.sin(s.yaw);
  const ry = 500 * Math.sin(s.pitch);
  const rz = 500 * Math.cos(s.pitch) * Math.cos(s.yaw);
  console.log(`  Roundtrip Vector3: (${rx.toFixed(1)}, ${ry.toFixed(1)}, ${rz.toFixed(1)}) vs Original (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`);
});
