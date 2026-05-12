import Link from "next/link";
import { demoRoutes } from "@/lib/routes";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-400">PointCloud Demo</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            One app for four learning tracks
          </h1>
          <p className="max-w-3xl text-base text-stone-300 sm:text-lg">
            This project follows the weekly plan: learn OSM and Overpass first, add a
            Leaflet map in Next.js, prove the Three.js viewer architecture, and finish
            with a small point-cloud proof of concept.
          </p>
          <p className="max-w-3xl text-sm leading-6 text-stone-400 sm:text-base">
            The shared architecture now follows your diagram: a top-left toggle panel,
            a Three.js canvas layer, a map component layer, and coordinate utilities for
            georeferenced workflows.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {demoRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6 transition hover:border-stone-600 hover:bg-stone-900"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-stone-500">{route.label}</p>
              <h2 className="mt-3 text-2xl font-medium text-stone-50">{route.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">{route.description}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-amber-300">
                {route.status}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
