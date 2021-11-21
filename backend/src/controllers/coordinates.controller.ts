import { BasicSocketController } from "../interface";
import * as socketio from "socket.io";
import { GeoService } from "../services";

export class CoordinatesController implements BasicSocketController {
  io: socketio.Server;
  socket: socketio.Socket;
  streamInterval = 1;
  routeStreamInterval: any;

  constructor(io: socketio.Server, socket: socketio.Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerHandlers() {
    try {
      this.socket.on("getCoordinates", this.getCoordinates);
      this.socket.on("updateInterval", (interval: number) => {
        // console.log("Updating interval ->", interval);
        this.streamInterval = interval;
      });
    } catch (error) {
      this.socket.on("error", () => error);
    }
  }

  private getCoordinates = async (route: string, interval: number) => {
    // console.log("Route:", route);
    const geoRoute = await GeoService.getCoordinates(route);
    const coordLength = geoRoute.coordinates.length;
    if (coordLength === 0) return;
    this.streamInterval = interval;

    // console.log("Coordinates length", coordLength);
    for (var i = 0; i <= coordLength; i++) {
      if (!this.socket.connected) {
        // console.log("--[Socket closed] Returning from loop");
        return;
      }

      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // console.log("Starting to stream coordinates");

          this.socket.emit("coordinates", geoRoute.coordinates[i]);
          resolve();
        }, this.streamInterval * 1000);
      });
    }
  };
}
