import { GeoLine } from "../interface";
import { GeoLineModel } from "../models/geo-data";

export async function getCoordinates(route: string): Promise<GeoLine> {
  const geoObj = (await GeoLineModel.findOne({ route: route })) as GeoLine;
  return geoObj;
}
