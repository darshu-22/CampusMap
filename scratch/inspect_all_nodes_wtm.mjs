import fs from 'fs';

const wtm = JSON.parse(fs.readFileSync('WTMProject.wtm', 'utf8'));
const names = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

console.log("=== ALL 88 NODES AND ALL THEIR HOTSPOT TITLES ===");

for (const pano of wtm.panoramas || []) {
  const id = pano.panofile;
  const name = names[id] || pano.title || id;
  console.log(`\n[${id}] -> "${name}"`);
  (pano.hotspots || []).forEach(h => {
    const target = h.actions && h.actions[0] ? h.actions[0].target : 'NONE';
    const targetName = names[target] || target;
    console.log(`  hs: "${h.title}" -> target: [${target}] ("${targetName}")`);
  });
}
