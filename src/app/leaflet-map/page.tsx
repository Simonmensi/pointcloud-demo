import { PlaceholderPanel } from "@/components/AppShell/PlaceholderPanel";
import { RouteHeader } from "@/components/AppShell/RouteHeader";

export default function LeafletMapPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <RouteHeader
          eyebrow="Part 02"
          title="Leaflet Map"
          description="This route will host the first interactive map: OSM base tiles, a top-left dropdown, and toggles for buildings, roads, and POIs."
        />

        <PlaceholderPanel
          title="Phase 3 Targets"
          bullets={[
            "Install Leaflet and react-leaflet with client-only rendering where needed.",
            "Render an OSM basemap inside the Next.js page.",
            "Add a top-left dropdown for overlay switching.",
          ]}
        />
      </div>
    </main>
  );
}
