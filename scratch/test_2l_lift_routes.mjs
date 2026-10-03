import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

// Pair 2 Lift Edges connecting all 2L panoramas across floors
const PAIR_2_LIFT_EDGES = {
  'BF2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 1 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 1 }
  ],
  'GF2L.jpeg': [
    { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', weight: 1 },
    { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', weight: 1 },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 1 },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 1 },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 1 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 1 }
  ],
  'FF2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 1 },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 1 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 1 }
  ],
  '2F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 1 },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 1 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 1 }
  ],
  '3F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 1 },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 1 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 1 }
  ],
  '4F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 1 },
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', weight: 1 }
  ],
  '5F2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', weight: 1 },
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', weight: 1 },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', weight: 1 },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', weight: 1 },
    { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', weight: 1 },
    { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', weight: 1 }
  ]
};

function is2LLiftTransition(prevId, currId) {
  return (PAIR_2_LIFT_EDGES[prevId] || []).some(e => e.toId === currId);
}

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
      if (is2LLiftTransition(prevId, currentId)) {
        isLiftTransition = true;
        direction = 'up';
        const edge = (PAIR_2_LIFT_EDGES[prevId] || []).find(e => e.toId === currentId);
        title = edge ? edge.title : 'Take Pair 2 Lift';
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
      } else if (i > 1 && is2LLiftTransition(path[i - 2], path[i - 1])) {
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
  { from: '1.jpeg', to: '17.jpeg', name: 'Ground Floor (1.jpeg) -> Room 519' },
  { from: '4.jpeg', to: '17.jpeg', name: '1st Floor (4.jpeg) -> Room 519' },
  { from: '7.jpeg', to: '17.jpeg', name: '2nd Floor (7.jpeg) -> Room 519' },
  { from: '10.jpeg', to: '17.jpeg', name: '3rd Floor (10.jpeg) -> Room 519' },
  { from: '13.jpeg', to: '17.jpeg', name: '4th Floor (13.jpeg) -> Room 519' },
  { from: 'BF2L.jpeg', to: '17.jpeg', name: 'Basement (BF2L.jpeg) -> Room 519' },
  { from: '1.jpeg', to: '9.jpeg', name: 'Ground Floor -> Room 215 (Normal Non-Lift Route)' }
];

console.log("=== PAIR 2 LIFT ROUTE TESTS ===");
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
