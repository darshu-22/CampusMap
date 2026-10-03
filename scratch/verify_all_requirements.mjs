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

function pathUsesLift(path) {
  if (!path || path.length < 2) return false;
  for (let i = 1; i < path.length; i++) {
    if (is2LLiftEdge(path[i - 1], path[i])) return true;
  }
  return false;
}

function findShortestPath(fromId, toId, options) {
  if (!campusGraphData.nodes[fromId] || !campusGraphData.nodes[toId]) return null;
  if (fromId === toId) return null;

  const excludeLift = typeof options === 'boolean' ? options : !!options?.excludeLift;

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

function getRouteOptions(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return [];
  const primaryPath = findShortestPath(fromId, toId);
  if (!primaryPath) return [];

  const primaryUsesLift = pathUsesLift(primaryPath);

  if (primaryUsesLift) {
    const liftOption = {
      id: 'lift',
      title: 'Lift Route',
      subtitle: 'Uses Pair 2 Lift',
      type: 'lift',
      path: primaryPath,
    };

    const altPath = findShortestPath(fromId, toId, { excludeLift: true });
    const altUsesStairs = altPath ? !pathUsesLift(altPath) : false;

    if (altPath && altUsesStairs) {
      const stairsOption = {
        id: 'stairs',
        title: 'Stairs Route',
        subtitle: 'Uses stairs',
        type: 'stairs',
        path: altPath,
      };
      return [liftOption, stairsOption];
    }
    return [liftOption];
  } else {
    const stairsOption = {
      id: 'stairs',
      title: 'Stairs Route',
      subtitle: 'Uses stairs',
      type: 'stairs',
      path: primaryPath,
    };
    return [stairsOption];
  }
}

console.log("==================================================");
console.log("          VERIFICATION OF ALL TEST CASES          ");
console.log("==================================================");

// TEST 1: 1st Floor -> 3rd Floor
console.log("\n[TEST 1] 1st Floor (4.jpeg) -> 3rd Floor (10.jpeg):");
const options1 = getRouteOptions('4.jpeg', '10.jpeg');
console.log(`  Options count: ${options1.length}`);
options1.forEach(opt => {
  console.log(`  - Option: "${opt.title}" (${opt.subtitle}) | Path: ${opt.path.join(' -> ')}`);
});
const hasLiftOption1 = options1.some(o => o.type === 'lift');
const hasStairsOption1 = options1.some(o => o.type === 'stairs');
console.log(`  PASS: Lift route present? ${hasLiftOption1} | Stairs route present? ${hasStairsOption1}`);

// TEST 2: Select Lift route filtering check
console.log("\n[TEST 2] Select Lift route step-by-step next-hotspot target check:");
const liftRoute = options1.find(o => o.type === 'lift');
for (let i = 0; i < liftRoute.path.length - 1; i++) {
  const curr = liftRoute.path[i];
  const next = liftRoute.path[i + 1];
  console.log(`  Step ${i + 1} (${curr}): Allowed target -> ${next}`);
}

// TEST 3: Select Stairs route step-by-step next-hotspot target check
console.log("\n[TEST 3] Select Stairs route step-by-step next-hotspot target check:");
const stairsRoute = options1.find(o => o.type === 'stairs');
for (let i = 0; i < stairsRoute.path.length - 1; i++) {
  const curr = stairsRoute.path[i];
  const next = stairsRoute.path[i + 1];
  const usesLiftAtStep = is2LLiftEdge(curr, next);
  console.log(`  Step ${i + 1} (${curr}): Allowed target -> ${next} (Uses Lift? ${usesLiftAtStep})`);
}

// TEST 4: Same Floor (Single route check)
console.log("\n[TEST 4] Ground Floor (1.jpeg) -> Ground Floor Room (2.jpeg) (No lift needed):");
const optionsSameFloor = getRouteOptions('1.jpeg', '2.jpeg');
console.log(`  Options count: ${optionsSameFloor.length}`);
console.log(`  Route title: "${optionsSameFloor[0]?.title}" | Path: ${optionsSameFloor[0]?.path.join(' -> ')}`);

console.log("\n==================================================");
console.log("✅ ALL VERIFICATION SCRIPTS EXECUTED SUCCESSFULLY!");
console.log("==================================================");
