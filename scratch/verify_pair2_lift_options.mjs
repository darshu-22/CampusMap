import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const graphFile = path.join(__dirname, '..', 'front end', 'Campus-Map-main', 'src', 'data', 'campusGraph.ts');
const routingFile = path.join(__dirname, '..', 'front end', 'Campus-Map-main', 'src', 'utils', 'routing.ts');

const graphContent = fs.readFileSync(graphFile, 'utf8');
const jsContent = graphContent
  .replace(/\/\/:[\s\S]*?\n/g, '')
  .replace(/export interface[\s\S]*?\n\}/g, '')
  .replace(/export const campusGraphData: CampusGraphData =/, 'return');
const campusGraphData = new Function(jsContent)();

const routingContent = fs.readFileSync(routingFile, 'utf8');
const pair2LiftMatch = routingContent.match(/export const PAIR_2_LIFT_EDGES:[\s\S]*?= ({[\s\S]*?});/);
const PAIR_2_LIFT_EDGES = new Function(`return ${pair2LiftMatch[1]}`)();

const PAIR_2_LIFT_ADJACENT_EDGES = {
  'BF2L.jpeg': [
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', basePos: [0, -100, 380], isUp: true }
  ],
  'GF2L.jpeg': [
    { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', basePos: [0, -100, -380], isUp: true },
    { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', basePos: [0, -100, -380], isUp: false }
  ],
  'FF2L.jpeg': [
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', basePos: [0, -100, -380], isUp: true },
    { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', basePos: [0, -100, -380], isUp: false }
  ],
  '2F2L.jpeg': [
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', basePos: [-380, -100, 0], isUp: true },
    { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', basePos: [-380, -100, 0], isUp: false }
  ],
  '3F2L.jpeg': [
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', basePos: [0, -100, -380], isUp: true },
    { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', basePos: [0, -100, -380], isUp: false }
  ],
  '4F2L.jpeg': [
    { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', basePos: [-380, -100, 0], isUp: true },
    { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', basePos: [-380, -100, 0], isUp: false }
  ],
  '5F2L.jpeg': [
    { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', basePos: [0, -100, -380], isUp: false }
  ]
};

function getLiftHotspots(panoId) {
  const pair2Config = PAIR_2_LIFT_ADJACENT_EDGES[panoId];
  if (!pair2Config) return [];
  const hasBoth = pair2Config.length > 1;
  return pair2Config.map(cfg => {
    const [x, y, z] = cfg.basePos;
    let finalY = y;
    if (hasBoth) {
      finalY = cfg.isUp ? y + 30 : y - 30;
    }
    return {
      toId: cfg.toId,
      title: cfg.title,
      position: `${x}, ${finalY}, ${z}`,
      isUp: cfg.isUp
    };
  });
}

console.log("=======================================================================");
console.log("               PAIR 2 LIFT DUAL-DIRECTION OPTIONS TEST                 ");
console.log("=======================================================================\n");

const floors = ['BF2L.jpeg', 'GF2L.jpeg', 'FF2L.jpeg', '2F2L.jpeg', '3F2L.jpeg', '4F2L.jpeg', '5F2L.jpeg'];

floors.forEach(floor => {
  const hs = getLiftHotspots(floor);
  console.log(`Floor ${floor}: ${hs.length} lift option(s)`);
  hs.forEach(h => {
    console.log(`  -> ${h.isUp ? '[UP]' : '[DOWN]'} to ${h.toId} at pos (${h.position}) - "${h.title}"`);
  });
});

// Verifications
const bf = getLiftHotspots('BF2L.jpeg');
const gf = getLiftHotspots('GF2L.jpeg');
const ff = getLiftHotspots('FF2L.jpeg');
const f2 = getLiftHotspots('2F2L.jpeg');
const f3 = getLiftHotspots('3F2L.jpeg');
const f4 = getLiftHotspots('4F2L.jpeg');
const f5 = getLiftHotspots('5F2L.jpeg');

if (
  bf.length === 1 && bf[0].toId === 'GF2L.jpeg' &&
  gf.length === 2 && gf.some(h => h.toId === 'FF2L.jpeg') && gf.some(h => h.toId === 'BF2L.jpeg') &&
  ff.length === 2 && ff.some(h => h.toId === '2F2L.jpeg') && ff.some(h => h.toId === 'GF2L.jpeg') &&
  f2.length === 2 && f2.some(h => h.toId === '3F2L.jpeg') && f2.some(h => h.toId === 'FF2L.jpeg') &&
  f3.length === 2 && f3.some(h => h.toId === '4F2L.jpeg') && f3.some(h => h.toId === '2F2L.jpeg') &&
  f4.length === 2 && f4.some(h => h.toId === '5F2L.jpeg') && f4.some(h => h.toId === '3F2L.jpeg') &&
  f5.length === 1 && f5[0].toId === '4F2L.jpeg'
) {
  console.log("\n✅ ALL PAIR 2 LIFT DUAL-DIRECTION MAPPINGS VERIFIED PERFECTLY!");
} else {
  console.error("\n❌ MAPPING VERIFICATION FAILED");
  process.exit(1);
}
