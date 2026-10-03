import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

const weights = new Set();
const weightCounts = {};

for (const fromId in campusGraphData.edges) {
  for (const edge of campusGraphData.edges[fromId]) {
    weights.add(edge.weight);
    weightCounts[edge.weight] = (weightCounts[edge.weight] || 0) + 1;
  }
}

console.log("Weight counts across all edges in campusGraph.ts:");
console.log(weightCounts);

// Check if any non-1 weights exist
for (const fromId in campusGraphData.edges) {
  for (const edge of campusGraphData.edges[fromId]) {
    if (edge.weight !== 1) {
      console.log(`${fromId} -> ${edge.toId}: weight ${edge.weight} (title: "${edge.title}")`);
    }
  }
}
