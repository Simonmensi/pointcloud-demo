import { PlaceholderPanel } from "@/components/AppShell/PlaceholderPanel";
import { RouteHeader } from "@/components/AppShell/RouteHeader";

export default function PointCloudPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <RouteHeader
          eyebrow="Part 04"
          title="Point Cloud"
          description="This route will load a small static 10k-point JSON sample and render it in the browser before any large-data optimization work starts."
        />

        <PlaceholderPanel
          title="Phase 5 Targets"
          bullets={[
            "Create and store a compact 10k-point sample in public/data.",
            "Render the sample with Three.js Points and BufferGeometry.",
            "Verify smooth browser-side interaction before scaling anything up.",
          ]}
        />
      </div>
    </main>
  );
}
