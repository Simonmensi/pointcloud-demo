"use client";

import dynamic from "next/dynamic";

const LeafletStudyMap = dynamic(
  () => import("@/components/map/LeafletStudyMap").then((module) => module.LeafletStudyMap),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-[2rem] border border-stone-800 bg-stone-900/60 p-6 text-sm text-stone-400">
        Preparing client-only Leaflet map...
      </section>
    ),
  },
);

export function LeafletStudyMapClient() {
  return <LeafletStudyMap />;
}
