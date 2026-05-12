import { PlaceholderPanel } from "@/components/AppShell/PlaceholderPanel";
import { RouteHeader } from "@/components/AppShell/RouteHeader";

export default function OsmOverpassPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <RouteHeader
          eyebrow="Part 01"
          title="OSM + Overpass"
          description="This route will explain OSM nodes, ways, relations, and tags, then show simple Overpass queries for buildings, roads, and POIs in one region."
        />

        <PlaceholderPanel
          title="Phase 2 Targets"
          bullets={[
            "Document the OSM object model: nodes, ways, relations, and tags.",
            "Add 2 to 3 runnable Overpass examples for one chosen region.",
            "Show readable results so the data structure is easier to understand.",
          ]}
        />
      </div>
    </main>
  );
}
