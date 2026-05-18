import { NextResponse } from "next/server";
import { getOverpassExample, studyRegion, type OverpassResponse, type OSMElement } from "@/lib/osm-overpass";
import { parseOsmXml } from "@/lib/osm-parser";

export const dynamic = "force-dynamic";

function filterElements(elements: OSMElement[], exampleId: string): OSMElement[] {
  switch (exampleId) {
    case "buildings":
      return elements.filter(
        (el) => el.tags?.building !== undefined
      );
    case "roads":
      return elements.filter(
        (el) => el.tags?.highway !== undefined && el.type === "way"
      );
    case "pois":
      return elements.filter(
        (el) =>
          el.tags?.amenity !== undefined ||
          el.tags?.shop !== undefined
      );
    default:
      return elements;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exampleId = searchParams.get("example");

  if (!exampleId) {
    return NextResponse.json({ error: "Missing example query id." }, { status: 400 });
  }

  const example = getOverpassExample(exampleId);

  if (!example) {
    return NextResponse.json({ error: `Unknown example: ${exampleId}` }, { status: 404 });
  }

  try {
    // Use OSM Direct Export API instead of Overpass
    // Format: https://api.openstreetmap.org/api/0.6/map?bbox=minlon,minlat,maxlon,maxlat
    const { bbox } = studyRegion;
    const bboxParam = `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`;

    const response = await fetch(`https://api.openstreetmap.org/api/0.6/map?bbox=${bboxParam}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `OSM API failed with status ${response.status}` },
        { status: 502 }
      );
    }

    const xmlText = await response.text();
    let osmData = parseOsmXml(xmlText);

    // Filter elements based on the example type
    osmData = filterElements(osmData, exampleId);

    // Convert OSM data to OverpassResponse format for compatibility
    const overpassResponse: OverpassResponse = {
      elements: osmData,
    };

    return NextResponse.json({
      example,
      region: studyRegion,
      endpoint: "https://api.openstreetmap.org/api/0.6/map",
      data: overpassResponse,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error while querying OSM.",
      },
      { status: 500 },
    );
  }
}
