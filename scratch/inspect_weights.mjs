import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

const relevant = ['1.jpeg', 'SWO.jpeg', 'principal.jpeg', 'adminblockinside.jpeg', 'staircase2.jpeg', 'adminblock.jpeg'];

console.log("=== CAMPUSGRAPH EDGE WEIGHTS ===");
for (const id of relevant) {
  console.log(`\nNode: ${id}`);
  for (const edge of (campusGraphData.edges[id] || [])) {
    console.log(`  -> ${edge.toId} (weight: ${edge.weight}, title: "${edge.title}")`);
  }
}
