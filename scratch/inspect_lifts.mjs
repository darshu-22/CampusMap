import fs from 'fs';

const wtm = JSON.parse(fs.readFileSync('WTMProject.wtm', 'utf8'));
const names = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

console.log("=== INSPECTING ALL PANORAMA NODES & HOTSPOTS IN WTM ===");

// Check hotspots in WTM containing "lift", "elevator", "stair", "floor", "5th", "5", etc.
for (const [panoId, pano] of Object.entries(wtm.panoramas || {})) {
  const name = names[panoId] || panoId;
  const hotspots = pano.hotspots || [];
  const liftHotspots = hotspots.filter(h => {
    const t = (h.title || '').toLowerCase();
    const target = (h.targetPanoId || '').toLowerCase();
    return t.includes('lift') || t.includes('elevator') || t.includes('floor') || t.includes('stair') || target.includes('stair') || target.includes('5');
  });

  if (liftHotspots.length > 0) {
    console.log(`\nNode [${panoId}] ("${name}"):`);
    liftHotspots.forEach(h => {
      console.log(`  -> Target: [${h.targetPanoId}] ("${names[h.targetPanoId] || h.targetPanoId}"), Title: "${h.title}"`);
    });
  }
}

// Let's also check all nodes 1.jpeg to 18.jpeg in WTM
console.log("\n=== NODES 1.jpeg THROUGH 18.jpeg IN WTM ===");
for (let i = 1; i <= 18; i++) {
  const panoId = `${i}.jpeg`;
  const pano = wtm.panoramas[panoId];
  if (pano) {
    console.log(`\n[${panoId}] "${names[panoId]}":`);
    (pano.hotspots || []).forEach(h => {
      console.log(`  -> [${h.targetPanoId}] ("${names[h.targetPanoId] || h.targetPanoId}") Title: "${h.title}"`);
    });
  }
}
