export const viewerModes = [
  "ifc",
  "osm-map",
  "google-map-like",
  "point-cloud",
  "mesh-glb",
] as const;

export type ViewerMode = (typeof viewerModes)[number];

export const viewerModeLabels: Record<ViewerMode, string> = {
  ifc: "IFC Viewer",
  "osm-map": "OSM / Map Viewer",
  "google-map-like": "Google Map-like Viewer",
  "point-cloud": "Point Cloud Viewer",
  "mesh-glb": "Mesh / GLB Viewer",
};
