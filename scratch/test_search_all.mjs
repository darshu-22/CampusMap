import fs from 'fs';

const searchCode = fs.readFileSync('./front end/Campus-Map-main/src/utils/searchLocations.ts', 'utf8');
const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const destsCode = fs.readFileSync('./front end/Campus-Map-main/src/data/destinations.ts', 'utf8');

const nodesMatch = graphCode.match(/nodes:\s*({[\s\S]*?}),\s*edges:/);
const campusGraphData = {
  nodes: eval('(' + nodesMatch[1] + ')')
};

const panoramaLocationNames = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

const locationsList = Object.keys(campusGraphData.nodes).map(id => ({
  id,
  name: panoramaLocationNames[id] || id,
  image: `/campus/${id}`
}));

// We can evaluate getEnrichedAliases and searchLocations from searchLocations.ts
// Let's extract searchLocations function using dynamic eval or module import
console.log("=== ALL LOCATIONS IN LIST ===");
locationsList.forEach(l => {
  if (l.name.toLowerCase().includes('ground') || l.name.toLowerCase().includes('admin') || l.name.toLowerCase().includes('swo') || l.name.toLowerCase().includes('principal') || l.name.toLowerCase().includes('stair')) {
    console.log(`ID: "${l.id}" | Name: "${l.name}"`);
  }
});
