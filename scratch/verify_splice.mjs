import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const edgesMatch = graphCode.match(/edges:\s*({[\s\S]*?})\s*};\s*$/);
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);

const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')'),
  edges: eval('(' + edgesMatch[1] + ')')
};

console.log("BEFORE 1.jpeg edges:", campusGraphData.edges['1.jpeg'].map(e => e.toId));

const edges1 = campusGraphData.edges['1.jpeg'];
const swoIdx = edges1.findIndex(e => e.toId === 'SWO.jpeg');
const stairIdx = edges1.findIndex(e => e.toId === 'staircase2.jpeg');
console.log(`swoIdx: ${swoIdx}, stairIdx: ${stairIdx}`);

if (swoIdx > stairIdx) {
  const [swoEdge] = edges1.splice(swoIdx, 1);
  edges1.splice(stairIdx, 0, swoEdge);
}

console.log("AFTER 1.jpeg edges:", campusGraphData.edges['1.jpeg'].map(e => e.toId));
