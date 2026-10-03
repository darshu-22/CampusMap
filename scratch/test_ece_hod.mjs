import { getLocations } from '../front end/Campus-Map-main/src/data/locations.ts';
import { searchLocations } from '../front end/Campus-Map-main/src/utils/searchLocations.ts';

const locs = getLocations();
const queries = [
  'ECE HOD',
  '104',
  'ECE HOD(104)',
  'ECE HOD (104)',
  'ece',
  'hod 104'
];

console.log('=== TEST SEARCH FOR NEWLY ADDED ECE HOD (104) ===');
for (const q of queries) {
  const matches = searchLocations(locs, q);
  const top = matches[0];
  console.log(`Query: "${q}" => ${top ? `${top.id} (${top.name})` : 'NO MATCH'}`);
}
