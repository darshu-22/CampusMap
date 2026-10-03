import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);
const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')')
};

const locations = Object.values(campusGraphData.nodes).map(n => ({
  id: n.id,
  name: n.displayName,
  image: n.imagePath
}));

const destsCode = fs.readFileSync('./front end/Campus-Map-main/src/data/destinations.ts', 'utf8');

// Load searchLocations.ts function dynamically or test it
const searchCode = fs.readFileSync('./front end/Campus-Map-main/src/utils/searchLocations.ts', 'utf8');

console.log("=== LOCATIONS IN CAMPUS GRAPH ===");
for (const loc of locations) {
  console.log(`ID: "${loc.id}" | Name: "${loc.name}"`);
}
