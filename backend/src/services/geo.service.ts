import { GeoLine } from "src/interface";
import { GeoLineModel } from "src/models/geo-data";

export async function getCoordinates(route: string): Promise<GeoLine> {
  const geoObj = (await GeoLineModel.findOne({ route: route })) as GeoLine;
  return geoObj;
}
