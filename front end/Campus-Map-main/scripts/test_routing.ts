import { findShortestPath, generateRouteSteps } from '../src/utils/routing';

console.log("=== TEST ROUTING ===");

// We use 1.jpeg to 4.jpeg for testing
const test1 = findShortestPath('1.jpeg', '4.jpeg');
console.log("Path 1.jpeg to 4.jpeg:", test1);
if (test1) {
  const steps = generateRouteSteps(test1);
  console.log("Steps:");
  console.log(JSON.stringify(steps, null, 2));
}

// 4.jpeg to 1.jpeg (reverse)
const test2 = findShortestPath('4.jpeg', '1.jpeg');
console.log("\nPath 4.jpeg to 1.jpeg:", test2);
if (test2) {
  const steps2 = generateRouteSteps(test2);
  console.log("Steps:");
  console.log(JSON.stringify(steps2, null, 2));
}

// Unreachable
const test3 = findShortestPath('1.jpeg', 'nonexistent.jpeg');
console.log("\nPath 1.jpeg to nonexistent.jpeg:", test3);

// Same location
const test4 = findShortestPath('1.jpeg', '1.jpeg');
console.log("\nPath 1.jpeg to 1.jpeg:", test4);
