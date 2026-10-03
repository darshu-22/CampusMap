import fs from 'fs';

const wtmData = JSON.parse(fs.readFileSync('./WTMProject.wtm', 'utf8'));

function getHotspots(panoFile) {
  const p = wtmData.panoramas.find(x => x.panofile === panoFile);
  if (!p) return [];
  return p.hotspots || [];
}

function parsePos(posStr) {
  if (!posStr) return [0,0,0];
  return posStr.split(',').map(n => parseFloat(n.trim()));
}

function vectorLength(pos) {
  const [x, y, z] = pos;
  return Math.sqrt(x*x + y*y + z*z);
}

console.log("=== HOTSPOT POSITIONS & DISTANCES IN WTM ===");

// Check 1.jpeg hotspots
const p1Hotspots = getHotspots('1.jpeg');
console.log("1.jpeg hotspots:");
for (const h of p1Hotspots) {
  const target = h.actions?.[0]?.target;
  const pos = parsePos(h.position);
  console.log(`  -> ${target}: title="${h.title}", position=[${pos.join(', ')}], dist=${vectorLength(pos).toFixed(2)}`);
}

// Check SWO.jpeg hotspots
console.log("\nSWO.jpeg hotspots:");
for (const h of getHotspots('SWO.jpeg')) {
  const target = h.actions?.[0]?.target;
  const pos = parsePos(h.position);
  console.log(`  -> ${target}: title="${h.title}", position=[${pos.join(', ')}], dist=${vectorLength(pos).toFixed(2)}`);
}

// Check principal.jpeg hotspots
console.log("\nprincipal.jpeg hotspots:");
for (const h of getHotspots('principal.jpeg')) {
  const target = h.actions?.[0]?.target;
  const pos = parsePos(h.position);
  console.log(`  -> ${target}: title="${h.title}", position=[${pos.join(', ')}], dist=${vectorLength(pos).toFixed(2)}`);
}

// Check staircase2.jpeg hotspots
console.log("\nstaircase2.jpeg hotspots:");
for (const h of getHotspots('staircase2.jpeg')) {
  const target = h.actions?.[0]?.target;
  const pos = parsePos(h.position);
  console.log(`  -> ${target}: title="${h.title}", position=[${pos.join(', ')}], dist=${vectorLength(pos).toFixed(2)}`);
}

// Check adminblock.jpeg hotspots
console.log("\nadminblock.jpeg hotspots:");
for (const h of getHotspots('adminblock.jpeg')) {
  const target = h.actions?.[0]?.target;
  const pos = parsePos(h.position);
  console.log(`  -> ${target}: title="${h.title}", position=[${pos.join(', ')}], dist=${vectorLength(pos).toFixed(2)}`);
}

// Check adminblockinside.jpeg hotspots
console.log("\nadminblockinside.jpeg hotspots:");
for (const h of getHotspots('adminblockinside.jpeg')) {
  const target = h.actions?.[0]?.target;
  const pos = parsePos(h.position);
  console.log(`  -> ${target}: title="${h.title}", position=[${pos.join(', ')}], dist=${vectorLength(pos).toFixed(2)}`);
}
