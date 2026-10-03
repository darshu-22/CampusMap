import fs from 'fs';

// 1. Read WTMProject.wtm
const wtmContent = fs.readFileSync('./WTMProject.wtm', 'utf8');
const wtmData = JSON.parse(wtmContent);

console.log("=== WTM PROJECT PANORAMAS & HOTSPOTS ===");

// Find relevant panoramas by searching names/titles
const panoramas = wtmData.panoramas || [];
console.log(`Total panoramas in WTM: ${panoramas.length}`);

// Map of pano id/name to node info
const panoMap = {};
for (const p of panoramas) {
  const name = p.name || p.filename || p.title || p.id;
  const caption = p.caption || p.title || p.name || '';
  panoMap[name] = {
    id: name,
    caption: caption,
    hotspots: (p.hotspots || []).map(h => ({
      target: h.targetPanorama || h.target || h.pano,
      title: h.title || h.text || ''
    }))
  };
}

// Print panoramas related to Ground, SWO, Principal, Admin, Stair 2
const keywords = ['ground', 'swo', 'principal', 'admin', 'stair'];
for (const [id, info] of Object.entries(panoMap)) {
  const lower = (id + ' ' + info.caption).toLowerCase();
  if (keywords.some(k => lower.includes(k))) {
    console.log(`\nPano ID: "${id}" | Caption: "${info.caption}"`);
    console.log("  Hotspots:");
    for (const h of info.hotspots) {
      console.log(`    -> Target: "${h.target}" | Title: "${h.title}"`);
    }
  }
}
