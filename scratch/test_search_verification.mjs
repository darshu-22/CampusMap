import { getLocations } from '../front end/Campus-Map-main/src/data/locations.ts';
import { searchLocations } from '../front end/Campus-Map-main/src/utils/searchLocations.ts';

const locs = getLocations();
const queries = [
  'Student Welfare Office',
  'SWO',
  'Student Welfare',
  'Student Welfare Department',
  'DIGITAL SIGNAL PROCESSING LAB (215)',
  '215',
  'Admin Block Lobby',
  'Admin Lobby',
  'Analog circuits lab (102)',
  'COE advanced cloud and data engineering lab (326)',
  'Main Gate',
  'Temple',
  'AU Building Pathway'
];

console.log('--- TEST RESULTS ---');
for (const q of queries) {
  const matches = searchLocations(locs, q);
  const top = matches[0];
  console.log(`Query: "${q}" => ${top ? `${top.id} (${top.name})` : 'NO MATCH'}`);
}
