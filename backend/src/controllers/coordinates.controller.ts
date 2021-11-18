import { BasicSocketController } from "src/interface";
import * as socketio from "socket.io";
import { GeoService } from "src/services";

export class CoordinatesController implements BasicSocketController {
  constructor() {}

  registerEvents(socket: socketio.Socket) {
    try {
      socket.on("getCoordinates", this.getCoordinates);
    } catch (error) {
      socket.on("error", () => error);
    }
  }

  private getCoordinates = async (route: string, interval: number) => {
    const geoRoute = await GeoService.getCoordinates(route);
    const coordLength = geoRoute.coordinates.length;
    if (coordLength === 0) return;

    // (function loop(i: number) {
    //   setTimeout(() => {}, interval * 1000);
    // })(coordLength);
  };
}
