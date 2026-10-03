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

const ffNodes = ['4.jpeg', 'FF2L.jpeg', 'FFmidpoint.jpeg', 'stair1tomca.jpeg'];
const tfNodes = ['10.jpeg', '3F2L.jpeg', '3ndfloorentrance.jpeg'];

console.log("=== 1ST FLOOR TO 3RD FLOOR ROUTE COMPARISON ===");
for (const f of ffNodes) {
  for (const t of tfNodes) {
    const withLift = findPath(f, t, false);
    const withoutLift = findPath(f, t, true);
    console.log(`\nFrom ${f} (${campusGraphData.nodes[f]?.displayName}) to ${t} (${campusGraphData.nodes[t]?.displayName}):`);
    console.log('  Primary (Lift)   :', withLift ? withLift.join(' -> ') : 'NO PATH');
    console.log('  Alternative (No Lift):', withoutLift ? withoutLift.join(' -> ') : 'NO PATH');
  }
}
