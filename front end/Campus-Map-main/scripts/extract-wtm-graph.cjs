const fs = require('fs');
const path = require('path');

const WTM_FILE = 'C:\\Users\\admin\\Desktop\\Campusmap\\WTMProject.wtm';
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'campusGraph.ts');

function runExtraction() {
  console.log(`Reading WTM file: ${WTM_FILE}`);
  
  let rawData;
  try {
    rawData = fs.readFileSync(WTM_FILE, 'utf8');
  } catch (err) {
    console.error("Failed to read WTM file:", err);
    process.exit(1);
  }

  let project;
  try {
    project = JSON.parse(rawData);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    process.exit(1);
  }

  const panoramas = project.panoramas || [];
  
  // Track stats
  let totalNodes = 0;
  let totalEdges = 0;
  let missingTargets = 0;
  let ignoredHotspots = 0;
  let duplicateEdgesCount = 0;
  
  const nodes = {};
  const edgesMap = {}; // fromId -> array of edges
  
  // First pass: Build node map
  panoramas.forEach(pano => {
    const id = pano.panofile;
    let displayName = pano.title || pano.name || id.replace('.jpeg', '').replace('.jpg', '');
    
    nodes[id] = {
      id: id,
      filename: id,
      displayName: displayName,
      imagePath: `/campus/${id}` // Virtual path for now
    };
    totalNodes++;
  });

  // Second pass: Build edges
  panoramas.forEach(pano => {
    const fromId = pano.panofile;
    if (!edgesMap[fromId]) {
      edgesMap[fromId] = [];
    }

    const hotspots = pano.hotspots || [];
    
    const edgeSignatures = new Set();
    
    hotspots.forEach(hs => {
      // Find navigation action
      const actions = hs.actions || [];
      const navAction = actions.find(a => a.type === 0 && a.target);
      
      if (!navAction) {
        ignoredHotspots++;
        return;
      }
      
      const target = navAction.target;
      
      // Validate target
      if (!nodes[target]) {
        missingTargets++;
        console.warn(`[WARNING] Target panorama "${target}" from "${fromId}" not found in panoramas list.`);
        return;
      }
      
      // Check for duplicate edges (same from->to)
      const sig = target;
      if (edgeSignatures.has(sig)) {
        duplicateEdgesCount++;
        // We still add it, or maybe skip? We'll just count it, but let's keep it to maintain all hotspots.
        // Actually, we'll keep it as the user wants ALL 208 if they are valid navigation hotspots.
      }
      edgeSignatures.add(sig);

      edgesMap[fromId].push({
        fromId: fromId,
        toId: target,
        title: hs.title || '',
        position: hs.position || '',
        icon: hs.icon || 'chevronforward.png',
        weight: 1 // hardcoded weight 1 per instructions
      });
      
      totalEdges++;
    });
  });

  // Output stats
  console.log(`--- EXTRACTION STATS ---`);
  console.log(`Panorama Nodes Extracted: ${totalNodes}`);
  console.log(`Navigation Edges Extracted: ${totalEdges}`);
  console.log(`Missing Target Panoramas: ${missingTargets}`);
  console.log(`Ignored Non-navigation Hotspots: ${ignoredHotspots}`);
  console.log(`Duplicate Edges (same target from same source): ${duplicateEdgesCount}`);
  
  console.log(`\n--- Example Connections (up to 10) ---`);
  let count = 0;
  for (const fromId in edgesMap) {
    for (const edge of edgesMap[fromId]) {
      if (count < 10) {
        console.log(`  ${edge.fromId} -> ${edge.toId} [Label: "${edge.title}"] (Pos: ${edge.position})`);
        count++;
      }
    }
  }

  // Generate TypeScript code
  const tsCode = `// GENERATED FILE - DO NOT EDIT MANUALLY
// Extracted from WTMProject.wtm

export interface CampusNode {
  id: string;
  filename: string;
  displayName: string;
  imagePath: string;
}

export interface CampusEdge {
  fromId: string;
  toId: string;
  title: string;
  position: string;
  icon?: string;
  weight: number;
}

export interface CampusGraphData {
  nodes: Record<string, CampusNode>;
  edges: Record<string, CampusEdge[]>;
}

export const campusGraphData: CampusGraphData = {
  nodes: ${JSON.stringify(nodes, null, 4)},
  edges: ${JSON.stringify(edgesMap, null, 4)}
};
`;

  try {
    fs.writeFileSync(OUTPUT_FILE, tsCode, 'utf8');
    console.log(`\nSuccess: Generated ${OUTPUT_FILE}`);
  } catch (err) {
    console.error(`Failed to write output file:`, err);
    process.exit(1);
  }
}

runExtraction();
