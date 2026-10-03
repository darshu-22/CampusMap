import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

const PAIR_2_LIFT_EDGES = {
  'BF2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5 }
  ],
  'GF2L.jpeg': [
    { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', weight: 0.5 },
    { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', weight: 0.5 },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 0.5 },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 0.5 },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 0.5 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5 }
  ],
  'FF2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5 },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 0.5 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5 }
  ],
  '2F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5 },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 0.5 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5 }
  ],
  '3F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5 },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 0.5 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5 }
  ],
  '4F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 0.5 }
  ],
  '5F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 0.5 },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 0.5 },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 0.5 },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 0.5 },
    { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', weight: 0.5 },
    { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', weight: 0.5 }
  ]
};

function is2LLiftEdge(prevId, currId) {
  return (PAIR_2_LIFT_EDGES[prevId] || []).some(e => e.toId === currId);
}

function hasLiftEdge(path) {
  if (!path) return false;
  for (let i = 1; i < path.length; i++) {
    if (is2LLiftEdge(path[i - 1], path[i])) return true;
  }
  return false;
}

function findPath(fromId, toId, excludeLift = false) {
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
    if (currNode === null || currNode === toId) break;
    unvisited.delete(currNode);
    const baseNeighbors = campusGraphData.edges[currNode] || [];
    const liftNeighbors = excludeLift ? [] : (PAIR_2_LIFT_EDGES[currNode] || []);
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

const allNodes = Object.keys(campusGraphData.nodes);
let multiRouteCount = 0;
let singleLiftOnlyCount = 0;
let singleStairsOnlyCount = 0;

const samples = [];

for (let i = 0; i < allNodes.length; i++) {
  for (let j = i + 1; j < allNodes.length; j++) {
    const fromId = allNodes[i];
    const toId = allNodes[j];
    
    const primary = findPath(fromId, toId, false);
    if (!primary) continue;
    
    const primaryUsesLift = hasLiftEdge(primary);
    const alt = findPath(fromId, toId, true);
    const altUsesLift = hasLiftEdge(alt);
    
    if (primaryUsesLift) {
      if (alt && !altUsesLift) {
        multiRouteCount++;
        if (samples.length < 10) {
          samples.push({ fromId, toId, primary, alt });
        }
      } else {
        singleLiftOnlyCount++;
      }
    } else {
      singleStairsOnlyCount++;
    }
  }
}

console.log(`Total node pairs checked: ${allNodes.length * (allNodes.length - 1) / 2}`);
console.log(`Pairs with BOTH Lift and Stairs routes available: ${multiRouteCount}`);
console.log(`Pairs with ONLY Lift route available (no stair path): ${singleLiftOnlyCount}`);
console.log(`Pairs with ONLY Stairs route (primary doesn't use lift): ${singleStairsOnlyCount}`);

console.log("\nSample Multi-Route Pairs:");
for (const s of samples) {
  const fromName = campusGraphData.nodes[s.fromId].displayName;
  const toName = campusGraphData.nodes[s.toId].displayName;
  console.log(`\nFrom "${fromName}" (${s.fromId}) -> "${toName}" (${s.toId}):`);
  console.log(`  Lift Route  [${s.primary.length} steps]: ${s.primary.join(' -> ')}`);
  console.log(`  Stairs Route[${s.alt.length} steps]: ${s.alt.join(' -> ')}`);
}
