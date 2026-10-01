import fs from 'fs';
import path from 'path';
import { getRoute } from '../src/data/routes';
import { campusGraphData } from '../src/data/campusGraph';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

function verifyRoute(fromId: string, toId: string) {
  console.log(`\n--- Testing Route: ${fromId} -> ${toId} ---`);
  const steps = getRoute(fromId, toId);
  
  if (!steps) {
    console.log(`Result: No route found (null).`);
    return;
  }
  
  console.log(`Result: ${steps.length} steps found.`);
  
  steps.forEach((step, idx) => {
    // 1. verify panorama exists in graph
    // The id in our graph is the original panofile. 
    // Wait, in routing.ts, we set `location: currentId` in generateRouteSteps. 
    // Oh wait! Did I set location to displayName in routing.ts?
    // Let me check what generateRouteSteps outputs for location.
    console.log(`  Step ${idx + 1}: ${step.instruction}`);
    console.log(`    Location Label: ${step.location}`);
    console.log(`    Image Path: ${step.image}`);
    
    // 2. verify the image path is correct
    if (!step.image.startsWith('/campus/')) {
       console.error(`    [ERROR] Invalid image path format: ${step.image}`);
    }
    
    // 3. verify the image file exists
    const absoluteImagePath = path.join(publicDir, step.image);
    if (!fs.existsSync(absoluteImagePath)) {
       console.error(`    [ERROR] Image file does not exist at: ${absoluteImagePath}`);
    } else {
       console.log(`    [OK] Image file exists.`);
    }
  });
}

// 5 real routes
// Let's use 1.jpeg to various others. Let's see what is accessible.
const allNodes = Object.keys(campusGraphData.nodes);
console.log(`Total nodes available: ${allNodes.length}`);

const routesToTest = [
  ['1.jpeg', '4.jpeg'], // forward
  ['4.jpeg', '1.jpeg'], // reverse
  ['1.jpeg', 'staircase2.jpeg'],
  ['staircase2.jpeg', 'GF2L.jpeg'],
  ['examsectionhub.jpeg', 'SWO.jpeg']
];

routesToTest.forEach(r => verifyRoute(r[0], r[1]));

// Unreachable route
verifyRoute('1.jpeg', 'nonexistent.jpeg');

// Same location
verifyRoute('2.jpeg', '2.jpeg');
