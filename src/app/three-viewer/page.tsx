import { RouteHeader } from "@/components/AppShell/RouteHeader";
import { ViewerArchitectureDemo } from "@/components/viewer/ViewerArchitectureDemo";

export default function ThreeViewerPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <RouteHeader
          eyebrow="Part 03"
          title="Three.js Viewer"
          description="This route will prove the viewer structure first: one shell, clean mode switching, and separate scene components instead of a single overloaded canvas."
        />

        <ViewerArchitectureDemo />
      </div>
    </main>
  );
}
