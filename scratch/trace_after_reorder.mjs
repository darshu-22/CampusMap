import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

// Re-order 1.jpeg edges
const edges1 = campusGraphData.edges['1.jpeg'];
const swoIdx = edges1.findIndex(e => e.toId === 'SWO.jpeg');
const stairIdx = edges1.findIndex(e => e.toId === 'staircase2.jpeg');
if (swoIdx > stairIdx) {
  const [swoEdge] = edges1.splice(swoIdx, 1);
  edges1.splice(stairIdx, 0, swoEdge);
}

// Re-order adminblockinside.jpeg edges
const edgesAdminIn = campusGraphData.edges['adminblockinside.jpeg'];
const principalIdx = edgesAdminIn.findIndex(e => e.toId === 'principal.jpeg');
const adminExtIdx = edgesAdminIn.findIndex(e => e.toId === 'adminblock.jpeg');
if (principalIdx > adminExtIdx) {
  const [pEdge] = edgesAdminIn.splice(principalIdx, 1);
  edgesAdminIn.splice(adminExtIdx, 0, pEdge);
}

function findShortestPathTrace(fromId, toId) {
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
    console.log(`Visiting node: ${currNode} (dist: ${distances[currNode]})`);
    if (currNode === toId) break;
    unvisited.delete(currNode);

    const baseNeighbors = campusGraphData.edges[currNode] || [];
    for (const edge of baseNeighbors) {
      if (!unvisited.has(edge.toId)) continue;
      const altDistance = distances[currNode] + edge.weight;
      console.log(`  Checking neighbor ${edge.toId}: altDist=${altDistance}, currentDist=${distances[edge.toId]}`);
      if (altDistance < distances[edge.toId]) {
        distances[edge.toId] = altDistance;
        previous[edge.toId] = currNode;
        console.log(`    Updated previous[${edge.toId}] = ${currNode}`);
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

console.log("--- TRACING AFTER REORDER ---");
const path = findShortestPathTrace('1.jpeg', 'adminblockinside.jpeg');
console.log("Final Path:", path);
