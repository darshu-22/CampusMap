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

  const pathResult = [];
  let current = toId;
  while (current !== null) {
    pathResult.unshift(current);
    current = previous[current];
  }

  return pathResult;
}

const PAIR_2_FLOOR_ORDER = {
  'BF2L.jpeg': 0,
  'GF2L.jpeg': 1,
  'FF2L.jpeg': 2,
  '2F2L.jpeg': 3,
  '3F2L.jpeg': 4,
  '4F2L.jpeg': 5,
  '5F2L.jpeg': 6,
};

const PAIR_2_BASE_POSITIONS = {
  'BF2L.jpeg': [0, -100, 380],
  'GF2L.jpeg': [0, -100, -380],
  'FF2L.jpeg': [0, -100, -380],
  '2F2L.jpeg': [-380, -100, 0],
  '3F2L.jpeg': [0, -100, -380],
  '4F2L.jpeg': [-380, -100, 0],
  '5F2L.jpeg': [0, -100, -380],
};

function simulatePhotoViewerEdges(panoId, allowedTargetPanoId, isRouteGuided) {
  const baseEdges = campusGraphData.edges[panoId] ?? [];
  let liftEdges = [];

  if (PAIR_2_FLOOR_ORDER[panoId] !== undefined) {
    const currentOrder = PAIR_2_FLOOR_ORDER[panoId];
    const [baseX, baseY, baseZ] = PAIR_2_BASE_POSITIONS[panoId];

    if (isRouteGuided) {
      const rawEdges = PAIR_2_LIFT_EDGES[panoId] ?? [];
      liftEdges = rawEdges.map(edge => {
        const targetOrder = PAIR_2_FLOOR_ORDER[edge.toId];
        const isUp = targetOrder !== undefined ? targetOrder > currentOrder : true;
        const finalY = isUp ? baseY + 30 : baseY - 30;
        return {
          ...edge,
          position: `${baseX}, ${finalY}, ${baseZ}`
        };
      });
    } else {
      const pair2AdjacentMap = {
        'BF2L.jpeg': [{ toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', isUp: true }],
        'GF2L.jpeg': [
          { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', isUp: true },
          { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', isUp: false }
        ],
        'FF2L.jpeg': [
          { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', isUp: true },
          { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', isUp: false }
        ],
        '2F2L.jpeg': [
          { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', isUp: true },
          { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', isUp: false }
        ],
        '3F2L.jpeg': [
          { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', isUp: true },
          { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', isUp: false }
        ],
        '4F2L.jpeg': [
          { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', isUp: true },
          { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', isUp: false }
        ],
        '5F2L.jpeg': [{ toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', isUp: false }]
      };
      const adjacentList = pair2AdjacentMap[panoId] ?? [];
      const hasBoth = adjacentList.length > 1;
      liftEdges = adjacentList.map(cfg => {
        let finalY = baseY;
        if (hasBoth) {
          finalY = cfg.isUp ? baseY + 30 : baseY - 30;
        }
        return {
          toId: cfg.toId,
          title: cfg.title,
          weight: 0.5,
          position: `${baseX}, ${finalY}, ${baseZ}`,
          icon: 'chevronforward.png'
        };
      });
    }
  } else {
    liftEdges = PAIR_2_LIFT_EDGES[panoId] ?? [];
  }

  let edges = [...baseEdges, ...liftEdges];

  if (isRouteGuided) {
    if (allowedTargetPanoId) {
      edges = edges.filter(e => e.toId === allowedTargetPanoId);
    } else {
      edges = [];
    }
  }
  return edges;
}

console.log("=======================================================================");
console.log("       VERIFYING GROUND FLOOR TO 5TH FLOOR ROUTE-GUIDED HOTSPOTS       ");
console.log("=======================================================================\n");

const testRoutes = [
  ['GF2L.jpeg', '5F2L.jpeg'],
  ['1.jpeg', '5F2L.jpeg'],
  ['GFLEhub.jpeg', '5FLEhub.jpeg']
];

testRoutes.forEach(([from, to]) => {
  const routePath = findShortestPath(from, to);
  console.log(`\nRoute: ${from} -> ${to} (${routePath.length} steps):`);
  console.log(`  Path: ${routePath.join(' -> ')}`);

  let success = true;
  for (let i = 0; i < routePath.length; i++) {
    const currentPano = routePath[i];
    const allowed = i < routePath.length - 1 ? routePath[i + 1] : null;
    const edges = simulatePhotoViewerEdges(currentPano, allowed, true);

    if (allowed) {
      if (edges.length !== 1 || edges[0].toId !== allowed) {
        console.error(`  ❌ Step ${i + 1}: At ${currentPano}, expected 1 hotspot to ${allowed}, got ${edges.length}`);
        success = false;
      } else {
        console.log(`  ✅ Step ${i + 1}: At ${currentPano} -> 1 hotspot to ${allowed} (${edges[0].title}) pos: (${edges[0].position})`);
      }
    } else {
      if (edges.length !== 0) {
        console.error(`  ❌ Destination ${currentPano} expected 0 hotspots, got ${edges.length}`);
        success = false;
      } else {
        console.log(`  ✅ Step ${i + 1}: Destination ${currentPano} -> 0 exit hotspots (Arrival state)`);
      }
    }
  }
  if (success) {
    console.log(`🎉 Route ${from} -> ${to} PASSED COMPLETELY!`);
  }
});
