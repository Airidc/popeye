import { BasicSocketController } from "../interface";
import * as socketio from "socket.io";
import { GeoService } from "../services";

export class CoordinatesController implements BasicSocketController {
  io: socketio.Server;
  socket: socketio.Socket;
  cancelCurrentRoute = false;

  constructor(io: socketio.Server, socket: socketio.Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerHandlers() {
    try {
      this.socket.on("getCoordinates", this.getCoordinates);
      this.socket.on("cancelCurrentRoute", () => {
        this.cancelCurrentRoute = true;
      });
    } catch (error) {
      this.socket.on("error", () => error);
    }
  }

  private getCoordinates = async (route: string, interval: number) => {
    if (this.cancelCurrentRoute) {
      this.socket.emit("cancellingCurrentRoute");
      return;
    }
    console.log("Route:", route);
    const geoRoute = await GeoService.getCoordinates(route);
    const coordLength = geoRoute.coordinates.length;
    if (coordLength === 0) return;

    const loop = (i: number, socket: socketio.Socket) => {
      setTimeout(() => {
        if (i === -1) return;
        if (this.cancelCurrentRoute) {
          this.cancelCurrentRoute = false;
          return;
        }
        socket.emit("coordinates", geoRoute.coordinates[coordLength - i]);
        i--;
        loop(i, socket);
      }, interval * 1000);
    };

    loop(coordLength, this.socket);
  };
}
