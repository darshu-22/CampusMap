# Campus Map

An interactive, visual 360° campus navigation web application built for **Atria Institute of Technology**.

Campus Map enables students, faculty, and visitors to search for locations by room numbers, department names, or common aliases, calculate optimal walking routes across campus floors, and navigate through interactive 360° photo panoramas and visual node graphs.

---

## Features

- **Interactive Campus Path Finding**: Find step-by-step directions between any two locations across campus floors and buildings.
- **Source & Destination Search**: Intelligent location search powered by fuzzy matching, room number extraction, and acronym resolution.
- **Searchable Panorama Names & Aliases**: Supports primary display names alongside unlimited aliases (e.g., searching `SWO`, `Student Welfare`, or `Student Welfare Office` maps directly to the same panorama without duplicating route nodes).
- **360° Campus Exploration**: Immersive equirectangular panorama viewing for open-world exploration of campus spaces.
- **Route-Guided 360° Navigation**: Interactive photo navigation that guides users along their calculated path step-by-step.
- **Visual Campus Panorama Navigation**: Interactive 2D schematic graph visualization of campus nodes and interconnecting floor layouts.
- **Dijkstra-Based Shortest-Path Routing**: Graph-based pathfinding engine calculating optimal paths across all campus nodes.
- **WTM-Derived Campus Graph**: 87 campus panoramas and 207 navigation hotspots derived from World Tour Mapper (WTM) spatial data.
- **Lift-Based Vertical Navigation**: Multi-floor vertical path calculation connecting ground, 1st, 2nd, 3rd, 4th, 5th, 6th floors and basement.
  - **Pair 1 Lifts**: Multi-story central lift connections.
  - **Pair 2 Lifts**: Secondary vertical wing lift connections.
- **Step-by-Step Route Guidance**: Visual thumbnail cards, turn indicators, and arrival notification banners.
- **Panorama Hotspot Navigation**: On-screen directional hotspot markers rendered within 360° panoramas.
- **Panorama Location Naming Interface**: Built-in administrative tool to assign, edit, and export human-readable primary names and search aliases for all 87 panoramas.

---

## Technology Stack

- **Frontend Core**: React 19, TypeScript, Vite 8
- **360° Panorama Engine**: Photo Sphere Viewer (`@photo-sphere-viewer/core`, `@photo-sphere-viewer/markers-plugin`)
- **Icons & UI**: Lucide React, Framer Motion, Tailwind CSS
- **Code Quality**: Oxlint, TypeScript compiler (`tsc`)
- **Runtime Environment**: Node.js / npm

---

## Project Structure

```text
Campus-Map-main/
├── public/
│   └── campus/               # 87 equirectangular panorama JPEG images
├── scripts/
│   ├── extract-wtm-graph.cjs # Graph extraction script from WTM project data
│   └── validate-wtm.cjs      # Validation script comparing frontend graph to WTM backend
├── src/
│   ├── components/           # UI Components (PhotoViewer, RouteSearch, LocationSelector, etc.)
│   ├── data/
│   │   ├── campusGraph.ts    # Graph nodes and interconnecting edges
│   │   ├── destinations.ts  # Defined campus destination anchors
│   │   ├── locations.ts     # Dynamically generated location objects with search aliases
│   │   ├── panoramaMetadata.ts # Display metadata normalizer and helper functions
│   │   └── panorama_location_names.json # Permanent source of truth for names & aliases
│   ├── pages/                # Page components (Home, View360Page, NetworkMapPage, etc.)
│   ├── types/                # TypeScript type definitions
│   └── utils/
│       ├── panorama.ts       # Panorama helper utilities and image paths
│       ├── routing.ts        # Dijkstra pathfinding algorithm and route options
│       └── searchLocations.ts # Fuzzy search matching and alias resolution engine
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Key Files:
- **`panorama_location_names.json`**: Permanent source of truth storing primary display names and searchable alias arrays for all 87 campus panoramas.
- **`campusGraph.ts`**: Contains the complete campus navigation graph structure (87 nodes, 207 hotspots, lift edges).
- **`routing.ts`**: Implements Dijkstra-based pathfinding, route option generation (lift vs stairs), and step instructions.
- **`PhotoViewer.tsx`**: Renders 360° equirectangular panoramas, directional hotspots, and route-guided navigation markers.
- **`public/campus/`**: Contains the high-resolution panorama image assets (`1.jpeg` through `18.jpeg`, `maingate.jpeg`, `SWO.jpeg`, etc.).

---

## Panorama Naming

Each campus panorama is identified by a permanent node filename key (e.g. `SWO.jpeg`, `9.jpeg`, `4.jpeg`).

The naming system maps each key to:
- A **Primary Display Name** (e.g. `Student Welfare Office`, `DIGITAL SIGNAL PROCESSING LAB (215)`).
- Multiple **Searchable Aliases** (e.g. `SWO`, `Student Welfare`, `215`, `216`).

All aliases resolve to the same underlying panorama node, allowing users to search using shorthand or room numbers without duplicating route nodes.

---

## Routing

The routing engine operates over the campus navigation graph using Dijkstra's shortest-path algorithm. When a user selects a source and destination, the router:
1. Resolves the user's search query to the exact target node ID.
2. Computes the optimal path through the graph nodes and edges.
3. Generates step-by-step instructions, turn directions, floor transition indicators, and photo steps.

---

## 360° Viewer

- **Open-World Exploration**: Navigate freely between connected panoramas using interactive 360° directional hotspots.
- **Route-Guided Mode**: During active route navigation, hotspots on the calculated path are highlighted to guide the user visually.
- **Lift Navigation**: Transitions seamlessly between floor levels through virtual lift hotspots.

---

## Lift Navigation

Where physical vertical elevator shafts connect different building floors without intermediate physical navigation hotspots, virtual lift connections are incorporated into the graph:
- **Pair 1 Lifts**: Main central building elevator connections across ground through 6th floors.
- **Pair 2 Lifts**: Secondary wing elevator connections providing vertical routing options.

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## Development

Run the Vite development server locally:

```bash
npm run dev
```

The application will start locally on `http://localhost:5173/` (or the port specified in terminal output).

---

## Validation

Verify that the frontend graph structure matches the WTM spatial backend dataset:

```bash
npm run validate
```

---

## Production Build

Compile and bundle the production assets:

```bash
npm run build
```

The production output will be generated in the `dist/` directory.

---

## Deployment

This application can be deployed as a static frontend bundle to web hosting platforms such as **Vercel**, **Netlify**, or **GitHub Pages**.

> **Important**: Ensure the `public/campus/` directory containing all 87 panorama JPEG image assets is included in your deployment.

---

## Important Data

The application relies directly on the 87 panorama image assets located in:

```text
public/campus/
```

These assets are required for 360° photo viewer rendering and visual step navigation.

---

## Credits

Developed for **Atria Institute of Technology**, Bengaluru.

---

## License

License information has not yet been specified.
