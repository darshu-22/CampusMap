import fs from 'fs';

const graphCode = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');

console.log("campusGraph.ts total length:", graphCode.length);
console.log("Checking if campusGraph.ts contains any custom weights...");

const matches = graphCode.match(/weight:\s*([0-9\.]+)/g) || [];
const weightVals = new Set(matches.map(m => m.replace('weight:', '').trim()));
console.log("Unique weight strings in campusGraph.ts:", Array.from(weightVals));
