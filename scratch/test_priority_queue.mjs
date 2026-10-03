import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

const PAIR_2_LIFT_EDGES = {
  'BF2L.jpeg': [{ toId: 'GF2L.jpeg', weight: 0.5 }, { toId: '5F2L.jpeg', weight: 0.5 }],
  'GF2L.jpeg': [
    { toId: 'BF2L.jpeg', weight: 0.5 }, { toId: 'FF2L.jpeg', weight: 0.5 },
    { toId: '2F2L.jpeg', weight: 0.5 }, { toId: '3F2L.jpeg', weight: 0.5 },
    { toId: '4F2L.jpeg', weight: 0.5 }, { toId: '5F2L.jpeg', weight: 0.5 }
  ],
  'FF2L.jpeg': [{ toId: 'GF2L.jpeg', weight: 0.5 }, { toId: '2F2L.jpeg', weight: 0.5 }, { toId: '5F2L.jpeg', weight: 0.5 }],
  '2F2L.jpeg': [{ toId: 'GF2L.jpeg', weight: 0.5 }, { toId: '3F2L.jpeg', weight: 0.5 }, { toId: '5F2L.jpeg', weight: 0.5 }],
  '3F2L.jpeg': [{ toId: 'GF2L.jpeg', weight: 0.5 }, { toId: '4F2L.jpeg', weight: 0.5 }, { toId: '5F2L.jpeg', weight: 0.5 }],
  '4F2L.jpeg': [{ toId: 'GF2L.jpeg', weight: 0.5 }, { toId: '5F2L.jpeg', weight: 0.5 }],
  '5F2L.jpeg': [
    { toId: 'GF2L.jpeg', weight: 0.5 }, { toId: '4F2L.jpeg', weight: 0.5 },
    { toId: '3F2L.jpeg', weight: 0.5 }, { toId: '2F2L.jpeg', weight: 0.5 },
    { toId: 'FF2L.jpeg', weight: 0.5 }, { toId: 'BF2L.jpeg', weight: 0.5 }
  ]
};

// Priority Queue / Min-Heap Dijkstra implementation
function findShortestPathPQ(fromId, toId, excludeLift = false) {
  if (!campusGraphData.nodes[fromId] || !campusGraphData.nodes[toId]) return null;
  if (fromId === toId) return null;

  const distances = {};
  const previous = {};

  for (const nodeId of Object.keys(campusGraphData.nodes)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  }

  distances[fromId] = 0;

  // Queue stores items as { id, dist, seq } to break ties by discovery sequence
  let seq = 0;
  const queue = [{ id: fromId, dist: 0, seq: seq++ }];

  while (queue.length > 0) {
    // Sort queue by dist ascending, then seq ascending (FIFO tie-breaking)
    queue.sort((a, b) => (a.dist - b.dist) || (a.seq - b.seq));
    const current = queue.shift();

    if (current.dist > distances[current.id]) continue;
    if (current.id === toId) break;

    const baseNeighbors = campusGraphData.edges[current.id] || [];
    const liftNeighbors = excludeLift ? [] : (PAIR_2_LIFT_EDGES[current.id] || []);
    const neighbors = [...baseNeighbors, ...liftNeighbors];

    for (const edge of neighbors) {
      const altDistance = distances[current.id] + edge.weight;
      if (altDistance < distances[edge.toId]) {
        distances[edge.toId] = altDistance;
        previous[edge.toId] = current.id;
        queue.push({ id: edge.toId, dist: altDistance, seq: seq++ });
      }
    }
  }

  if (previous[toId] === null) return null;

  const path = [];
  let curr = toId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }
  return path;
}

console.log("=== TESTING WITH STANDARD DISCOVERY-ORDER DIJKSTRA ===");
const tests = [
  { from: '1.jpeg', to: 'adminblockinside.jpeg', name: 'Ground Floor -> Admin Block Lobby' },
  { from: '1.jpeg', to: 'SWO.jpeg', name: 'Ground Floor -> SWO' },
  { from: 'SWO.jpeg', to: 'principal.jpeg', name: 'SWO -> Principal area' },
  { from: 'principal.jpeg', to: 'adminblockinside.jpeg', name: 'Principal area -> Admin Block Lobby' },
  { from: 'adminblockinside.jpeg', to: '1.jpeg', name: 'Admin Block Lobby -> Ground Floor' },
  { from: 'staircase2.jpeg', to: 'adminblock.jpeg', name: 'Stair 2 -> Admin Block Exterior' },
];

for (const t of tests) {
  const path = findShortestPathPQ(t.from, t.to);
  console.log(`\nTEST: ${t.name} (${t.from} -> ${t.to})`);
  console.log(`  Path: ${path ? path.join(' -> ') : 'NO PATH'}`);
}
