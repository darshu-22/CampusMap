import fs from 'fs';
import { getLocations } from '../front end/Campus-Map-main/src/data/locations.ts';
import { searchLocations } from '../front end/Campus-Map-main/src/utils/searchLocations.ts';

const jsonPath = 'c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/front end/Campus-Map-main/src/data/panorama_location_names.json';
const raw = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(raw);

console.log('=== VERIFICATION OF PERMANENT JSON DATA ===');
console.log('Valid JSON: YES');
console.log('Total Panorama Entries:', Object.keys(data).length);

console.log('\n=== EXAMPLE VERIFICATIONS ===');
console.log('SWO.jpeg:', data['SWO.jpeg']);
console.log('adminblockinside.jpeg:', data['adminblockinside.jpeg']);
console.log('9.jpeg:', data['9.jpeg']);
console.log('principal.jpeg:', data['principal.jpeg']);

console.log('\n=== SEARCH ENGINE TEST RESULTS ===');
const locs = getLocations();
const testQueries = [
  'Student Welfare Office',
  'SWO',
  'Admin Block Lobby',
  'Admin Lobby',
  'DIGITAL SIGNAL PROCESSING LAB (215)',
  '215',
  "Chairman's Office",
  'Board Room'
];

for (const q of testQueries) {
  const matches = searchLocations(locs, q);
  const top = matches[0];
  console.log(`Query: "${q}" => ${top ? `${top.id} (${top.name})` : 'NO MATCH'}`);
}
