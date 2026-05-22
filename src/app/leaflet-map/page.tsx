import { RouteHeader } from "@/components/AppShell/RouteHeader";
import { LeafletStudyMapClient } from "@/components/map/LeafletStudyMapClient";

export default function LeafletMapPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <RouteHeader
          eyebrow="Part 02"
          title="Leaflet Map"
          description="Use Leaflet to inspect the same Singapore study region from Phase 2, now as a real map with OSM base tiles, top-left overlay switching, and geometry-backed buildings, roads, and POIs."
        />

        <section className="grid gap-4 rounded-[2rem] border border-stone-800 bg-stone-900/40 p-6 text-sm text-stone-300 lg:grid-cols-3">
          <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Base Layer</p>
            <p className="mt-3 leading-6">Public OpenStreetMap tiles rendered in a client-only Leaflet map.</p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Overlay Geometry</p>
            <p className="mt-3 leading-6">
              Building ways are drawn as polygons and road ways are drawn as polylines instead of center-point markers.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Viewer Control</p>
            <p className="mt-3 leading-6">A top-left dropdown switches between all overlays, buildings, roads, and POIs.</p>
          </div>
        </section>

        <LeafletStudyMapClient />
      </div>
    </main>
  );
}
