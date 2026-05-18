import { osmPrimer } from "@/lib/osm-overpass";

export function OSMPrimer() {
  return (
    <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-stone-500">OSM Primer</p>
        <h2 className="text-2xl font-medium text-stone-50">The 4 concepts to remember first</h2>
        <p className="max-w-3xl text-sm leading-6 text-stone-300 sm:text-base">
          For this project, you do not need deep cartography. You only need to understand what OSM stores and how Overpass can search that data.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {osmPrimer.map((item) => (
          <article key={item.title} className="rounded-2xl border border-stone-800 bg-stone-950/70 p-5">
            <h3 className="text-lg font-medium text-stone-100">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
