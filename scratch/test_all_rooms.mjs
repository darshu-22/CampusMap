import { getLocations } from '../front end/Campus-Map-main/src/data/locations.ts';
import { searchLocations } from '../front end/Campus-Map-main/src/utils/searchLocations.ts';

const locs = getLocations();
const roomQueries = [
  '114',
  '115',
  '116',
  '117',
  '103',
  '215',
  '212',
  '210',
  '211',
  '306',
  '320',
  '318',
  '326',
  '421',
  '418',
  '519',
  '517',
  '601',
  'Student Welfare Office',
  'SWO',
  'Student Welfare',
  'Student Welfare Department',
  'Main Gate',
  'Temple'
];

console.log('=== TESTING ACTUAL SEARCH RESULTS ===');
for (const q of roomQueries) {
  const matches = searchLocations(locs, q);
  const top = matches[0];
  console.log(`Query: "${q}" => ${top ? `${top.id} (${top.name})` : 'NO MATCH'}`);
}
