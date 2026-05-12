"use client";

import { useState } from "react";
import { MapComponentPlaceholder } from "@/components/map/MapComponentPlaceholder";
import { TopLeftTogglePanel } from "@/components/viewer/TopLeftTogglePanel";
import { viewerModeLabels, type ViewerMode } from "@/components/viewer/types";

const canvasCapabilities = [
  "Load IFC / Fragment / GLB / Mesh",
  "Load Point Cloud",
  "Add Markers",
];

const coordinateCapabilities = [
  "WGS84 to SVY21",
  "SVY21 to local Three.js coordinates",
  "Elevation / z-axis handling",
];

export function ViewerArchitectureDemo() {
  const [mode, setMode] = useState<ViewerMode>("osm-map");

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <TopLeftTogglePanel value={mode} onChange={setMode} />
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-medium text-stone-50">Three.js Canvas</h2>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-300">
              {viewerModeLabels[mode]}
            </span>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-stone-300 sm:grid-cols-3">
            {canvasCapabilities.map((capability) => (
              <div key={capability} className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
                {capability}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-400">
            The active mode is handled at the shell level first. Later, each mode should mount its own scene component instead of sharing one large conditional canvas.
          </p>
        </section>

        <MapComponentPlaceholder activeMode={viewerModeLabels[mode]} />

        <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
          <h2 className="text-xl font-medium text-stone-50">Coordinate Utils</h2>
          <div className="mt-4 grid gap-3 text-sm text-stone-300 sm:grid-cols-3">
            {coordinateCapabilities.map((capability) => (
              <div key={capability} className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
                {capability}
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
