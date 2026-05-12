export type Wgs84Coordinate = {
  latitude: number;
  longitude: number;
  elevation?: number;
};

export type Svy21Coordinate = {
  northing: number;
  easting: number;
  elevation?: number;
};

export type LocalSceneCoordinate = {
  x: number;
  y: number;
  z: number;
};

// Phase 1 keeps these as explicit placeholders so later map and canvas work share the same conversion boundary.
export function wgs84ToSvy21(_coordinate: Wgs84Coordinate): Svy21Coordinate {
  void _coordinate;
  throw new Error("wgs84ToSvy21 is not implemented yet.");
}

export function svy21ToLocalScene(_coordinate: Svy21Coordinate): LocalSceneCoordinate {
  void _coordinate;
  throw new Error("svy21ToLocalScene is not implemented yet.");
}

export function applyElevation(
  coordinate: Omit<LocalSceneCoordinate, "z">,
  elevation = 0,
): LocalSceneCoordinate {
  return {
    ...coordinate,
    z: elevation,
  };
}
