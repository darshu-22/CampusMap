import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const graphFile = path.join(__dirname, '..', 'front end', 'Campus-Map-main', 'src', 'data', 'campusGraph.ts');
const routingFile = path.join(__dirname, '..', 'front end', 'Campus-Map-main', 'src', 'utils', 'routing.ts');

const graphContent = fs.readFileSync(graphFile, 'utf8');
const jsContent = graphContent
  .replace(/\/\/:[\s\S]*?\n/g, '')
  .replace(/export interface[\s\S]*?\n\}/g, '')
  .replace(/export const campusGraphData: CampusGraphData =/, 'return');
const campusGraphData = new Function(jsContent)();

const routingContent = fs.readFileSync(routingFile, 'utf8');
const pair2LiftMatch = routingContent.match(/export const PAIR_2_LIFT_EDGES:[\s\S]*?= ({[\s\S]*?});/);
const PAIR_2_LIFT_EDGES = new Function(`return ${pair2LiftMatch[1]}`)();

function simulateHotspotFiltering(panoId, targetAllowed, isRouteGuided) {
  const baseEdges = campusGraphData.edges[panoId] ?? [];
  const liftEdges = PAIR_2_LIFT_EDGES[panoId] ?? [];
  let edges = [...baseEdges, ...liftEdges];

  if (isRouteGuided) {
    if (targetAllowed) {
      edges = edges.filter(e => e.toId === targetAllowed);
    } else {
      edges = [];
    }
  }
  return edges;
}

console.log("=== TEST 1: Open World Mode (4F2L.jpeg) ===");
const openWorldEdges = simulateHotspotFiltering('4F2L.jpeg', null, false);
console.log(`4F2L open world total hotspots: ${openWorldEdges.length}`);
console.log(openWorldEdges.map(e => ` -> ${e.toId} (${e.title || 'corridor/stair'})`));

console.log("\n=== TEST 2: Route-Guided Pair 2 Lift (4F2L.jpeg -> 5F2L.jpeg) ===");
const liftGuidedEdges = simulateHotspotFiltering('4F2L.jpeg', '5F2L.jpeg', true);
console.log(`4F2L route guided allowed target '5F2L.jpeg' total hotspots: ${liftGuidedEdges.length}`);
console.log(liftGuidedEdges.map(e => ` -> ${e.toId} (${e.title})`));

console.log("\n=== TEST 3: Route-Guided Normal Step (maingate.jpeg -> GF2L.jpeg) ===");
const normalGuidedEdges = simulateHotspotFiltering('maingate.jpeg', 'GF2L.jpeg', true);
console.log(`maingate route guided allowed target 'GF2L.jpeg' total hotspots: ${normalGuidedEdges.length}`);
console.log(normalGuidedEdges.map(e => ` -> ${e.toId} (${e.title})`));

console.log("\n=== TEST 4: Destination Reached (5F2L.jpeg) ===");
const destEdges = simulateHotspotFiltering('5F2L.jpeg', null, true);
console.log(`5F2L destination reached total hotspots: ${destEdges.length}`);

if (openWorldEdges.length > 1 && liftGuidedEdges.length === 1 && liftGuidedEdges[0].toId === '5F2L.jpeg' && destEdges.length === 0) {
  console.log("\n✅ ALL ROUTE-GUIDED HOTSPOT FILTERING TESTS PASSED PERFECTLY!");
} else {
  console.log("\n❌ TEST FAILED");
  process.exit(1);
}
