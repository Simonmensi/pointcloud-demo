import { type OSMElement } from "./osm-overpass";

/**
 * Parse OSM XML response from api.openstreetmap.org/api/0.6/map
 * and convert to array of OSMElement
 */
export function parseOsmXml(xmlText: string): OSMElement[] {
  const elements: OSMElement[] = [];
  const nodeCoordinates = new Map<number, { lat: number; lon: number }>();

  // Simple XML parser - split by opening tags
  const nodeMatches = xmlText.matchAll(/<node[^>]*?id="(\d+)"[^>]*?lat="([^"]*)"[^>]*?lon="([^"]*)"[^>]*?(\/?>)/g);
  const wayMatches = xmlText.matchAll(/<way[^>]*?id="(\d+)"[^>]*?(\/?>)/g);
  const relationMatches = xmlText.matchAll(
    /<relation[^>]*?id="(\d+)"[^>]*?(\/?>)/g
  );

  // First pass: Parse nodes and store coordinates for later use
  for (const match of nodeMatches) {
    const id = parseInt(match[1], 10);
    const lat = parseFloat(match[2]);
    const lon = parseFloat(match[3]);
    const isSelfClosing = match[4] === "/>";

    // Store node coordinates for ways/relations to reference
    nodeCoordinates.set(id, { lat, lon });

    // Extract tags if not self-closing
    let tags: Record<string, string> | undefined;
    if (!isSelfClosing) {
      const nodeEnd = xmlText.indexOf("</node>", xmlText.indexOf(`id="${id}"`));
      const nodeXml = xmlText.substring(xmlText.indexOf(`id="${id}"`), nodeEnd);
      tags = extractTags(nodeXml);
    }

    elements.push({
      id,
      type: "node",
      lat,
      lon,
      ...(tags && { tags }),
    });
  }

  // Parse ways
  for (const match of wayMatches) {
    const id = parseInt(match[1], 10);
    const isSelfClosing = match[2] === "/>";

    let tags: Record<string, string> | undefined;
    let center: { lat: number; lon: number } | undefined;

    if (!isSelfClosing) {
      const wayEnd = xmlText.indexOf("</way>", xmlText.indexOf(`id="${id}"`));
      const wayXml = xmlText.substring(xmlText.indexOf(`id="${id}"`), wayEnd);
      tags = extractTags(wayXml);
      center = extractCenter(wayXml);
      
      // If center not found, calculate from node refs
      if (!center) {
        center = calculateCenterFromNodeRefs(wayXml, nodeCoordinates);
      }
    }

    elements.push({
      id,
      type: "way",
      ...(tags && { tags }),
      ...(center && { center }),
    });
  }

  // Parse relations
  for (const match of relationMatches) {
    const id = parseInt(match[1], 10);
    const isSelfClosing = match[2] === "/>";

    let tags: Record<string, string> | undefined;
    let center: { lat: number; lon: number } | undefined;

    if (!isSelfClosing) {
      const relationEnd = xmlText.indexOf(
        "</relation>",
        xmlText.indexOf(`id="${id}"`)
      );
      const relationXml = xmlText.substring(
        xmlText.indexOf(`id="${id}"`),
        relationEnd
      );
      tags = extractTags(relationXml);
      center = extractCenter(relationXml);
      
      // If center not found, calculate from member refs
      if (!center) {
        center = calculateCenterFromMemberRefs(relationXml, nodeCoordinates);
      }
    }

    elements.push({
      id,
      type: "relation",
      ...(tags && { tags }),
      ...(center && { center }),
    });
  }

  return elements;
}

function extractTags(xml: string): Record<string, string> {
  const tags: Record<string, string> = {};
  const tagMatches = xml.matchAll(/<tag[^>]*?k="([^"]*)"[^>]*?v="([^"]*)"/g);

  for (const match of tagMatches) {
    const key = match[1];
    const value = match[2];
    // Decode HTML entities
    tags[key] = decodeHtmlEntities(value);
  }

  return tags;
}

function extractCenter(xml: string): { lat: number; lon: number } | undefined {
  const centerMatch = xml.match(/<center[^>]*?lat="([^"]*)"[^>]*?lon="([^"]*)"/);
  if (centerMatch) {
    return {
      lat: parseFloat(centerMatch[1]),
      lon: parseFloat(centerMatch[2]),
    };
  }
  return undefined;
}

function decodeHtmlEntities(text: string): string {
  const entityMap: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
  };
  return text.replace(/&[a-zA-Z]+;/g, (entity) => entityMap[entity] || entity);
}

function calculateCenterFromNodeRefs(
  xml: string,
  nodeCoordinates: Map<number, { lat: number; lon: number }>
): { lat: number; lon: number } | undefined {
  const ndMatches = xml.matchAll(/<nd[^>]*?ref="(\d+)"/g);
  const coords: { lat: number; lon: number }[] = [];

  for (const match of ndMatches) {
    const nodeId = parseInt(match[1], 10);
    const coord = nodeCoordinates.get(nodeId);
    if (coord) {
      coords.push(coord);
    }
  }

  if (coords.length === 0) {
    return undefined;
  }

  // Calculate average lat/lon
  const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
  const avgLon = coords.reduce((sum, c) => sum + c.lon, 0) / coords.length;

  return { lat: avgLat, lon: avgLon };
}

function calculateCenterFromMemberRefs(
  xml: string,
  nodeCoordinates: Map<number, { lat: number; lon: number }>
): { lat: number; lon: number } | undefined {
  const memberMatches = xml.matchAll(/<member[^>]*?type="node"[^>]*?ref="(\d+)"/g);
  const coords: { lat: number; lon: number }[] = [];

  for (const match of memberMatches) {
    const nodeId = parseInt(match[1], 10);
    const coord = nodeCoordinates.get(nodeId);
    if (coord) {
      coords.push(coord);
    }
  }

  if (coords.length === 0) {
    return undefined;
  }

  // Calculate average lat/lon
  const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
  const avgLon = coords.reduce((sum, c) => sum + c.lon, 0) / coords.length;

  return { lat: avgLat, lon: avgLon };
}
