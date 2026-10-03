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

// Use exact Dijkstra algorithm from routing.ts
function findShortestPath(fromId, toId) {
  if (!campusGraphData.nodes[fromId] || !campusGraphData.nodes[toId]) return null;
  if (fromId === toId) return null;

  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (const nodeId of Object.keys(campusGraphData.nodes)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }

  distances[fromId] = 0;

  while (unvisited.size > 0) {
    let currNode = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currNode = nodeId;
      }
    }

    if (currNode === null) break;
    if (currNode === toId) break;

    unvisited.delete(currNode);

    const baseNeighbors = campusGraphData.edges[currNode] || [];
    const liftNeighbors = PAIR_2_LIFT_EDGES[currNode] || [];
    const neighbors = [...baseNeighbors, ...liftNeighbors];

    for (const edge of neighbors) {
      if (!unvisited.has(edge.toId)) continue;

      const altDistance = distances[currNode] + edge.weight;
      if (altDistance < distances[edge.toId]) {
        distances[edge.toId] = altDistance;
        previous[edge.toId] = currNode;
      }
    }
  }

  if (previous[toId] === null) return null;

  const path = [];
  let current = toId;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}

class View360StateSimulation {
  constructor(activeRoute) {
    this.activeRoute = activeRoute;
    this.routeIndex = 0;
    this.openWorldPanoId = '1.jpeg';
    this.onHotspotNavigateRef = { current: this.handleHotspotNavigate.bind(this) };
  }

  get isRouteGuided() {
    return !!(this.activeRoute && this.activeRoute.path && this.activeRoute.path.length > 0);
  }

  get currentPanoId() {
    if (this.isRouteGuided) {
      const path = this.activeRoute.path;
      const safeIndex = Math.min(Math.max(0, this.routeIndex), path.length - 1);
      return path[safeIndex];
    }
    return this.openWorldPanoId;
  }

  get allowedTargetPanoId() {
    if (this.isRouteGuided) {
      const path = this.activeRoute.path;
      const safeIndex = Math.min(Math.max(0, this.routeIndex), path.length - 1);
      if (safeIndex < path.length - 1) {
        return path[safeIndex + 1];
      }
      return null;
    }
    return undefined;
  }

  get isArrivalState() {
    if (!this.isRouteGuided) return false;
    return this.routeIndex >= this.activeRoute.path.length - 1;
  }

  getRenderedHotspots() {
    const panoId = this.currentPanoId;
    const baseEdges = campusGraphData.edges[panoId] ?? [];
    const liftEdges = PAIR_2_LIFT_EDGES[panoId] ?? [];
    let edges = [...baseEdges, ...liftEdges];

    if (this.isRouteGuided) {
      if (this.allowedTargetPanoId) {
        edges = edges.filter(e => e.toId === this.allowedTargetPanoId);
      } else {
        edges = [];
      }
    }
    return edges;
  }

  handleHotspotNavigate(targetPanoId) {
    if (this.isRouteGuided) {
      const nextExpected = this.activeRoute.path[this.routeIndex + 1];
      if (nextExpected && targetPanoId === nextExpected) {
        this.routeIndex++;
      }
    } else {
      this.openWorldPanoId = targetPanoId;
    }
  }

  clickHotspot(targetPanoId) {
    this.onHotspotNavigateRef.current(targetPanoId);
  }
}

console.log("=======================================================================");
console.log("             ROUTE GUIDED STATE TRANSITION VERIFICATION TEST           ");
console.log("=======================================================================\n");

const realPath = findShortestPath('1.jpeg', '8.jpeg');
console.log(`Real Dijkstra path from 1.jpeg to 8.jpeg (${realPath.length} nodes):`);
console.log(realPath.join(' -> '));

const sim = new View360StateSimulation({ path: realPath, fromId: '1.jpeg', toId: '8.jpeg' });

for (let i = 0; i < realPath.length; i++) {
  const currentPano = sim.currentPanoId;
  const expectedPano = realPath[i];
  const allowed = sim.allowedTargetPanoId;
  const hotspots = sim.getRenderedHotspots();

  console.log(`\nStep ${i + 1}/${realPath.length}: current = ${currentPano}, allowed target = ${allowed}`);
  console.log(`  Rendered hotspots count: ${hotspots.length}`);

  if (currentPano !== expectedPano) {
    console.error(`❌ Mismatch at step ${i}: expected ${expectedPano}, got ${currentPano}`);
    process.exit(1);
  }

  if (i < realPath.length - 1) {
    const nextExpected = realPath[i + 1];
    if (hotspots.length !== 1 || hotspots[0].toId !== nextExpected) {
      console.error(`❌ Hotspot mismatch at step ${i}: expected 1 hotspot to ${nextExpected}, got ${hotspots.length}`);
      process.exit(1);
    }
    console.log(`  -> Clicking hotspot to ${nextExpected}...`);
    sim.clickHotspot(nextExpected);
  } else {
    if (hotspots.length !== 0 || !sim.isArrivalState) {
      console.error(`❌ Destination arrival state error: hotspots=${hotspots.length}, isArrival=${sim.isArrivalState}`);
      process.exit(1);
    }
    console.log(`  -> Destination reached! 0 hotspots rendered.`);
  }
}

console.log("\n=== TEST 4: Pair 2 Lift Route (4F2L.jpeg to 5Fpathway.jpeg) ===");
const liftPath = findShortestPath('4F2L.jpeg', '5Fpathway.jpeg');
console.log(`Real Pair 2 Lift path: ${liftPath.join(' -> ')}`);
const liftSim = new View360StateSimulation({ path: liftPath, fromId: '4F2L.jpeg', toId: '5Fpathway.jpeg' });

for (let i = 0; i < liftPath.length; i++) {
  const currentPano = liftSim.currentPanoId;
  const allowed = liftSim.allowedTargetPanoId;
  const hotspots = liftSim.getRenderedHotspots();

  console.log(`Lift Step ${i + 1}/${liftPath.length}: current = ${currentPano}, allowed target = ${allowed}`);
  if (i < liftPath.length - 1) {
    const nextExpected = liftPath[i + 1];
    if (hotspots.length !== 1 || hotspots[0].toId !== nextExpected) {
      console.error(`❌ Lift step ${i} failed`);
      process.exit(1);
    }
    console.log(`  -> Hotspot found: ${hotspots[0].toId} (${hotspots[0].title || 'hotspot'}). Clicking...`);
    liftSim.clickHotspot(nextExpected);
  }
}

console.log("\n=== TEST 5: Open-World Mode (No Route) ===");
const openWorldSim = new View360StateSimulation(null);
console.log(`Open world mode: isRouteGuided = ${openWorldSim.isRouteGuided}`);
const owHotspots = openWorldSim.getRenderedHotspots();
console.log(`1.jpeg open world hotspots count: ${owHotspots.length}`);
if (owHotspots.length <= 1) {
  console.error("❌ Open world mode failed to render all connected hotspots");
  process.exit(1);
}

console.log("\n✅ ALL ROUTE-GUIDED STATE TRANSITION TESTS PASSED 100% PERFECTLY!");
