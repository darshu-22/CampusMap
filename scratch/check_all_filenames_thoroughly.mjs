import fs from 'fs';
import path from 'path';

const rootDir = 'c:\\Users\\admin\\Desktop\\Campusmap';
const names = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

const allJpegsOnDisk = fs.readdirSync(rootDir).filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));

console.log(`Total JPEG files directly in root directory: ${allJpegsOnDisk.length}`);
console.log(`Total keys in panorama_location_names.json: ${Object.keys(names).length}`);

// Let's print all filenames on disk sorted alphabetically
console.log("\n=== ALL JPEG FILENAMES ON DISK ===");
allJpegsOnDisk.sort().forEach(f => console.log(`  - ${f}`));
