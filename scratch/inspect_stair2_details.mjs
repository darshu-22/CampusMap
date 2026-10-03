import fs from 'fs';

const wtmData = JSON.parse(fs.readFileSync('./WTMProject.wtm', 'utf8'));

console.log("=== WTM EDGES FOR STAIR 2 & ADMIN BLOCK ===");
const panos = ['1.jpeg', 'staircase2.jpeg', 'seminarhallentrance.jpeg', 'adminblock.jpeg', 'adminblockinside.jpeg', 'SWO.jpeg', 'principal.jpeg'];

for (const id of panos) {
  const p = wtmData.panoramas.find(x => x.panofile === id);
  console.log(`\nPano: "${id}" (${p?.title || p?.name})`);
  for (const h of p?.hotspots || []) {
    const target = h.actions?.[0]?.target;
    console.log(`  -> "${target}" | Title: "${h.title}" | Position: "${h.position}"`);
  }
}
