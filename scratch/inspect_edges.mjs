import fs from 'fs';

// Read campusGraph.ts
const content = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');

// Parse edges using JS evaluation in node
const edgesMatch = content.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
let graphEdges = {};

if (edgesMatch) {
  try {
    graphEdges = eval('(' + edgesMatch[1] + ')');
  } catch (err) {
    console.error("Eval error:", err);
  }
}

console.log(`Parsed edges for ${Object.keys(graphEdges).length} nodes.`);

// Let's inspect connections for 5th floor nodes
const fifthFloorNodes = ["16.jpeg", "17.jpeg", "18.jpeg", "MCA5.jpeg", "5Fpathway.jpeg", "5F2L.jpeg", "5FLEhub.jpeg", "5Fmidpoint.jpeg", "5Fstair3.jpeg"];

console.log("\n=== 5TH FLOOR NODES & THEIR DIRECT CONNECTIONS ===");
for (const nodeId of fifthFloorNodes) {
  const edges = graphEdges[nodeId] || [];
  console.log(`\nNode [${nodeId}]:`);
  if (edges.length === 0) {
    console.log("  (NO EDGES!)");
  } else {
    edges.forEach(e => console.log(`  -> [${e.toId}] "${e.title}" (weight: ${e.weight})`));
  }
}

// Check which nodes connect TO 5th floor nodes
console.log("\n=== NODES CONNECTING TO 5TH FLOOR NODES ===");
for (const [fromId, edges] of Object.entries(graphEdges)) {
  for (const e of edges) {
    if (fifthFloorNodes.includes(e.toId)) {
      console.log(`  [${fromId}] -> [${e.toId}] "${e.title}"`);
    }
  }
}

// Check connections between LE Hub nodes across floors
console.log("\n=== LE HUB NODES ACROSS FLOORS ===");
const leHubNodes = ["GFLEhub.jpeg", "FFLEhub.jpeg", "2FLEhub.jpeg", "3FLEhub.jpeg", "4FLEhub.jpeg", "5FLEhub.jpeg"];
for (const id of leHubNodes) {
  const edges = graphEdges[id] || [];
  console.log(`[${id}]:`, edges.map(e => `${e.toId} ("${e.title}")`).join(', ') || 'NONE');
}

// Check connections between Stair3 nodes across floors
console.log("\n=== STAIR3 NODES ACROSS FLOORS ===");
const stair3Nodes = ["BFstair3.jpeg", "GFstair3.jpeg", "FFstair3.jpeg", "2Fstair3.jpeg", "3Fstair3.jpeg", "4Fstair3.jpeg", "5Fstair3.jpeg"];
for (const id of stair3Nodes) {
  const edges = graphEdges[id] || [];
  console.log(`[${id}]:`, edges.map(e => `${e.toId} ("${e.title}")`).join(', ') || 'NONE');
}

// Test connectivity between ground floor and 5th floor using BFS
console.log("\n=== BFS REACHABILITY TEST FROM MAINGATE AND GF ===");
function findPathBFS(start, target) {
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const path = queue.shift();
    const curr = path[path.length - 1];
    if (curr === target) return path;
    const neighbors = graphEdges[curr] || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.toId)) {
        visited.add(edge.toId);
        queue.push([...path, edge.toId]);
      }
    }
  }
  return null;
}

const startNodes = ["maingate.jpeg", "1.jpeg", "GFLEhub.jpeg", "GFstair3.jpeg", "GF2L.jpeg"];
for (const start of startNodes) {
  for (const target of fifthFloorNodes) {
    const path = findPathBFS(start, target);
    if (path) {
      console.log(`✅ Path from ${start} to ${target}: length ${path.length}`);
      console.log(`   Path: ${path.join(' -> ')}`);
    } else {
      console.log(`❌ NO PATH from ${start} to ${target}`);
    }
  }
}
