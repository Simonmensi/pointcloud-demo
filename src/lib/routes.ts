export type DemoRoute = {
  href: string;
  label: string;
  title: string;
  description: string;
  status: string;
};

export const demoRoutes: DemoRoute[] = [
  {
    href: "/osm-overpass",
    label: "Part 01",
    title: "OSM + Overpass",
    description:
      "Learn OSM core objects, tags, and basic Overpass queries for buildings, roads, and POIs.",
    status: "Primer and query examples",
  },
  {
    href: "/leaflet-map",
    label: "Part 02",
    title: "Leaflet Map",
    description:
      "Render an OSM map in Next.js with a top-left dropdown for layer toggles.",
    status: "Map route scaffolded",
  },
  {
    href: "/three-viewer",
    label: "Part 03",
    title: "Three.js Viewer",
    description:
      "Prove a clean viewer-mode architecture before adding heavier loaders and data.",
    status: "Viewer route scaffolded",
  },
  {
    href: "/point-cloud",
    label: "Part 04",
    title: "Point Cloud POC",
    description:
      "Start with a small static 10k-point sample and verify the browser-side rendering path.",
    status: "POC route scaffolded",
  },
];
