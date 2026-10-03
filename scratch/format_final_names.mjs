import fs from 'fs';

const extractedRaw = JSON.parse(fs.readFileSync('c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/scratch/extracted_nodes.json', 'utf8'));

// Add 3.jpeg manually parsed: primary "G14", aliases ["G13", "G14", "G15"]
extractedRaw['3.jpeg'] = {
  primary: 'G14',
  aliases: ['G13', 'G14', 'G15']
};

const existingJson = JSON.parse(fs.readFileSync('c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

const finalData = {};
const allKeys = Object.keys(existingJson);

let aliasCount = 0;
let primaryCount = 0;

for (const id of allKeys) {
  let primary = '';
  let aliases = [];

  if (extractedRaw[id]) {
    primary = (extractedRaw[id].primary || '').trim();
    aliases = Array.isArray(extractedRaw[id].aliases) ? extractedRaw[id].aliases.map(a => typeof a === 'string' ? a.trim() : '').filter(Boolean) : [];
  } else if (existingJson[id]) {
    const raw = existingJson[id];
    if (typeof raw === 'string') {
      primary = raw.trim();
    } else if (Array.isArray(raw)) {
      primary = (raw[0] || '').trim();
      aliases = raw.slice(1).map(a => typeof a === 'string' ? a.trim() : '').filter(Boolean);
    }
  }

  // Deduplicate aliases and exclude primary from aliases list if identical
  aliases = Array.from(new Set(aliases)).filter(a => a && a !== '.' && a !== primary);

  if (primary) primaryCount++;
  aliasCount += aliases.length;

  if (aliases.length > 0) {
    finalData[id] = [primary || '.', ...aliases];
  } else {
    finalData[id] = primary || '.';
  }
}

console.log('Total Panorama Entries:', Object.keys(finalData).length);
console.log('Total Primary Names:', primaryCount);
console.log('Total Aliases Preserved:', aliasCount);

fs.writeFileSync(
  'c:/Users/chinn/OneDrive/Desktop/campus map ccopy/Campusmap/front end/Campus-Map-main/src/data/panorama_location_names.json',
  JSON.stringify(finalData, null, 2),
  'utf8'
);

console.log('Successfully written to src/data/panorama_location_names.json!');
