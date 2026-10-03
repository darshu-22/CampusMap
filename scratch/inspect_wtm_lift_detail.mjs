import fs from 'fs';

const wtm = JSON.parse(fs.readFileSync('WTMProject.wtm', 'utf8'));
const names = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

console.log("=== INSPECTING WTM PANORAMAS AND HOTSPOTS IN GROUND FLOOR & NEARBY NODES ===");

// List all panoramas in WTM
for (const pano of wtm.panoramas || []) {
  const id = pano.panofile;
  const name = names[id] || pano.title || id;
  const hotspots = pano.hotspots || [];

  console.log(`\nPano [${id}] (ID in WTM: ${pano.id || 'N/A'}, Title: "${pano.title || ''}", Name: "${name}"):`);
  if (hotspots.length === 0) {
    console.log("   (No hotspots)");
  }
  hotspots.forEach((hs, idx) => {
    const action = hs.actions && hs.actions[0] ? hs.actions[0] : {};
    const target = action.target || 'NONE';
    console.log(`   Hotspot ${idx + 1}: id="${hs.hotspotid}", title="${hs.title}", pos="${hs.position}", icon="${hs.icon}", target="${target}"`);
  });
}
