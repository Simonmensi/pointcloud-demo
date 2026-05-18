import { type OSMElement } from "./osm-overpass";

/**
 * Parse OSM XML response from api.openstreetmap.org/api/0.6/map
 * and convert to array of OSMElement
 */
export function parseOsmXml(xmlText: string): OSMElement[] {
  const elements: OSMElement[] = [];

  // Simple XML parser - split by opening tags
  const nodeMatches = xmlText.matchAll(/<node[^>]*?id="(\d+)"[^>]*?lat="([^"]*)"[^>]*?lon="([^"]*)"[^>]*?(\/?>)/g);
  const wayMatches = xmlText.matchAll(/<way[^>]*?id="(\d+)"[^>]*?(\/?>)/g);
  const relationMatches = xmlText.matchAll(
    /<relation[^>]*?id="(\d+)"[^>]*?(\/?>)/g
  );

  // Parse nodes
  for (const match of nodeMatches) {
    const id = parseInt(match[1], 10);
    const lat = parseFloat(match[2]);
    const lon = parseFloat(match[3]);
    const isSelfClosing = match[4] === "/>";

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
