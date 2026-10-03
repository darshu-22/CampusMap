import fs from 'fs';

const tmp = 'c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/scratch/temp_log.log';
const buf = fs.readFileSync(tmp);
const str = buf.toString('binary');
const pos = str.indexOf('campus_map_panorama_naming_data_v1');
const utf16Clean = str.substring(pos).replace(/\x00/g, '');

const p = utf16Clean.indexOf('"3.jpeg"');
console.log('Snippet around 3.jpeg:');
console.log(utf16Clean.substring(p, p + 200));
