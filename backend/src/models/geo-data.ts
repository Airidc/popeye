import { model, Schema } from "mongoose";
import { GeoLine } from "src/interface/geo-data";

const routeObject = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["Point", "LineString", "Polygon"],
    default: "LineString",
  },
  route: {
    type: String,
    enum: ["Home to Work", "Work to Home", "Lunch"],
  },
  coordinates: [[{ type: [Number] }]],
});

export const GeoLineModel = model<GeoLine>("GeoLine", routeObject);
