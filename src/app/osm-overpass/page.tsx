import { OSMPrimer } from "@/components/osm/OSMPrimer";
import { OverpassLearningPanel } from "@/components/osm/OverpassLearningPanel";
import { RouteHeader } from "@/components/AppShell/RouteHeader";

export default function OsmOverpassPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <RouteHeader
          eyebrow="Part 01"
          title="OSM + Overpass"
          description="Learn the OSM object model first, then run 3 real Overpass examples against one Singapore study region so the returned data is understandable before it reaches Leaflet or Three.js."
        />

        <OSMPrimer />
        <OverpassLearningPanel />
      </div>
    </main>
  );
}
