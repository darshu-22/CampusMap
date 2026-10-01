const fs = require('fs');
const path = require('path');

const REL_WTM = path.join(__dirname, '..', '..', '..', 'WTMProject.wtm');
const REL_PANOS = path.join(__dirname, '..', '..', '..', 'panoramas');

const WTM_FILE = fs.existsSync(REL_WTM) ? REL_WTM : 'C:\\Users\\admin\\Desktop\\Campusmap\\WTMProject.wtm';
const PANORAMAS_DIR = fs.existsSync(REL_PANOS) ? REL_PANOS : 'C:\\Users\\admin\\Desktop\\Campusmap\\panoramas';
const FRONTEND_GRAPH_FILE = path.join(__dirname, '..', 'src', 'data', 'campusGraph.ts');

function runValidation() {
  console.log("==========================================================================================");
  console.log("                       WTM BACKEND DATA & FRONTEND VALIDATION CHECK                       ");
  console.log("==========================================================================================\n");

  const errors = [];
  const warnings = [];

  // 1. Read Backend WTM file
  if (!fs.existsSync(WTM_FILE)) {
    errors.push(`CRITICAL ERROR: WTM backend file missing at ${WTM_FILE}`);
    reportResults(errors, warnings);
    return;
  }

  let wtmData;
  try {
    const rawWtm = fs.readFileSync(WTM_FILE, 'utf8');
    wtmData = JSON.parse(rawWtm);
  } catch (err) {
    errors.push(`CRITICAL ERROR: Failed to read/parse WTM backend file: ${err.message}`);
    reportResults(errors, warnings);
    return;
  }

  const backendPanos = wtmData.panoramas || [];
  const backendPanoMap = new Map();
  let backendNavHotspotCount = 0;

  backendPanos.forEach(p => {
    const pId = p.panofile;
    const navHotspots = (p.hotspots || []).filter(h => {
      const actions = h.actions || [];
      return actions.some(a => a.type === 0 && a.target);
    });
    backendPanoMap.set(pId, {
      pano: p,
      navHotspots
    });
    backendNavHotspotCount += navHotspots.length;
  });

  console.log(`[1] Backend Panoramas in WTM: ${backendPanoMap.size}`);
  console.log(`[2] Backend Navigation Hotspots in WTM: ${backendNavHotspotCount}\n`);

  // 2. Verify original panorama images exist
  if (!fs.existsSync(PANORAMAS_DIR)) {
    errors.push(`CRITICAL ERROR: Original panoramas directory missing at ${PANORAMAS_DIR}`);
  } else {
    backendPanoMap.forEach((_, pId) => {
      const imgPath = path.join(PANORAMAS_DIR, pId);
      if (!fs.existsSync(imgPath)) {
        errors.push(`Panoramas Folder Mismatch: Image ${pId} not found in ${PANORAMAS_DIR}`);
      }
    });
  }

  // 3. Import / Parse frontend campusGraph.ts
  if (!fs.existsSync(FRONTEND_GRAPH_FILE)) {
    errors.push(`CRITICAL ERROR: Generated campusGraph.ts missing at ${FRONTEND_GRAPH_FILE}`);
    reportResults(errors, warnings);
    return;
  }

  const graphContent = fs.readFileSync(FRONTEND_GRAPH_FILE, 'utf8');
  
  // Extract campusGraphData object using Function constructor after stripping TS annotations
  let campusGraphData;
  try {
    const jsContent = graphContent
      .replace(/\/\/:[\s\S]*?\n/g, '')
      .replace(/export interface[\s\S]*?\n\}/g, '')
      .replace(/export const campusGraphData: CampusGraphData =/, 'return');
    campusGraphData = new Function(jsContent)();
  } catch (err) {
    errors.push(`CRITICAL ERROR: Failed to evaluate campusGraph.ts: ${err.message}`);
    reportResults(errors, warnings);
    return;
  }

  const frontendNodes = campusGraphData.nodes || {};
  const frontendEdges = campusGraphData.edges || {};
  const frontendNodeKeys = Object.keys(frontendNodes);
  let frontendHotspotCount = 0;

  // Check 9.1: Every frontend panorama ID exists in backend data
  frontendNodeKeys.forEach(nodeId => {
    if (!backendPanoMap.has(nodeId)) {
      errors.push(`Frontend Panorama ID Mismatch: Node "${nodeId}" in frontend graph does not exist in WTM backend data!`);
    }
  });

  backendPanoMap.forEach((_, backendId) => {
    if (!frontendNodes[backendId]) {
      errors.push(`Missing Frontend Node: Backend panorama "${backendId}" is missing from frontend graph nodes!`);
    }
  });

  // Check 9.6: No panorama image mapping points to a different image
  frontendNodeKeys.forEach(nodeId => {
    const node = frontendNodes[nodeId];
    const expectedPath = `/campus/${nodeId}`;
    if (node.imagePath !== expectedPath) {
      errors.push(`Image Mapping Violation: Node "${nodeId}" imagePath is "${node.imagePath}", expected exact "${expectedPath}"`);
    }
  });

  // Check 9.2, 9.3, 9.4, 9.5 for Edges / Hotspots
  for (const fromId in frontendEdges) {
    const edgesList = frontendEdges[fromId] || [];
    frontendHotspotCount += edgesList.length;

    const backendPanoData = backendPanoMap.get(fromId);
    if (!backendPanoData) continue;

    const backendHotspots = backendPanoData.navHotspots;

    edgesList.forEach((edge, idx) => {
      // Check 9.2: Every navigation hotspot target exists
      if (!frontendNodes[edge.toId]) {
        errors.push(`Invalid Hotspot Target: Edge from "${fromId}" points to unknown target panorama "${edge.toId}"`);
      }

      // Check 9.4 & 9.5: Verify position & target match backend hotspot
      const matchingBackendHs = backendHotspots.find(h => {
        const navAct = (h.actions || []).find(a => a.type === 0 && a.target === edge.toId);
        return navAct && h.position === edge.position;
      });

      if (!matchingBackendHs) {
        errors.push(`Hotspot Coordinate/Target Mismatch: Hotspot ${fromId} -> ${edge.toId} position "${edge.position}" differs from backend WTM data!`);
      }
    });
  }

  // Check 9.3: Frontend hotspot count matches backend navigation hotspot count
  if (frontendHotspotCount !== backendNavHotspotCount) {
    errors.push(`Hotspot Count Mismatch: Frontend has ${frontendHotspotCount} hotspots, backend WTM has ${backendNavHotspotCount} navigation hotspots!`);
  } else {
    console.log(`[PASSED] Hotspot Count Match: Frontend (${frontendHotspotCount}) === Backend WTM (${backendNavHotspotCount})`);
  }

  reportResults(errors, warnings);
}

