import fs from 'fs';

// Load WTM file
const wtmData = JSON.parse(fs.readFileSync('./WTMProject.wtm', 'utf8'));

// Build graph from WTM directly
const wtmGraph = {};
for (const p of wtmData.panoramas) {
  wtmGraph[p.panofile] = [];
  for (const h of p.hotspots || []) {
    for (const a of h.actions || []) {
      if (a.target) {
        wtmGraph[p.panofile].push({
          target: a.target,
          title: h.title,
          icon: h.icon
        });
      }
    }
  }
}

console.log("=== 1. WTM GRAPH EDGES FOR RELEVANT PANOS ===");
const relevantPanos = [
  '1.jpeg', 'SWO.jpeg', 'principal.jpeg', 'adminblockinside.jpeg', 'adminblock.jpeg',
  'staircase2.jpeg', 'admissionstair1.jpeg', 'admissions.jpeg', 'feecounter.jpeg', 'examsectionhub.jpeg'
];

for (const panoId of Object.keys(wtmGraph)) {
  const edges = wtmGraph[panoId];
  const isRel = relevantPanos.includes(panoId) || edges.some(e => relevantPanos.includes(e.target));
  if (isRel) {
    console.log(`\nWTM Pano: "${panoId}"`);
    for (const e of edges) {
      console.log(`  -> "${e.target}" (title: "${e.title}")`);
    }
  }
}

// 2. Load campusGraph.ts
const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

console.log("\n=== 2. CAMPUSGRAPH.TS EDGES FOR RELEVANT PANOS ===");
for (const panoId of Object.keys(campusGraphData.edges)) {
  const edges = campusGraphData.edges[panoId] || [];
  const isRel = relevantPanos.includes(panoId) || edges.some(e => relevantPanos.includes(e.toId));
  if (isRel) {
    console.log(`\nCampusGraph Node: "${panoId}" (${campusGraphData.nodes[panoId]?.displayName})`);
    for (const e of edges) {
      console.log(`  -> "${e.toId}" (weight: ${e.weight}, title: "${e.title}")`);
    }
  }
}

// 3. Check search location resolution for "Admin Block Lobby", "Ground Floor", "SWO", "Principal"
const searchCode = fs.readFileSync('./front end/Campus-Map-main/src/utils/searchLocations.ts', 'utf8');
const destsCode = fs.readFileSync('./front end/Campus-Map-main/src/data/destinations.ts', 'utf8');
const locsCode = fs.readFileSync('./front end/Campus-Map-main/src/data/locations.ts', 'utf8');

console.log("\n=== 3. SEARCH & DESTINATION MAP INSPECTION ===");
console.log("Destinations excerpt around admin/principal:");
console.log(destsCode);

