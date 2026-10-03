import fs from 'fs';

const wtmRaw = fs.readFileSync('WTMProject.wtm', 'utf8');
const wtm = JSON.parse(wtmRaw);
const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');

const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

console.log("=== WTM & HOTSPOT UNTOUCHED VERIFICATION CHECK ===");
console.log(`1. WTM Panoramas Count: ${wtm.panoramas.length}`);

let totalWtmEdges = 0;
for (const p of wtm.panoramas) {
  totalWtmEdges += (p.hotspots || []).length;
}
console.log(`2. Total Original WTM Hotspots: ${totalWtmEdges}`);

let graphEdgesCount = 0;
for (const edges of Object.values(campusGraphData.edges)) {
  graphEdgesCount += edges.length;
}
console.log(`3. Total Extracted Graph Hotspots: ${graphEdgesCount}`);

console.log(`\n4. Verifying 2L Panoramas Original WTM Hotspots:`);

const target2L = ['BF2L.jpeg', 'GF2L.jpeg', 'FF2L.jpeg', '2F2L.jpeg', '3F2L.jpeg', '4F2L.jpeg', '5F2L.jpeg'];

for (const id of target2L) {
  const origEdges = campusGraphData.edges[id] || [];
  console.log(`\n  [${id}] Original WTM Hotspots count: ${origEdges.length}`);
  origEdges.forEach(e => {
    console.log(`    - toId: "${e.toId}", title: "${e.title}", position: "${e.position}"`);
  });
}
