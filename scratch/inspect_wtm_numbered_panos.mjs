import fs from 'fs';

const wtm = JSON.parse(fs.readFileSync('WTMProject.wtm', 'utf8'));
const names = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

console.log("=== DETAILED HOTSPOTS FOR PANORAMAS 1.jpeg THROUGH 18.jpeg ===");

for (let i = 1; i <= 18; i++) {
  const panoId = `${i}.jpeg`;
  const pano = wtm.panoramas.find(p => p.panofile === panoId);
  if (pano) {
    console.log(`\nPano [${panoId}] -> Name: "${names[panoId] || panoId}"`);
    (pano.hotspots || []).forEach((h, idx) => {
      const action = h.actions && h.actions[0] ? h.actions[0] : {};
      const target = action.target || 'NONE';
      console.log(`  Hs ${idx + 1}: id="${h.hotspotid}", title="${h.title}", pos="${h.position}", icon="${h.icon}", target="${target}"`);
    });
  }
}
