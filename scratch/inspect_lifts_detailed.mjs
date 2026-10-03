import fs from 'fs';

const wtm = JSON.parse(fs.readFileSync('WTMProject.wtm', 'utf8'));
const names = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

// Parse campusGraph.ts directly to see current graph data
const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');

// Match all occurrences of edges in graph
console.log("=== SEARCHING FOR LIFT / ELEVATOR MENTIONS IN NAMES & WTM HOTSPOTS ===");

for (const pano of wtm.panoramas || []) {
  const panoId = pano.panofile;
  const name = names[panoId] || pano.title || panoId;
  
  const matches = (pano.hotspots || []).filter(h => {
    const t = (h.title || '').toLowerCase();
    return t.includes('lift') || t.includes('elevator') || t.includes('stair');
  });

  if (matches.length > 0 || name.toLowerCase().includes('lift') || name.toLowerCase().includes('elevator') || name.toLowerCase().includes('stair')) {
    console.log(`\nNode [${panoId}] -> Display Name: "${name}"`);
    (pano.hotspots || []).forEach(h => {
      const target = h.actions && h.actions[0] ? h.actions[0].target : 'NONE';
      const targetName = names[target] || target;
      console.log(`   Hotspot: "${h.title}" -> Target: [${target}] ("${targetName}")`);
    });
  }
}
