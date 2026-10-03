import fs from 'fs';

// Since routing.ts is TS, let's load campusGraph.ts and test the exact logic
const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

const EXPRESS_LIFT_EDGES = {
  '1.jpeg': [
    { toId: '16.jpeg', title: 'Main Campus Lift / Elevator to 5th Floor', weight: 1 }
  ],
  '16.jpeg': [
    { toId: '1.jpeg', title: 'Main Campus Lift / Elevator to Ground Floor', weight: 1 }
  ]
};

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
    const liftNeighbors = EXPRESS_LIFT_EDGES[currNode] || [];
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

function generateRouteSteps(path) {
  if (!path || path.length < 2) return null;

  const steps = [];

  for (let i = 0; i < path.length; i++) {
    const currentId = path[i];
    const isLast = i === path.length - 1;
    const locationData = campusGraphData.nodes[currentId];
    if (!locationData) return null;

    let direction = 'none';
    let title = '';
    let isLiftTransition = false;

    if (i > 0) {
      const prevId = path[i - 1];
      if (prevId === '1.jpeg' && currentId === '16.jpeg') {
        isLiftTransition = true;
        direction = 'up';
        title = 'Main Campus Lift / Elevator to 5th Floor';
      } else if (prevId === '16.jpeg' && currentId === '1.jpeg') {
        isLiftTransition = true;
        direction = 'down';
        title = 'Main Campus Lift / Elevator to Ground Floor';
      } else {
        const edges = campusGraphData.edges[prevId] || [];
        const edge = edges.find(e => e.toId === currentId);
        if (edge) {
          direction = 'straight';
          title = edge.title;
        }
      }
    }

    let instruction = '';
    if (i === 0) {
      instruction = `You are here at ${locationData.displayName}`;
      direction = 'none';
    } else {
      if (isLiftTransition) {
        instruction = title;
      } else if (i > 1 && path[i - 1] === '16.jpeg' && path[i - 2] === '1.jpeg') {
        if (isLast) {
          instruction = `Exit Lift on 5th Floor. You have arrived at ${locationData.displayName}`;
        } else {
          instruction = `Exit Lift on 5th Floor and proceed to ${locationData.displayName}`;
        }
      } else {
        if (isLast) {
          instruction = `You have arrived at ${locationData.displayName}`;
        } else {
          instruction = title ? `Follow '${title}' to ${locationData.displayName}` : `Proceed to ${locationData.displayName}`;
        }
      }
    }

    steps.push({
      location: locationData.displayName,
      image: locationData.imagePath,
      instruction,
      direction
    });
  }

  return steps;
}

const testCases = [
  { from: '1.jpeg', to: '17.jpeg', name: 'Ground Floor -> Room 519' },
  { from: '1.jpeg', to: '18.jpeg', name: 'Ground Floor -> Room 517' },
  { from: '1.jpeg', to: 'MCA5.jpeg', name: 'Ground Floor -> MCA 5th Floor Lab' },
  { from: '1.jpeg', to: '9.jpeg', name: 'Ground Floor -> Room 215 (Non-Lift Normal Route)' }
];

console.log("=== LIFT ROUTING TEST RESULTS ===");

for (const tc of testCases) {
  console.log(`\n--- TEST: ${tc.name} ---`);
  const path = findShortestPath(tc.from, tc.to);
  if (!path) {
    console.log("  NO PATH FOUND!");
    continue;
  }
  console.log(`Path [${path.length} steps]: ${path.join(' -> ')}`);
  const steps = generateRouteSteps(path);
  steps.forEach((s, idx) => {
    console.log(`  Step ${idx + 1}: [Dir: ${s.direction}] ${s.instruction}`);
  });
}
