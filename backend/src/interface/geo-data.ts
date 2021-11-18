export interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: [GeoFeature];
}

export interface GeoFeature {
  type: "Feature";
  properties: any;
  geometry: GeoLine;
}

export interface GeoLine {
  route?: string;
  type: "LineString";
  coordinates: number[][];
}
