import fs from 'fs';
import path from 'path';

const wtm = JSON.parse(fs.readFileSync('WTMProject.wtm', 'utf8'));
const names = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

// Check directory files on disk
const rootDir = 'c:\\Users\\admin\\Desktop\\Campusmap';
const diskFiles = fs.readdirSync(rootDir);

const panoDirs = ['panoramas', 'campus', 'assets', 'images'];
const allFilesOnDisk = new Set(diskFiles);

for (const d of panoDirs) {
  const p = path.join(rootDir, d);
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
    fs.readdirSync(p).forEach(f => allFilesOnDisk.add(f));
  }
}

console.log("=== CHECKING ALL FILES MATCHING '2L' or '2l' ===");

const matchedPanos = [];

// Search in WTM panoramas, names JSON, and disk files
const allPanoIds = new Set([
  ...Object.keys(names),
  ...(wtm.panoramas || []).map(p => p.panofile),
  ...Array.from(allFilesOnDisk).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'))
]);

for (const id of allPanoIds) {
  if (/2L/i.test(id)) {
    const wtmPano = (wtm.panoramas || []).find(p => p.panofile === id);
    const displayName = names[id] || (wtmPano ? wtmPano.title : id);
    matchedPanos.push({
      id,
      displayName,
      wtmPano
    });
  }
}

console.log(`Found ${matchedPanos.length} Pair 2 (2L) panoramas:\n`);

matchedPanos.forEach(p => {
  console.log(`Pano: ${p.id}`);
  console.log(`  Display Name: "${p.displayName}"`);
  const hotspots = p.wtmPano ? p.wtmPano.hotspots || [] : [];
  console.log(`  Hotspots in WTM (${hotspots.length}):`);
  hotspots.forEach((h, idx) => {
    const action = h.actions && h.actions[0] ? h.actions[0] : {};
    const target = action.target || 'NONE';
    const targetName = names[target] || target;
    console.log(`    ${idx + 1}. id="${h.hotspotid}", title="${h.title}", pos="${h.position}", target="[${target}] (${targetName})"`);
  });
  console.log('');
});
