import fs from 'fs';

const json = JSON.parse(fs.readFileSync('c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

console.log('=== LIST OF ALL 87 PANORAMAS AND THEIR CURRENT NAMES ===\n');
let count = 1;
for (const [id, val] of Object.entries(json)) {
  const nameStr = Array.isArray(val) ? val.map(x => `"${x}"`).join(', ') : `"${val}"`;
  console.log(`${count.toString().padStart(2, ' ')}. ${id.padEnd(30, ' ')} => ${nameStr}`);
  count++;
}
