"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Polygon, Polyline, Popup, TileLayer } from "react-leaflet";
import { type OSMCoordinate, type OSMElement, studyRegion } from "@/lib/osm-overpass";

type ExampleId = "buildings" | "roads" | "pois";
type LayerMode = ExampleId | "all";

type ExampleData = {
  elements: OSMElement[];
};

type OverlayState = Record<ExampleId, ExampleData>;

const layerOptions: { value: LayerMode; label: string; description: string }[] = [
  {
    value: "all",
    label: "All overlays",
    description: "Show buildings, roads, and POIs together.",
  },
  {
    value: "buildings",
    label: "Buildings",
    description: "Polygon building footprints from OSM ways tagged with building=*.",
  },
  {
    value: "roads",
    label: "Roads",
    description: "Road centerlines from OSM ways tagged with highway=*.",
  },
  {
    value: "pois",
    label: "POIs",
    description: "Point-like amenities and shops from OSM.",
  },
];

const emptyData: OverlayState = {
  buildings: { elements: [] },
  roads: { elements: [] },
  pois: { elements: [] },
};

function toLatLngs(geometry: OSMCoordinate[]) {
  return geometry.map(({ lat, lon }) => [lat, lon] as [number, number]);
}

function getElementCoordinate(element: OSMElement) {
  if (typeof element.lat === "number" && typeof element.lon === "number") {
    return { lat: element.lat, lon: element.lon };
  }

  return element.center ?? null;
}

function getPrimaryTag(element: OSMElement) {
  const tags = element.tags ?? {};

  if (tags.building) {
    return `building=${tags.building}`;
  }

  if (tags.highway) {
    return `highway=${tags.highway}`;
  }

  if (tags.amenity) {
    return `amenity=${tags.amenity}`;
  }

  if (tags.shop) {
    return `shop=${tags.shop}`;
  }

  const firstEntry = Object.entries(tags)[0];
  return firstEntry ? `${firstEntry[0]}=${firstEntry[1]}` : "no tags";
}

function FeaturePopup({ element }: { element: OSMElement }) {
  const coordinate = getElementCoordinate(element);

  return (
    <Popup>
      <div className="space-y-1 text-sm text-stone-900">
        <p className="font-semibold text-stone-950">{element.tags?.name ?? "Unnamed feature"}</p>
        <p>{getPrimaryTag(element)}</p>
        {coordinate ? <p>{`${coordinate.lat.toFixed(5)}, ${coordinate.lon.toFixed(5)}`}</p> : null}
      </div>
    </Popup>
  );
}

function OverlayControls({
  value,
  onChange,
}: {
  value: LayerMode;
  onChange: (value: LayerMode) => void;
}) {
  const activeOption = layerOptions.find((option) => option.value === value) ?? layerOptions[0];

  return (
    <div className="absolute left-4 top-4 z-[1000] w-72 rounded-3xl border border-stone-800 bg-stone-950/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Top-left Toggle Panel</p>
      <label className="mt-3 block text-sm text-stone-300" htmlFor="leaflet-layer-mode">
        Overlay layer
      </label>
      <select
        id="leaflet-layer-mode"
        className="mt-2 w-full rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-400"
        value={value}
        onChange={(event) => onChange(event.target.value as LayerMode)}
      >
        {layerOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="mt-3 text-sm leading-6 text-stone-400">{activeOption.description}</p>
    </div>
  );
}

export function LeafletStudyMap() {
  const [layerMode, setLayerMode] = useState<LayerMode>("all");
  const [overlays, setOverlays] = useState<OverlayState>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOverlays() {
      try {
        setLoading(true);
        setError(null);

        const exampleIds: ExampleId[] = ["buildings", "roads", "pois"];
        const responses = await Promise.all(
          exampleIds.map(async (exampleId) => {
            const response = await fetch(`/api/overpass?example=${exampleId}`, { cache: "no-store" });

            if (!response.ok) {
              throw new Error(`Failed to load ${exampleId} data.`);
            }

            const payload = (await response.json()) as { data: ExampleData };
            return [exampleId, payload.data] as const;
          }),
        );

        if (cancelled) {
          return;
        }

        setOverlays(
          responses.reduce<OverlayState>((next, [exampleId, data]) => {
            next[exampleId] = data;
            return next;
          }, { ...emptyData }),
        );
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : "Failed to load overlay data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOverlays();

    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      buildings: overlays.buildings.elements.length,
      roads: overlays.roads.elements.length,
      pois: overlays.pois.elements.length,
    }),
    [overlays],
  );

  const showBuildings = layerMode === "all" || layerMode === "buildings";
  const showRoads = layerMode === "all" || layerMode === "roads";
  const showPois = layerMode === "all" || layerMode === "pois";

  return (
    <section className="space-y-4 rounded-[2rem] border border-stone-800 bg-stone-900/60 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-medium text-stone-50">Leaflet Study Map</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">
            This map uses the Phase 2 API directly and renders real OSM way geometry for buildings and
            roads, so Phase 3 becomes a proper overlay viewer instead of a marker-only demo.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.2em] text-stone-400">
          <div className="rounded-2xl border border-stone-800 bg-stone-950/60 px-3 py-2 text-center">
            <span className="block text-stone-500">Buildings</span>
            <span className="mt-1 block text-sm text-stone-100">{counts.buildings}</span>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-950/60 px-3 py-2 text-center">
            <span className="block text-stone-500">Roads</span>
            <span className="mt-1 block text-sm text-stone-100">{counts.roads}</span>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-950/60 px-3 py-2 text-center">
            <span className="block text-stone-500">POIs</span>
            <span className="mt-1 block text-sm text-stone-100">{counts.pois}</span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-[2rem] border border-stone-800">
        <OverlayControls value={layerMode} onChange={setLayerMode} />

        {loading ? (
          <div className="flex h-[34rem] items-center justify-center bg-stone-950 text-sm text-stone-400">
            Loading OSM overlays...
          </div>
        ) : (
          <MapContainer
            center={[studyRegion.center.latitude, studyRegion.center.longitude]}
            zoom={17}
            scrollWheelZoom
            className="h-[34rem] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {showBuildings
              ? overlays.buildings.elements.map((element) => {
                  if (!element.geometry || element.geometry.length < 3) {
                    return null;
                  }

                  return (
                    <Polygon
                      key={`building-${element.id}`}
                      positions={toLatLngs(element.geometry)}
                      pathOptions={{ color: "#f59e0b", weight: 2, fillColor: "#f59e0b", fillOpacity: 0.25 }}
                    >
                      <FeaturePopup element={element} />
                    </Polygon>
                  );
                })
              : null}

            {showRoads
              ? overlays.roads.elements.map((element) => {
                  if (!element.geometry || element.geometry.length < 2) {
                    return null;
                  }

                  return (
                    <Polyline
                      key={`road-${element.id}`}
                      positions={toLatLngs(element.geometry)}
                      pathOptions={{ color: "#60a5fa", weight: 4, opacity: 0.75 }}
                    >
                      <FeaturePopup element={element} />
                    </Polyline>
                  );
                })
              : null}

            {showPois
              ? overlays.pois.elements.map((element) => {
                  const coordinate = getElementCoordinate(element);

                  if (!coordinate) {
                    return null;
                  }

                  return (
                    <CircleMarker
                      key={`poi-${element.type}-${element.id}`}
                      center={[coordinate.lat, coordinate.lon]}
                      radius={6}
                      pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.9, weight: 1 }}
                    >
                      <FeaturePopup element={element} />
                    </CircleMarker>
                  );
                })
              : null}
          </MapContainer>
        )}
      </div>
    </section>
  );
}
