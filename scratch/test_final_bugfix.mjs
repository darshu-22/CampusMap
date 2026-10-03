import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

// Reorder 1.jpeg: SWO.jpeg before staircase2.jpeg
const edges1 = campusGraphData.edges['1.jpeg'];
const swoIdx = edges1.findIndex(e => e.toId === 'SWO.jpeg');
const stairIdx = edges1.findIndex(e => e.toId === 'staircase2.jpeg');
if (swoIdx > stairIdx) {
  const [swoEdge] = edges1.splice(swoIdx, 1);
  edges1.splice(stairIdx, 0, swoEdge);
}

// Reorder adminblockinside.jpeg: principal.jpeg before adminblock.jpeg
const edgesAdminIn = campusGraphData.edges['adminblockinside.jpeg'];
const principalIdx = edgesAdminIn.findIndex(e => e.toId === 'principal.jpeg');
const adminExtIdx = edgesAdminIn.findIndex(e => e.toId === 'adminblock.jpeg');
if (principalIdx > adminExtIdx) {
  const [pEdge] = edgesAdminIn.splice(principalIdx, 1);
  edgesAdminIn.splice(adminExtIdx, 0, pEdge);
}

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

function findShortestPath(fromId, toId) {
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

console.log("=== FINAL BUGFIX VERIFICATION ===");
const tests = [
  { from: '1.jpeg', to: 'adminblockinside.jpeg', name: 'Ground Floor -> Admin Block Lobby' },
  { from: '1.jpeg', to: 'SWO.jpeg', name: 'Ground Floor -> SWO' },
  { from: 'SWO.jpeg', to: 'principal.jpeg', name: 'SWO -> Principal area' },
  { from: 'principal.jpeg', to: 'adminblockinside.jpeg', name: 'Principal area -> Admin Block Lobby' },
  { from: 'adminblockinside.jpeg', to: '1.jpeg', name: 'Admin Block Lobby -> Ground Floor' },
  { from: 'staircase2.jpeg', to: 'adminblock.jpeg', name: 'Stair 2 -> Admin Block Exterior' },
];

for (const t of tests) {
  const path = findShortestPath(t.from, t.to);
  console.log(`\nTEST: ${t.name}`);
  console.log(`  Path: ${path ? path.join(' -> ') : 'NO PATH'}`);
}