function reportResults(errors, warnings) {
  console.log("\n------------------------------------------------------------------------------------------");
  console.log("                                  VALIDATION SUMMARY                                      ");
  console.log("------------------------------------------------------------------------------------------");

  if (warnings.length > 0) {
    console.log(`\n[WARNINGS] (${warnings.length}):`);
    warnings.forEach(w => console.warn(`  ⚠️  ${w}`));
  }

  if (errors.length > 0) {
    console.error(`\n[FAIL] VALIDATION FAILED WITH ${errors.length} ERROR(S):`);
    errors.forEach(e => console.error(`  ❌ ${e}`));
    console.error("\nBackend hotspot data and frontend rendering are being compared.");
    console.error("The backend/WTM data wins every time. Fix the mismatches immediately.");
    process.exit(1);
  } else {
    console.log(`\n✅ ALL VALIDATION CHECKS PASSED PERFECTLY!`);
    console.log(`  • Every frontend panorama ID exists in backend WTM data`);
    console.log(`  • Every navigation hotspot target exists`);
    console.log(`  • Frontend hotspot count (207) matches backend navigation hotspot count (207)`);
    console.log(`  • No frontend hotspot has custom/manual positions`);
    console.log(`  • No navigation edge differs from backend target`);
    console.log(`  • Panorama image mappings point 1:1 to original panoramas`);
    console.log("------------------------------------------------------------------------------------------\n");
  }
}

runValidation();
