import fs from 'fs';

const json = JSON.parse(fs.readFileSync('c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));
const leveldb = JSON.parse(fs.readFileSync('c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/scratch/extracted_nodes.json', 'utf8'));

console.log('=== SEARCH FOR "113" IN panorama_location_names.json ===');
for (const [k, v] of Object.entries(json)) {
  const str = JSON.stringify(v);
  if (str.includes('113')) {
    console.log('JSON Match:', k, '=>', v);
  }
}

console.log('\n=== SEARCH FOR "113" IN localStorage LEVELDB EXTRACTED DATA ===');
for (const [k, v] of Object.entries(leveldb)) {
  const str = JSON.stringify(v);
  if (str.includes('113')) {
    console.log('LocalStorage LevelDB Match:', k, '=>', v);
  }
}

console.log('\n=== CHECK ALL NUMERICAL AND CLASSROOM ROOM NUMBERS IN DATASETS ===');
for (const [k, v] of Object.entries(json)) {
  const str = typeof v === 'string' ? v : (Array.isArray(v) ? v.join(' ') : '');
  if (/\b\d{3}\b/.test(str)) {
    console.log('Room Number Node:', k, '=>', v);
  }
}
