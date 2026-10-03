import fs from 'fs';

// Read campusGraph.ts or extract data from it
const content = fs.readFileSync('./front end/Campus-Map-main/src/data/campusGraph.ts', 'utf8');
const namesJson = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

// Parse edges and nodes from file content using regex or evaluating
// Let's inspect nodes and edges matching 5th floor, lift, staircases
console.log("=== NODES IN PANORAMA LOCATION NAMES ===");
const nodesByFloor = {};

for (const [id, name] of Object.entries(namesJson)) {
  let floor = "Other";
  const lower = (id + " " + name).toLowerCase();
  if (lower.includes("5f") || lower.includes("5th") || id === "16.jpeg" || id === "17.jpeg" || id === "18.jpeg" || lower.includes("mca5")) {
    floor = "5th Floor";
  } else if (lower.includes("4f") || lower.includes("4th") || id === "13.jpeg" || id === "14.jpeg" || id === "15.jpeg" || lower.includes("mba")) {
    floor = "4th Floor";
  } else if (lower.includes("3f") || lower.includes("3rd") || lower.includes("3nd") || id === "10.jpeg" || id === "11.jpeg" || id === "12.jpeg") {
    floor = "3rd Floor";
  } else if (lower.includes("2f") || lower.includes("2nd") || id === "7.jpeg" || id === "8.jpeg" || id === "9.jpeg") {
    floor = "2nd Floor";
  } else if (lower.includes("1f") || lower.includes("ff") || lower.includes("1st") || id === "4.jpeg" || id === "5.jpeg" || id === "6.jpeg" || lower.includes("vyom")) {
    floor = "1st Floor";
  } else if (lower.includes("gf") || lower.includes("ground") || id === "1.jpeg" || id === "2.jpeg" || id === "3.jpeg") {
    floor = "Ground Floor";
  } else if (lower.includes("bf") || lower.includes("basement") || lower.includes("exam")) {
    floor = "Basement";
  } else if (lower.includes("6th")) {
    floor = "6th Floor";
  }

  if (!nodesByFloor[floor]) nodesByFloor[floor] = [];
  nodesByFloor[floor].push({ id, name });
}

for (const [floor, list] of Object.entries(nodesByFloor)) {
  console.log(`\n--- ${floor} (${list.length} nodes) ---`);
  list.forEach(n => console.log(`  [${n.id}] ${n.name}`));
}
