import { BasicSocketController } from "../interface";
import * as socketio from "socket.io";
import { GeoService } from "../services";

export class CoordinatesController implements BasicSocketController {
  io: socketio.Server;
  socket: socketio.Socket;

  constructor(io: socketio.Server, socket: socketio.Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerHandlers() {
    try {
      this.socket.on("getCoordinates", this.getCoordinates);
    } catch (error) {
      this.socket.on("error", () => error);
    }
  }

  private getCoordinates = async (route: string, interval: number) => {
    const geoRoute = await GeoService.getCoordinates(route);
    const coordLength = geoRoute.coordinates.length;
    if (coordLength === 0) return;

    (function loop(i: number, socket: socketio.Socket) {
      setTimeout(() => {
        socket.emit("coordinates", geoRoute.coordinates[coordLength - i]);
        i--;
        loop(i, socket);
      }, interval * 1000);
    })(coordLength, this.socket);
  };
}
