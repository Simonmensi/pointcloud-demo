type MapComponentPlaceholderProps = {
  activeMode: string;
};

export function MapComponentPlaceholder({ activeMode }: MapComponentPlaceholderProps) {
  return (
    <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium text-stone-50">Map Component</h2>
        <span className="rounded-full border border-stone-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-300">
          Active mode: {activeMode}
        </span>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-stone-300 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">OSM tiles / vector map</div>
        <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">Overpass queried features</div>
        <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">Georeferenced location</div>
      </div>
    </section>
  );
}
