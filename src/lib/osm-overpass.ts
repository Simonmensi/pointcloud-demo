export type OSMElementType = "node" | "way" | "relation";

export type OSMCoordinate = {
  lat: number;
  lon: number;
};

export type OSMElement = {
  id: number;
  type: OSMElementType;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
  center?: OSMCoordinate;
};

export type OverpassResponse = {
  elements: OSMElement[];
};

export type OverpassExample = {
  id: "buildings" | "roads" | "pois";
  title: string;
  description: string;
  focus: string;
  query: string;
};

export type StudyRegion = {
  name: string;
  description: string;
  bbox: {
    south: number;
    west: number;
    north: number;
    east: number;
  };
  center: {
    latitude: number;
    longitude: number;
  };
};

export type OverpassSummaryRow = {
  id: number;
  type: OSMElementType;
  name: string;
  primaryTag: string;
  coordinate: string;
};

export const studyRegion: StudyRegion = {
  name: "Bras Basah / Bugis, Singapore",
  description:
    "A compact central Singapore area that contains dense buildings, multiple road types, and many amenities.",
  bbox: {
    south: 1.2970,
    west: 103.8500,
    north: 1.3000,
    east: 103.8550,
  },
  center: {
    latitude: 1.2985,
    longitude: 103.8525,
  },
};

function formatBbox(region: StudyRegion) {
  const { south, west, north, east } = region.bbox;
  return `${south},${west},${north},${east}`;
}

const bbox = formatBbox(studyRegion);

export const overpassExamples: OverpassExample[] = [
  {
    id: "buildings",
    title: "Buildings",
    description:
      "Query building footprints and building relations so you can see how area features are stored in OSM. We'll show all ways and relations tagged with building=*.",
    focus: "OSM Tag focus: building=*",
    query: `OSM Direct Export Query:\nRegion: ${studyRegion.name}\nBBox: ${bbox}\nFiltering for: building=* tags on ways and relations`,
  },
  {
    id: "roads",
    title: "Roads",
    description:
      "Query roads in the same region and compare the returned highway tags with the building result shape. Look for linear ways tagged with highway=*.",
    focus: "OSM Tag focus: highway=*",
    query: `OSM Direct Export Query:\nRegion: ${studyRegion.name}\nBBox: ${bbox}\nFiltering for: highway=* tags on ways`,
  },
  {
    id: "pois",
    title: "POIs",
    description:
      "Query amenities and shops to study point-like and area-like points of interest. OSM stores POIs as nodes, ways, or relations with amenity=* or shop=* tags.",
    focus: "OSM Tag focus: amenity=* and shop=*",
    query: `OSM Direct Export Query:\nRegion: ${studyRegion.name}\nBBox: ${bbox}\nFiltering for: amenity=* or shop=* tags on nodes, ways, and relations`,
  },
];

export const osmPrimer = [
  {
    title: "Node",
    description:
      "A single coordinate. OSM uses nodes for point features such as bus stops, cafes, and entrances.",
  },
  {
    title: "Way",
    description:
      "An ordered list of nodes. Ways are commonly used for roads, building outlines, and other linear or area features.",
  },
  {
    title: "Relation",
    description:
      "A grouped structure that connects multiple OSM elements. Relations are used for more complex features or multi-part geometry.",
  },
  {
    title: "Tag",
    description:
      "Key-value metadata attached to nodes, ways, or relations. Examples include building=yes, highway=primary, and amenity=school.",
  },
];

export function getOverpassExample(exampleId: string) {
  return overpassExamples.find((example) => example.id === exampleId) ?? null;
}

function getElementCoordinate(element: OSMElement) {
  if (typeof element.lat === "number" && typeof element.lon === "number") {
    return { lat: element.lat, lon: element.lon };
  }

  return element.center ?? null;
}

function formatCoordinate(element: OSMElement) {
  const coordinate = getElementCoordinate(element);

  if (!coordinate) {
    return "n/a";
  }

  return `${coordinate.lat.toFixed(5)}, ${coordinate.lon.toFixed(5)}`;
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

export function summarizeOverpass(elements: OSMElement[]) {
  const typeCounts = elements.reduce<Record<OSMElementType, number>>(
    (counts, element) => {
      counts[element.type] += 1;
      return counts;
    },
    { node: 0, way: 0, relation: 0 },
  );

  const sampleRows: OverpassSummaryRow[] = elements.slice(0, 8).map((element) => ({
    id: element.id,
    type: element.type,
    name: element.tags?.name ?? "Unnamed feature",
    primaryTag: getPrimaryTag(element),
    coordinate: formatCoordinate(element),
  }));

  return {
    total: elements.length,
    typeCounts,
    sampleRows,
  };
}
