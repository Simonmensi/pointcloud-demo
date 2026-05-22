# Audit Log

## Purpose

This file is the ongoing change and handoff record for the project.
It should be updated whenever a feature, implementation detail, dependency, or workflow decision changes.

## Update Rule

Update this file whenever any of the following happens:

- a new feature is added
- an existing feature is changed
- a branch introduces meaningful implementation work
- dependencies are added or removed
- architecture or API behavior changes
- a session ends with unfinished work that must be resumed later

Each update should capture:

- what changed
- why it changed
- which files were touched
- current verification status
- next recommended step

## Current Status

- Repository: `pointcloud-demo`
- Active branch: `feature/phase-4-three-viewer`
- Phase 1: ✅ completed
- Phase 2: ✅ completed
- Phase 3: ✅ completed and merged to main
- Phase 4: prepared (not started)

## Recent Decisions

- `PLAN.md` was updated so Phase 1 and Phase 2 match the real project state.
- Phase 3 is being implemented on `feature/phase-3-leaflet-map`, not on `main`.
- Phase 3 uses the geometry-first approach.
- OSM way geometry is now being extracted so:
  - buildings can render as polygons
  - roads can render as polylines
  - POIs can render as markers

## Phase 3 Work Completed In This Session

- Merged `main` into `feature/phase-3-leaflet-map` so the branch includes Phase 2 code.
- Installed:
  - `leaflet`
  - `react-leaflet`
  - `@types/leaflet`
- Extended OSM data model with `geometry` for ways.
- Updated OSM parser to extract way coordinates from node references.
- Replaced the `/leaflet-map` placeholder with a working Leaflet page.
- Added a top-left overlay dropdown.
- Added overlay rendering for:
  - buildings as polygons
  - roads as polylines
  - POIs as circle markers
- Added a client-only wrapper to avoid SSR / `window is not defined` issues.

## Files Changed In This Session

- `PLAN.md`
- `package.json`
- `package-lock.json`
- `src/app/globals.css`
- `src/app/leaflet-map/page.tsx`
- `src/lib/osm-overpass.ts`
- `src/lib/osm-parser.ts`
- `src/components/map/LeafletStudyMap.tsx`
- `src/components/map/LeafletStudyMapClient.tsx`

## Verification

The following checks passed after the Phase 3 work above:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Important Product Context

- Phase 2 uses the OSM Direct Export API rather than Overpass for this Singapore study area.
- Reason: Overpass results were stale for the selected region.
- Phase 3 was intentionally upgraded from center-point overlays to geometry-backed overlays.
- This better supports future 3D viewer work in Phase 4.

## Boss Discussion Context

The boss asked about:

1. What OSM-exported data can support a 3D viewer
2. Whether route generation like Google Maps is possible
3. Whether the stack is open source and how pricing might work

Key points already established:

- OSM can provide buildings, roads, POIs, tags, and coordinates.
- To support 3D building extrusion properly, building boundary geometry is needed, not just center points.
- Route generation is possible, but requires a routing service such as OSRM or OpenRouteService.
- Open source options exist across map rendering, IFC handling, and routing, but some tile or hosted services may still have pricing constraints.

## Phase 3 Completion Summary

**Status:** ✅ Complete and verified in browser

All Phase 3 checklist items completed:
- [x] Install `leaflet` + `react-leaflet` (dynamic import for SSR compatibility)
- [x] Render an OSM tile layer as the base map
- [x] Add a top-left toggle dropdown to switch overlay layers
- [x] Show building / road / POI overlays from Overpass results
- [x] Verify: interactive map with working layer toggles

**Browser Verification Results:**
- Map loads with OSM base tiles
- Overlay dropdown switches between All/Buildings/Roads/POIs modes
- 108 buildings render as amber polygons with correct geometry
- 345 roads render as blue polylines with correct geometry
- 258 POIs render as green dots with correct coordinates
- Interactive popups show feature names, primary tags, and lat/lon
- Zoom/pan controls respond smoothly
- No console errors or SSR issues

**GitHub PR:**
- PR #2 created on feature/phase-3-leaflet-map → main
- All CI checks pass: lint, build, type checking
- Ready for review and merge

## Next Steps

1. ✅ Phase 3 complete, merged to main (PR #2 and #3)
2. ✅ Layout fix applied and verified
3. ✅ Phase 4 branch prepared (`feature/phase-4-three-viewer` synced with main)
4. ⏳ **Awaiting instruction to begin Phase 4 implementation**
5. Phase 4 tasks: Install Three.js dependencies → implement mode-switching architecture → verify memory leaks
6. Phase 4 deliverable: Clean scene mode-switching (IFC/Map/PointCloud/Mesh) with OrbitControls
