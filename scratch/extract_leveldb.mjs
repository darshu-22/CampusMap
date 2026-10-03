import fs from 'fs';
import path from 'path';

const tmp = 'c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/scratch/temp_log.log';
const buf = fs.readFileSync(tmp);
const str = buf.toString('binary');
const pos = str.indexOf('campus_map_panorama_naming_data_v1');
const utf16Clean = str.substring(pos).replace(/\x00/g, '');

const entryRegex = /"([^"]+\.jpeg)"\s*:\s*(\{(?:[^{}]|\{[^{}]*\})*\})/g;
let m;
const extracted = {};
while ((m = entryRegex.exec(utf16Clean)) !== null) {
  const key = m[1];
  try {
    const val = JSON.parse(m[2]);
    extracted[key] = val;
  } catch(e) {
    console.log('Error parsing key:', key, e.message);
  }
}

console.log('Extracted nodes count:', Object.keys(extracted).length);
fs.writeFileSync('c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/scratch/extracted_nodes.json', JSON.stringify(extracted, null, 2));
