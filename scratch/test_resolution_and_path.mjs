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

// Check nodes in campusGraph matching names
console.log("=== NODES MATCHING SEARCH NAMES ===");
for (const [id, node] of Object.entries(campusGraphData.nodes)) {
  const name = node.displayName.toLowerCase();
  if (name.includes('ground') || name.includes('swo') || name.includes('principal') || name.includes('admin') || name.includes('stair 2') || name.includes('lobby')) {
    console.log(`Node ID: "${id}" | DisplayName: "${node.displayName}"`);
  }
}

// Check searchLocations function behavior
const searchLocsCode = fs.readFileSync('./front end/Campus-Map-main/src/utils/searchLocations.ts', 'utf8');
console.log("\nTesting path from '1.jpeg' to various admin nodes:");
console.log("1.jpeg -> adminblockinside.jpeg:", findShortestPath('1.jpeg', 'adminblockinside.jpeg'));
console.log("1.jpeg -> adminblock.jpeg      :", findShortestPath('1.jpeg', 'adminblock.jpeg'));

