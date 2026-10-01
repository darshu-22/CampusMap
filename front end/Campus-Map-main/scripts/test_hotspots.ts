import { campusGraphData } from '../src/data/campusGraph';
import { xyzToSpherical } from '../src/utils/xyzToSpherical';

function oldXyzToSpherical(positionString: string) {
  const parts = positionString.split(',').map(s => parseFloat(s.trim()));
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [x, y, z] = parts;
  const yaw = Math.atan2(-x, z);
  const pitch = Math.atan2(y, Math.sqrt(x * x + z * z));
  return { yaw, pitch };
}

const connectionsToTest = [
  { from: '1.jpeg', to: '2.jpeg' },
  { from: '1.jpeg', to: 'staircase2.jpeg' },
  { from: '1.jpeg', to: 'SWO.jpeg' },
  { from: '1.jpeg', to: 'GF2L.jpeg' },
  { from: '1.jpeg', to: 'examsectionhub.jpeg' },
  { from: '2.jpeg', to: '3.jpeg' },
  { from: '2.jpeg', to: '1.jpeg' },
  { from: 'adminblock.jpeg', to: 'adminblockinside.jpeg' },
  { from: 'outsideclg.jpeg', to: 'maingate.jpeg' },
  { from: 'seminarhallentrance.jpeg', to: 'seminarhall.jpeg' },
  { from: '2Fmidpoint.jpeg', to: '2Fstair3.jpeg' },
  { from: '2Fmidpoint.jpeg', to: '2FLEhub.jpeg' },
  { from: '4F2L.jpeg', to: '4Fstair3.jpeg' },
  { from: '4F2L.jpeg', to: 'MBAcontinue.jpeg' },
  { from: '5Fstair3.jpeg', to: '4Fstair3.jpeg' }
];

const radToDeg = (r: number) => (r * 180 / Math.PI).toFixed(2);

console.log("==========================================================================================");
console.log("                         WTM HOTSPOT COORDINATE CONVERSION TEST                           ");
console.log("==========================================================================================\n");

connectionsToTest.forEach((test, idx) => {
  const edges = campusGraphData.edges[test.from] || [];
  const edge = edges.find(e => e.toId === test.to);

  console.log(`--- [Test ${idx + 1}] ${test.from} -> ${test.to} (Label: "${edge?.title || 'N/A'}") ---`);
  if (edge) {
    const oldSpherical = oldXyzToSpherical(edge.position);
    const proposedSpherical = xyzToSpherical(edge.position);

    console.log(`  WTM XYZ:        ${edge.position}`);
    if (oldSpherical && proposedSpherical) {
      console.log(`  Old PSV Coord:  yaw = ${oldSpherical.yaw.toFixed(4)} rad (${radToDeg(oldSpherical.yaw)}°), pitch = ${oldSpherical.pitch.toFixed(4)} rad (${radToDeg(oldSpherical.pitch)}°)`);
      console.log(`  Fixed Coord:    yaw = ${proposedSpherical.yaw.toFixed(4)} rad (${radToDeg(proposedSpherical.yaw)}°), pitch = ${proposedSpherical.pitch.toFixed(4)} rad (${radToDeg(proposedSpherical.pitch)}°)`);
    } else {
      console.log(`  Spherical:      INVALID`);
    }
  } else {
    console.log(`  Connection NOT FOUND in campus graph.`);
  }
  console.log();
});

// Full graph scan across all 207 hotspots
console.log("==========================================================================================");
console.log("                         FULL GRAPH SCAN (ALL EXTRACTED HOTSPOTS)                         ");
console.log("==========================================================================================");

let totalEdges = 0;
let validHotspots = 0;
let invalidHotspots = 0;

for (const fromId in campusGraphData.edges) {
  for (const edge of campusGraphData.edges[fromId]) {
    totalEdges++;
    const spherical = xyzToSpherical(edge.position);
    if (spherical && !isNaN(spherical.yaw) && !isNaN(spherical.pitch)) {
      validHotspots++;
    } else {
      invalidHotspots++;
      console.error(`Invalid hotspot from ${fromId} -> ${edge.toId}: "${edge.position}"`);
    }
  }
}

console.log(`Total Edges Extracted: ${totalEdges}`);
console.log(`Valid Spherical Coordinates: ${validHotspots}`);
console.log(`Invalid Coordinates: ${invalidHotspots}`);
console.log(`Universal Conversion Pass Rate: ${((validHotspots / totalEdges) * 100).toFixed(1)}%\n`);

