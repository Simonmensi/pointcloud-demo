# PointCloud Demo — Project Plan

> **Repo:** [Simonmensi/pointcloud-demo](https://github.com/Simonmensi/pointcloud-demo)
> **Created:** 2026-05-12
> **Status:** Planning

---

## Goal

Build a small Next.js demo app that teaches and demonstrates four core topics
through independent, self-contained routes:

1. **OSM + Overpass Turbo basics** — query buildings/roads/POIs and understand OSM data.
2. **Leaflet in Next.js** — render an OSM base map with overlays.
3. **Three.js viewer architecture** — clean mode-switch / scene management.
4. **Point cloud proof of concept** — render a static 10 000-point JSON sample.

---

## Architecture

```
pointcloud-demo/
├── src/
│   └── app/
│       ├── page.tsx               # / — Home with 4 cards
│       ├── osm-overpass/
│       │   └── page.tsx           # /osm-overpass
│       ├── leaflet-map/
│       │   └── page.tsx           # /leaflet-map
│       ├── three-viewer/
│       │   └── page.tsx           # /three-viewer
│       └── point-cloud/
│           └── page.tsx           # /point-cloud
├── public/
│   └── data/
│       └── sample-10k-points.json # Static point cloud sample
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── PLAN.md
```

### Tech Stack

| Layer       | Choice                    | Notes                                           |
|-------------|---------------------------|--------------------------------------------------|
| Framework   | Next.js 15+ (App Router)  | Same pattern as `simon_three_test`              |
| Language    | TypeScript                | Strict mode                                      |
| Styling     | Tailwind CSS v4           | Utility-first                                    |
| Mapping     | Leaflet (v1 primary)      | Keep architecture open to MapLibre later         |
| 3D          | Three.js + React Three Fiber | Scene-mode switching pattern                |
| Point Cloud | Static 10k JSON           | No server-side pipeline needed for v1            |

---

## Phases

### Phase 1 — Project Scaffold
- [ ] Initialize Next.js app with TypeScript and Tailwind CSS
- [ ] Create the 5 routes (`/`, `/osm-overpass`, `/leaflet-map`, `/three-viewer`, `/point-cloud`)
- [ ] Build the home page with 4 navigation cards
- [ ] Add placeholder content to each route page
- [ ] Push initial scaffold to `main`

### Phase 2 — OSM + Overpass Basics
- [ ] Add an OSM data primer page explaining core objects (nodes, ways, relations, tags)
- [ ] Integrate Overpass API querying for a sample region (buildings, roads, POIs)
- [ ] Display query results in a readable table / summary
- [ ] Add 2–3 runnable Overpass examples with copy-paste queries
- [ ] Verify: user can understand OSM structure and run basic Overpass queries

### Phase 3 — Leaflet Map
- [ ] Install `leaflet` + `react-leaflet` (dynamic import for SSR compatibility)
- [ ] Render an OSM tile layer as the base map
- [ ] Add a top-left toggle dropdown to switch overlay layers
- [ ] Show building / road / POI overlays from Overpass results (or GeoJSON samples)
- [ ] Verify: interactive map with working layer toggles

### Phase 4 — Three.js Viewer Architecture
- [ ] Install `three` + `@react-three/fiber` + `@react-three/drei`
- [ ] Build a scene container with clean mode switching (e.g. wireframe / solid / point)
- [ ] Demonstrate component swap pattern for different viewer modes
- [ ] Add basic OrbitControls and lighting
- [ ] Verify: scene modes switch cleanly without leaks or stale state

### Phase 5 — Point Cloud POC
- [ ] Create a static 10 000-point JSON sample file in `public/data/`
- [ ] Load and render points using Three.js `BufferGeometry` + `Points`
- [ ] Apply basic color mapping (e.g. height-based gradient)
- [ ] Add camera controls for rotation / zoom
- [ ] Verify: 10k points render smoothly in the browser

### Phase 6 — Polish & Integration
- [ ] Finalize navigation and consistent UI across all routes
- [ ] Add brief README with setup instructions and learning notes
- [ ] Ensure no cross-route state leaks
- [ ] Final review against acceptance criteria below

---

## Acceptance Criteria

| # | Criteria | Phase |
|---|----------|-------|
| 1 | Explain OSM core objects (nodes, ways, relations) and common tags | 2 |
| 2 | Run 2–3 basic Overpass examples for one region and display results | 2 |
| 3 | Show building/road/POI overlays on a Leaflet map with layer toggle | 3 |
| 4 | Demonstrate clean Three.js mode-switch architecture (component swap) | 4 |
| 5 | Render a 10k point cloud sample in the browser with camera controls | 5 |

---

## Scope Guardrails (v1)

| Out of scope for v1           | Reason                           |
|-------------------------------|----------------------------------|
| Deep GIS / cartography theory  | Teaching focus, not academic     |
| Tile-server setup              | Use public OSM tiles             |
| Vector-tile pipeline           | Unnecessary complexity           |
| Large point cloud (12M+ pts)   | v1 uses static 10k sample       |
| Point cloud optimization       | Keep it simple first             |
| Forced 2D/3D synchronization   | Routes are independent demos     |

---

## Notes

- Leaflet is the primary mapping library. Architecture should allow MapLibre as a drop-in later, but MapLibre is **not** the first implementation.
- Each route should be self-contained and independently viewable.
- The point cloud data file should be small enough to commit directly (target < 500 KB).
