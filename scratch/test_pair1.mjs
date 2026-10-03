import { PAIR_1_LIFT_EDGES, PAIR_2_LIFT_EDGES, findShortestPath } from '../front end/Campus-Map-main/src/utils/routing.ts';
import fs from 'fs';

console.log('=== VERIFYING PAIR 1 EDGES ===');
let pair1EdgeCount = 0;
for (const [from, edges] of Object.entries(PAIR_1_LIFT_EDGES)) {
  for (const edge of edges) {
    pair1EdgeCount++;
    console.log(`  ${from} -> ${edge.toId} (${edge.title})`);
  }
}
console.log(`Total Pair 1 directed edges: ${pair1EdgeCount}`);

console.log('\n=== VERIFYING PAIR 2 EDGES (UNCHANGED) ===');
let pair2EdgeCount = 0;
for (const [from, edges] of Object.entries(PAIR_2_LIFT_EDGES)) {
  for (const edge of edges) {
    pair2EdgeCount++;
  }
}
console.log(`Total Pair 2 directed edges: ${pair2EdgeCount}`);

console.log('\n=== TESTING PAIR 1 ADJACENT ROUTES ===');
const testRoutes = [
  ['adminblockinside.jpeg', 'admissions.jpeg'],
  ['admissions.jpeg', 'adminblockinside.jpeg'],
  ['admissions.jpeg', '3ndfloorentrance.jpeg'],
  ['3ndfloorentrance.jpeg', 'admissions.jpeg'],
  ['3ndfloorentrance.jpeg', '3FentraNCE.jpeg'],
  ['3FentraNCE.jpeg', '3ndfloorentrance.jpeg'],
  ['3FentraNCE.jpeg', '4thfloorabup.jpeg'],
  ['4thfloorabup.jpeg', '3FentraNCE.jpeg'],
  ['4thfloorabup.jpeg', 'MCA5.jpeg'],
  ['MCA5.jpeg', '4thfloorabup.jpeg'],
];

for (const [from, to] of testRoutes) {
  const path = findShortestPath(from, to);
  console.log(`${from} -> ${to}: ${path ? path.join(' -> ') : 'NO PATH'}`);
}

console.log('\n=== TESTING MULTI-FLOOR ROUTES ===');
const multiRoutes = [
  ['adminblockinside.jpeg', 'MCA5.jpeg'],
  ['MCA5.jpeg', 'adminblockinside.jpeg'],
];

for (const [from, to] of multiRoutes) {
  const path = findShortestPath(from, to);
  console.log(`${from} -> ${to}: ${path ? path.join(' -> ') : 'NO PATH'}`);
}
