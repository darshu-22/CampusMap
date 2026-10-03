import fs from 'fs';

const wtm = JSON.parse(fs.readFileSync('WTMProject.wtm', 'utf8'));

console.log("WTM Root Keys:", Object.keys(wtm));

if (wtm.panoramas) {
  const sampleId = Object.keys(wtm.panoramas)[0];
  console.log("Sample Panorama ID:", sampleId);
  console.log("Sample Panorama Keys:", Object.keys(wtm.panoramas[sampleId]));
  if (wtm.panoramas[sampleId].hotspots && wtm.panoramas[sampleId].hotspots.length > 0) {
    console.log("Sample Hotspot Keys:", Object.keys(wtm.panoramas[sampleId].hotspots[0]));
    console.log("Sample Hotspot Object:", wtm.panoramas[sampleId].hotspots[0]);
  }
}
